import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailSchema } from '@/lib/validations';
import { issueEmailCode } from '@/lib/email-codes';
import { withRateLimit, LIMITS } from '@/lib/rate-limiter';
import { z } from 'zod';
const schema = z.object({ email: emailSchema });
export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, LIMITS.passwordReset);
  if (limited) return limited;
  const input = schema.safeParse(await req.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  try {
    const user = await prisma.user.findUnique({ where: { email: input.data.email } });
    if (user) await issueEmailCode(input.data.email, 'password-reset');
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: 'Request failed' }, { status: 500 }); }
}
