/* -----------------------------
   Глобальные стили
------------------------------ */
import "../globals.css";
import "../../styles/animations.css";

/* -----------------------------
   Типы
------------------------------ */
import type { Metadata } from "next";

/* -----------------------------
   Шрифты
------------------------------ */
import { Inter, Cormorant_Garamond } from "next/font/google";

/* -----------------------------
   Компоненты Layout
------------------------------ */
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SessionWrapper from "../../components/SessionWrapper";

/* -----------------------------
   next-intl
------------------------------ */
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from 'src/i18n/routing';

/* -----------------------------
   NextAuth
------------------------------ */
import { getServerSession } from "next-auth";

/* -----------------------------
   Настройки шрифтов
------------------------------ */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

/* -----------------------------
   Метаданные сайта
------------------------------ */
export const metadata: Metadata = {
  title: "LumaSkin - Premium Skincare Studio",
  description: "Professional skincare studio in Poznań. Premium treatments, individual approach, modern techniques.",
};

/* -----------------------------
   Основной Layout
------------------------------ */
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Распаковываем async params
  const { locale } = await params;
  
  // Проверяем что локаль валидна
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const session = await getServerSession();
  
  // ИСПРАВЛЕНО: передаем locale в getMessages
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        {/* ИСПРАВЛЕНО: добавлен проп locale */}
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SessionWrapper session={session}>
            <Header />

            <main className="min-h-screen">
              {children}
            </main>

            <Footer />
          </SessionWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
