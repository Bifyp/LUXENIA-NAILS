import { pathToFileURL } from 'node:url';
export function validateEnvironment(env) {
  const errors = [];
  for (const name of ['DATABASE_URL', 'AUTH_SECRET', 'AUTH_URL', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'ADMIN_EMAIL', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']) {
    if (!env[name]?.trim()) errors.push(`${name} is required`);
  }
  if (env.AUTH_SECRET && (env.AUTH_SECRET.length < 32 || /your-secret|change-me|test-only/i.test(env.AUTH_SECRET))) errors.push('AUTH_SECRET must be a unique random value of at least 32 characters');
  if (env.AUTH_URL) {
    try { if (new URL(env.AUTH_URL).protocol !== 'https:') errors.push('AUTH_URL must use HTTPS'); }
    catch { errors.push('AUTH_URL must be an absolute URL'); }
  }
  if (env.DATABASE_URL && (!env.DATABASE_URL.startsWith('file:/') || env.DATABASE_URL.startsWith('file:./'))) errors.push('DATABASE_URL must use an absolute persistent SQLite path');
  const port = Number(env.SMTP_PORT || '587');
  if (!Number.isInteger(port) || port < 1 || port > 65535) errors.push('SMTP_PORT is invalid');
  if (env.TRUST_PROXY !== '1') errors.push('TRUST_PROXY=1 requires a reverse proxy that overwrites IP headers and blocks direct access');
  if (!env.CLOUDINARY_URL && (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET)) errors.push('Configure Cloudinary before enabling gallery uploads');
  return errors;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // Node loads .env only when asked; Next also accepts .env.local. Mirror that precedence.
  for (const file of ['.env.production.local', '.env.local', '.env.production', '.env']) {
    try { process.loadEnvFile(file); } catch (err) { if (err.code !== 'ENOENT') throw err; }
  }
  const errors = validateEnvironment(process.env);
  if (errors.length) { console.error('Production configuration is incomplete:\n' + errors.map((e) => `- ${e}`).join('\n')); process.exitCode = 1; }
  else console.log('Production environment validation passed.');
}
