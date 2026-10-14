import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';
import { issueEmailCode } from '@/lib/email-codes';
import { withRateLimit, LIMITS } from '@/lib/rate-limiter';
import { createLogger } from '@/lib/logger';
const logger = createLogger('registration');
export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, LIMITS.auth);
  if (limited) return limited;
  const input = registerSchema.safeParse(await req.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  try {
    const existing = await prisma.user.findUnique({ where: { email: input.data.email } });
    if (!existing) await issueEmailCode(input.data.email, 'registration');
    // Same response for existing addresses; no unverified registration bypass.
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error({ err }, 'Registration failed');
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
