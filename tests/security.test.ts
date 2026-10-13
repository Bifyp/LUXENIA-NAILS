import { describe, it, expect, vi } from 'vitest';
import { isSameOriginRequest } from '@/lib/csrf';
import { availableBookingSlot, validBookingDay } from '@/lib/booking-rules';
import { escapeHtml } from '@/lib/html';
import { buildJsonFromEntries } from '@/lib/flattenJson';
import { mergeMessages } from '@/lib/merge-messages';
import { passwordSchema, emailSchema } from '@/lib/validations';
import { checkRateLimit, clientIp } from '@/lib/rate-limiter';
import { digestCode } from '@/lib/email-codes';

describe('security invariants', () => {
  const request = (origin?: string) => new Request('https://luxenia.example/api/bookings', { method: 'POST', headers: origin ? { origin } : {} });
  it('compares exact origins and rejects missing or lookalike origins', () => {
    expect(isSameOriginRequest(request('https://luxenia.example'), 'https://luxenia.example')).toBe(true);
    for (const origin of [undefined, 'null', 'https://luxenia.example.evil.test', 'http://luxenia.example']) expect(isSameOriginRequest(request(origin), 'https://luxenia.example')).toBe(false);
    expect(isSameOriginRequest(new Request('https://luxenia.example'), 'https://luxenia.example')).toBe(true);
  });
  it('validates actual dates, studio hours and local Warsaw time', () => {
    expect(validBookingDay('2026-02-30')).toBe(false);
    expect(validBookingDay('2026-10-13T00:00:00Z')).toBe(false);
    expect(validBookingDay('2028-02-29')).toBe(true);
    const now = new Date('2026-10-13T08:00:00Z'); // Warsaw 10:00
    expect(availableBookingSlot('2026-10-13', '09:30', now)).toBe(false);
    expect(availableBookingSlot('2026-10-13', '10:30', now)).toBe(true);
    expect(availableBookingSlot('2026-10-14', '25:00', now)).toBe(false);
    expect(availableBookingSlot('2026-10-18', '09:30', now)).toBe(false);
  });
  it('escapes user values for mail templates', () => {
    expect(escapeHtml('<img src=x onerror="alert(1)">&')).toBe('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&amp;');
  });
  it('rejects prototype pollution keys and merges translations without losing defaults', () => {
    expect(() => buildJsonFromEntries([{ section: 'HomePage', key: '__proto__.polluted', value: 'true' }])).toThrow();
    expect(() => buildJsonFromEntries([{ section: '__proto__', key: 'polluted', value: 'true' }])).toThrow();
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(mergeMessages({ Form: { title: 'old', error: 'keep' } }, { Form: { title: 'new' } })).toEqual({ Form: { title: 'new', error: 'keep' } });
  });
  it('normalizes email and enforces bcrypt byte limits', () => {
    expect(emailSchema.parse(' Test@Example.com ')).toBe('test@example.com');
    expect(passwordSchema.safeParse('1234567').success).toBe(false);
    expect(passwordSchema.safeParse('é'.repeat(37)).success).toBe(false);
    expect(passwordSchema.safeParse('a'.repeat(72)).success).toBe(true);
  });
  it('does not store raw verification codes and separates code purposes', () => {
    expect(digestCode('user@example.com', 'registration', '123456')).not.toBe('123456');
    expect(digestCode('user@example.com', 'registration', '123456')).not.toBe(digestCode('user@example.com', 'password-reset', '123456'));
  });
  it('applies independent rate-limit policies, instead of a global 100/min', async () => {
    const strict = { max: 2, windowMs: 60000, keyPrefix: 'test-strict' };
    expect((await checkRateLimit('one', strict)).allowed).toBe(true);
    expect((await checkRateLimit('one', strict)).allowed).toBe(true);
    expect((await checkRateLimit('one', strict)).allowed).toBe(false);
    expect((await checkRateLimit('one', { ...strict, keyPrefix: 'test-other' })).allowed).toBe(true);
    expect(clientIp(new Request('https://example.com', { headers: { 'x-forwarded-for': 'spoofed' } }))).toBe('untrusted');
  });
});

it('fails closed without shared rate-limit storage in production', async () => {
  vi.stubEnv('NODE_ENV', 'production');
  try { expect((await checkRateLimit('prod-check', { max: 5, windowMs: 60000 })).allowed).toBe(false); }
  finally { vi.unstubAllEnvs(); }
});

it('does not submit a package editor id as an editable field', async () => {
  const { packageFormFields } = await import('@/lib/package-form');
  const { editablePackageSchema } = await import('@/lib/content-validations');
  const fields = packageFormFields({ id: 'existing-record', title: 'Package', badge: '', sessions: '3', price: '100', oldPrice: '120', savings: '', popular: false, benefits: ['Benefit'] });
  expect('id' in fields).toBe(false);
  expect(editablePackageSchema.safeParse(fields).success).toBe(true);
});
