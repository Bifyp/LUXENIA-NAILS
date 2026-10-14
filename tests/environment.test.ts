import { it, expect } from 'vitest';
import { validateEnvironment } from '../scripts/check-env.mjs';
it('blocks incomplete or unsafe production configuration without exposing values', () => {
  expect(validateEnvironment({})).toContain('AUTH_SECRET is required');
  const env = { DATABASE_URL: 'file:/var/lib/luxenia/app.db', AUTH_SECRET: 'a'.repeat(48), AUTH_URL: 'https://studio.example', SMTP_HOST: 'smtp.example', SMTP_USER: 'mailer', SMTP_PASS: 'private-value', SMTP_FROM: 'studio@example.com', ADMIN_EMAIL: 'admin@example.com', UPSTASH_REDIS_REST_URL: 'https://redis.example', UPSTASH_REDIS_REST_TOKEN: 'private-token', TRUST_PROXY: '1', CLOUDINARY_URL: 'cloudinary://configured' };
  expect(validateEnvironment(env)).toEqual([]);
  expect(validateEnvironment({ ...env, AUTH_URL: 'http://studio.example' })).toContain('AUTH_URL must use HTTPS');
  expect(validateEnvironment({ ...env, DATABASE_URL: 'file:./dev.db' })).toContain('DATABASE_URL must use an absolute persistent SQLite path');
  expect(JSON.stringify(validateEnvironment({ ...env, SMTP_HOST: '' }))).not.toContain('private-value');
});
