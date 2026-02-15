/* -----------------------------
   Глобальные стили
------------------------------ */
import "./globals.css";
import "../styles/animations.css";

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
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SessionWrapper from "../components/SessionWrapper";
import { LanguageProvider } from "../components/LanguageProvider";

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
  title: "LumaSkin",
  description: "Premium skincare studio website",
};

/* -----------------------------
   Основной Layout
------------------------------ */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <LanguageProvider>
          <SessionWrapper>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </SessionWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
