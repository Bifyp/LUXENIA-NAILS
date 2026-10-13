import { createHmac, randomInt } from 'node:crypto';
import { prisma } from './prisma';
import { sendEmailCode } from './mail';
import { createLogger } from './logger';
const logger = createLogger('email-codes');
export type CodePurpose = 'registration' | 'password-reset';
export function digestCode(email: string, purpose: CodePurpose, code: string) {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is required');
  return createHmac('sha256', secret).update(`${purpose}:${email}:${code}`).digest('hex');
}
export async function issueEmailCode(email: string, purpose: CodePurpose) {
  const code = randomInt(100000, 1000000).toString();
  const digest = digestCode(email, purpose, code);
  await prisma.emailCode.deleteMany({ where: { expiresAt: { lte: new Date() } } });
  const record = await prisma.emailCode.upsert({
    where: { email_purpose: { email, purpose } },
    create: { email, purpose, code: digest, expiresAt: new Date(Date.now() + 600000) },
    update: { code: digest, expiresAt: new Date(Date.now() + 600000) },
  });
  try { await sendEmailCode(email, code, purpose); }
  catch (err) {
    // Do not leave a usable unsent code; do not reveal SMTP details to clients.
    await prisma.emailCode.deleteMany({ where: { id: record.id, code: digest } });
    logger.error({ err }, 'Verification mail delivery failed');
  }
}
