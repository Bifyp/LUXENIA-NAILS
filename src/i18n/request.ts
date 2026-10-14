import { getRequestConfig } from 'next-intl/server';
import { hasLocale, type AbstractIntlMessages } from 'next-intl';
import { routing } from './routing';
import { prisma } from '@/lib/prisma';
import { buildJsonFromEntries } from '@/lib/flattenJson';
import { mergeMessages } from '@/lib/merge-messages';
import { createLogger } from '@/lib/logger';
const logger = createLogger('i18n');
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const base = (await import(`../../messages/${locale}.json`)).default;
  try {
    const entries = await prisma.translation.findMany({ where: { lang: locale }, select: { section: true, key: true, value: true } });
    return { locale, messages: mergeMessages(base, buildJsonFromEntries(entries)) as AbstractIntlMessages };
  } catch (err) {
    logger.error({ err }, 'Using bundled translation fallback');
    return { locale, messages: base };
  }
});
