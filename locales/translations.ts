// locales/translations.ts
import { commonTranslations, type Locale } from './common';
import { aboutTranslations } from './about';
import { bookingTranslations } from './booking';

export const translations = {
  ru: {
    ...commonTranslations.ru,
    about: aboutTranslations.ru,
    booking: bookingTranslations.ru,
  },
  uk: {
    ...commonTranslations.uk,
    about: aboutTranslations.uk,
    booking: bookingTranslations.uk,
  },
  en: {
    ...commonTranslations.en,
    about: aboutTranslations.en,
    booking: bookingTranslations.en,
  },
  pl: {
    ...commonTranslations.pl,
    about: aboutTranslations.pl,
    booking: bookingTranslations.pl,
  }
};

export type { Locale };
export type TranslationKeys = typeof translations.ru;
