import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createLogger } from './logger';
const log = createLogger('rate-limit');
export interface RateLimitConfig { windowMs: number; max: number; keyPrefix?: string }
export interface RateLimitResult { allowed: boolean; remaining: number; resetAt: number; total: number }
const memory = new Map<string, { count: number; resetAt: number }>();
const limiters = new Map<string, Ratelimit>();
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN }) : null;
export async function checkRateLimit(identifier: string, config: RateLimitConfig): Promise<RateLimitResult> {
  const key = `${config.keyPrefix || 'rl'}:${config.max}:${config.windowMs}:${identifier}`;
  if (redis) {
    const policy = `${config.keyPrefix}:${config.max}:${config.windowMs}`;
    let limiter = limiters.get(policy);
    if (!limiter) { limiter = new Ratelimit({ redis, prefix: `luxenia:${policy}`, limiter: Ratelimit.slidingWindow(config.max, `${config.windowMs} ms`) }); limiters.set(policy, limiter); }
    try {
      const result = await limiter.limit(identifier);
      return { allowed: result.success, remaining: result.remaining, resetAt: result.reset, total: 0 };
    } catch (err) {
      log.error({ err }, 'Rate limit storage unavailable');
      if (process.env.NODE_ENV === 'production') return { allowed: false, remaining: 0, resetAt: Date.now() + 60000, total: 0 };
    }
  } else if (process.env.NODE_ENV === 'production') {
    return { allowed: false, remaining: 0, resetAt: Date.now() + 60000, total: 0 };
  }
  const now = Date.now();
  for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
  if (memory.size >= 10000 && !memory.has(key)) return { allowed: false, remaining: 0, resetAt: now + config.windowMs, total: 0 };
  const entry = memory.get(key) || { count: 0, resetAt: now + config.windowMs };
  entry.count++; memory.set(key, entry);
  return { allowed: entry.count <= config.max, remaining: Math.max(0, config.max - entry.count), resetAt: entry.resetAt, total: entry.count };
}
// Enable only when the reverse proxy overwrites forwarded headers and direct access is blocked.
export function clientIp(request: Request) {
  return process.env.TRUST_PROXY === '1' ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown' : 'untrusted';
}
export async function withRateLimit(request: Request, config: RateLimitConfig): Promise<NextResponse | null> {
  const result = await checkRateLimit(clientIp(request), config);
  if (result.allowed) return null;
  return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers: { 'Retry-After': String(Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000))) } });
}
export const LIMITS = {
  auth: { max: 5, windowMs: 900000, keyPrefix: 'auth' },
  passwordReset: { max: 3, windowMs: 3600000, keyPrefix: 'pwd' },
  verifyCode: { max: 5, windowMs: 900000, keyPrefix: 'verify' },
  api: { max: 100, windowMs: 60000, keyPrefix: 'api' },
  booking: { max: 10, windowMs: 3600000, keyPrefix: 'booking' },
  upload: { max: 10, windowMs: 60000, keyPrefix: 'upload' },
} satisfies Record<string, RateLimitConfig>;
export function getRateLimiter() { return limiters; }
