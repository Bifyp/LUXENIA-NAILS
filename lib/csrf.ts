// Exact origin comparison; prefix matching accepts lookalike attacker domains.
export function isSameOriginRequest(request: Request, expectedOrigin: string): boolean {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method.toUpperCase())) return true;
  const source = request.headers.get('origin') || request.headers.get('referer');
  if (!source || request.headers.get('sec-fetch-site') === 'cross-site') return false;
  try { return new URL(source).origin === new URL(expectedOrigin).origin; }
  catch { return false; }
}
