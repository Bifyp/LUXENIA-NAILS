"use client";
import { createContext, useContext, type ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { translations, type Locale } from '@/locales/translations';
type LanguageContextType = { locale: Locale; setLocale: (locale: Locale) => void; t: typeof translations.ru };
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export function LanguageProvider({ children }: { children: ReactNode }) {
  const requested = useLocale();
  const locale = (requested in translations ? requested : 'pl') as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const setLocale = (next: Locale) => {
    const segments = pathname.split('/');
    if (segments[1] in translations) segments[1] = next;
    else segments.splice(1, 0, next);
    router.push(segments.join('/') || `/${next}`);
  };
  return <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
