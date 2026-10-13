import "./globals.css";
import "../styles/animations.css";

import type { Metadata } from "next";

import { Inter, Cormorant_Garamond } from "next/font/google";

import SessionWrapper from "@/components/SessionWrapper";
import { LanguageProvider } from "@/components/LanguageProvider";

import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "Luxenia",
  description: "Luxenia Nails — studio manicure i pedicure w Swarzędzu. Rezerwacja wizyt online.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <LanguageProvider>
            <SessionWrapper session={null}>
              {children}
            </SessionWrapper>
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
