import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailSchema, passwordSchema } from '@/lib/validations';
import { digestCode } from '@/lib/email-codes';
import { withRateLimit, LIMITS, checkRateLimit } from '@/lib/rate-limiter';
import { hash } from 'bcryptjs';
import { z } from 'zod';
const schema = z.object({ email: emailSchema, code: z.string().regex(/^\d{6}$/), password: passwordSchema });
export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, LIMITS.verifyCode);
  if (limited) return limited;
  const input = schema.safeParse(await req.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  const { email, code, password } = input.data;
  const accountLimit = await checkRateLimit(email, { ...LIMITS.verifyCode, keyPrefix: 'reset-account' });
  if (!accountLimit.allowed) return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  const hashed = await hash(password, 12);
  try {
    await prisma.$transaction(async (tx) => {
      const consumed = await tx.emailCode.deleteMany({ where: { email, purpose: 'password-reset', code: digestCode(email, 'password-reset', code), expiresAt: { gt: new Date() } } });
      if (consumed.count !== 1) throw new Error('INVALID_CODE');
      await tx.user.update({ where: { email }, data: { password: hashed } });
    });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 }); }
}
