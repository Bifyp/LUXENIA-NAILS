import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { registerSchema } from '@/lib/validations';
import { digestCode } from '@/lib/email-codes';
import { withRateLimit, LIMITS, checkRateLimit } from '@/lib/rate-limiter';
import { z } from 'zod';
const schema = registerSchema.extend({ code: z.string().regex(/^\d{6}$/) });
export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, LIMITS.verifyCode);
  if (limited) return limited;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  const { email, password, name, code } = parsed.data;
  const accountLimit = await checkRateLimit(email, { ...LIMITS.verifyCode, keyPrefix: 'verify-account' });
  if (!accountLimit.allowed) return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  const hashed = await hash(password, 12);
  try {
    await prisma.$transaction(async (tx) => {
      const consumed = await tx.emailCode.deleteMany({ where: { email, purpose: 'registration', code: digestCode(email, 'registration', code), expiresAt: { gt: new Date() } } });
      if (consumed.count !== 1) throw new Error('INVALID_CODE');
      await tx.user.create({ data: { email, password: hashed, name, emailVerified: new Date() } });
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
  }
}
