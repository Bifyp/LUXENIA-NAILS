import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { isSameOriginRequest } from './lib/csrf';

const intlMiddleware = createMiddleware(routing);
function secure(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Next hydration requires inline scripts; nonce CSP is tracked in the launch checklist.
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : '') + "; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'");
  if (process.env.NODE_ENV === 'production') response.headers.set('Strict-Transport-Security', 'max-age=31536000');
  return response;
}
export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith('/api/')) {
    // Auth.js enforces its own CSRF tokens for sign-in/callback endpoints.
    const authJsPath = /^\/api\/auth\/(csrf|session|providers|signin|signout|callback|error|verify-request)(\/|$)/.test(path);
    if (!authJsPath && !path.startsWith('/api/internal/') && !isSameOriginRequest(request, process.env.AUTH_URL || process.env.NEXTAUTH_URL || request.nextUrl.origin)) {
      return secure(NextResponse.json({ error: 'Forbidden' }, { status: 403 }));
    }
    return secure(NextResponse.next());
  }
  if (path === '/admin' || path.startsWith('/admin/')) return secure(NextResponse.next());
  return secure(intlMiddleware(request));
}
export const config = { matcher: ['/((?!_next|.*\\..*).*)'] };
