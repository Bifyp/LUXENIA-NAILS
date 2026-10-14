import type { MetadataRoute } from 'next';
import { routing } from '@/src/i18n/routing';
export const dynamic = 'force-dynamic';
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.AUTH_URL || process.env.NEXTAUTH_URL;
  if (!origin) return []; // Canonical production domain is configuration, not invented content.
  const paths = ['', '/about', '/services', '/gallery', '/packages', '/contact', '/booking', '/shop'];
  return routing.locales.flatMap((locale) => paths.map((path) => ({
    url: new URL(`/${locale}${path}`, origin).href,
    alternates: { languages: Object.fromEntries(routing.locales.map((lang) => [lang, new URL(`/${lang}${path}`, origin).href])) },
  })));
}
