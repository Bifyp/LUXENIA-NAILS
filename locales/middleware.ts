import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ru', 'en', 'pl', 'uk'],
  defaultLocale: 'ru'
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
