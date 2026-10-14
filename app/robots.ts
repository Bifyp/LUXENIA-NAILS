import type { MetadataRoute } from 'next';
export const dynamic = 'force-dynamic';
export default function robots(): MetadataRoute.Robots {
  const origin = process.env.AUTH_URL || process.env.NEXTAUTH_URL;
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/*/account', '/*/login', '/*/register', '/*/forgot-password'] },
    ...(origin ? { sitemap: new URL('/sitemap.xml', origin).href } : {}),
  };
}
