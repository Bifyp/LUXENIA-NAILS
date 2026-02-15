"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import {routing} from '@/src/i18n/routing';
import Link from "next/link";

export default function Header() {
  const t = useTranslations("Header");

  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();

  const [hidden, setHidden] = useState(false);

  const lastYRef = useRef(0);
  const langRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "pl", name: "Polski", flag: "🇵🇱" },
    { code: "uk", name: "Українська", flag: "🇺🇦" },
  ];

  const currentLang = languages.find((lang) => lang.code === locale);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");
    
    // Используем replace вместо push для мгновенной смены языка
    router.replace(newPath);
    setLangOpen(false);
    setOpen(false); // Закрываем мобильное меню при смене языка
  };

  const links = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/services`, label: t("services") },
    { href: `/${locale}/packages`, label: t("packages") },
    { href: `/${locale}/gallery`, label: t("gallery") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const HIDE_DOWN_THRESHOLD = 150;
    const MIN_UP_DELTA = 1;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastYRef.current;

      setScrolled(currentY > 50);

      if (currentY > lastY && currentY > HIDE_DOWN_THRESHOLD) {
        setHidden(true);
      } else if (currentY < lastY - MIN_UP_DELTA) {
        setHidden(false);
      }

      lastYRef.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`
          w-full fixed top-0 left-0 z-50
          transition-all duration-700 ease-out
          ${hidden ? "-translate-y-full" : "translate-y-0"}
          ${
            scrolled
              ? "py-2 bg-milk/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-b border-gold/30"
              : "py-4 bg-milk backdrop-blur-sm border-b border-gold/50"
          }
        `}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="relative group">
            <img
              src="/logo/logo.jpg"
              alt="Logo"
              className={`
                relative object-cover rounded-full cursor-pointer
                border-2 border-gold
                transition-all duration-500
                ${scrolled ? "w-12 h-12" : "w-16 h-16"}
                hover:border-4 hover:scale-105
              `}
            />
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex gap-10 text-graphite font-sans">
            {links.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative pb-1 group"
                >
                  <span
                    className={`
                      text-sm uppercase tracking-wider font-medium
                      transition-all duration-300
                      ${
                        active
                          ? "text-gold"
                          : "text-graphite/80 hover:text-gold group-hover:tracking-widest"
                      }
                    `}
                  >
                    {link.label}
                  </span>

                  <span
                    className={`
                      absolute left-0 bottom-0 h-0.5 bg-gold
                      transition-all duration-500
                      ${
                        active
                          ? "w-full opacity-100"
                          : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                      }
                    `}
                  ></span>
                </Link>
              );
            })}
          </nav>

          {/* Language + Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gold/40 rounded-lg hover:border-gold hover:bg-gold/5 transition-all duration-300"
              >
                <span className="text-xl font-emoji">{currentLang?.flag}</span>
                <span className="text-sm font-medium">{currentLang?.name}</span>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-milk border border-gold/30 rounded-xl shadow-xl overflow-hidden animate-fadeIn z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLocale(lang.code)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-left
                        transition-all duration-200
                        ${
                          lang.code === locale
                            ? "bg-gold/20 text-gold"
                            : "hover:bg-gold/5 text-graphite"
                        }
                      `}
                    >
                      <span className="text-xl font-emoji">{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!session ? (
              <Link
                href={`/${locale}/login`}
                className="px-4 py-2 border border-gold text-gold rounded-lg hover:bg-gold hover:text-milk transition"
              >
                {t("login")}
              </Link>
            ) : (
              <button
                onClick={() => signOut()}
                className="px-4 py-2 border border-gold text-gold rounded-lg hover:bg-gold hover:text-milk transition"
              >
                {t("logout")}
              </button>
            )}
          </div>

          {/* Burger */}
          <button
            className={`
              md:hidden relative w-12 h-12 flex items-center justify-center
              rounded-full border border-gold/40
              bg-milk
              transition-all duration-300
              hover:border-gold hover:shadow-lg hover:shadow-gold/20
              ${open ? "bg-gold/10 border-gold" : ""}
            `}
            onClick={() => setOpen(!open)}
          >
            <div className="relative w-6 h-5 flex flex-col justify-center gap-1.5">
              <span
                className={`
                  w-full h-0.5 bg-gold rounded-full
                  transition-all duration-300 origin-center
                  ${open ? "rotate-45 translate-y-2" : ""}
                `}
              ></span>
              <span
                className={`
                  w-full h-0.5 bg-gold rounded-full
                  transition-all duration-300
                  ${open ? "opacity-0" : ""}
                `}
              ></span>
              <span
                className={`
                  w-full h-0.5 bg-gold rounded-full
                  transition-all duration-300 origin-center
                  ${open ? "-rotate-45 -translate-y-2" : ""}
                `}
              ></span>
            </div>
          </button>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Mobile menu */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 z-50
          bg-milk backdrop-blur-2xl shadow-2xl
          transform transition-all duration-500 ease-out
          border-l border-gold/20
          ${open ? "translate-x-0" : "translate-x-full"}
          md:hidden
        `}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gold"></div>

        <nav className="flex flex-col gap-2 p-8 mt-24">
          {links.map((link, index) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-6 py-4 rounded-xl transition-all duration-300 group overflow-hidden
                  ${
                    active
                      ? "bg-gold/20 text-gold shadow-lg"
                      : "text-graphite/80 hover:text-gold hover:bg-gold/5"
                  }
                `}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: open ? "slideInRight 0.5s ease-out forwards" : "none",
                }}
              >
                <span className="relative text-base font-medium tracking-wide uppercase">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Language Switcher - Улучшенная версия */}
        <div className="px-8 mb-6">
          <h3 className="text-xs uppercase tracking-wider text-graphite/60 mb-3 font-medium">
            {t("language") || "Language"}
          </h3>
          <div className="flex flex-col gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLocale(lang.code)}
                className={`
                  flex items-center gap-3 p-4 rounded-xl
                  transition-all duration-300
                  ${
                    lang.code === locale
                      ? "bg-gold/20 border-2 border-gold shadow-lg shadow-gold/20"
                      : "bg-milk border border-gold/20 hover:bg-gold/5 hover:border-gold/40"
                  }
                `}
              >
                <span className="text-2xl font-emoji">{lang.flag}</span>
                <span className={`
                  text-sm font-medium flex-1 text-left
                  ${lang.code === locale ? "text-gold" : "text-graphite"}
                `}>
                  {lang.name}
                </span>
                {lang.code === locale && (
                  <svg 
                    className="w-5 h-5 text-gold" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Auth Button */}
        <div className="px-8 mb-6">
          {!session ? (
            <Link
              href={`/${locale}/login`}
              className="block w-full px-4 py-3 border border-gold text-gold rounded-lg text-center hover:bg-gold hover:text-milk transition"
            >
              {t("login")}
            </Link>
          ) : (
            <button
              onClick={() => signOut()}
              className="block w-full px-4 py-3 border border-gold text-gold rounded-lg text-center hover:bg-gold hover:text-milk transition"
            >
              {t("logout")}
            </button>
          )}
        </div>

        <div className="absolute bottom-8 left-8 right-8 h-px bg-gold/30"></div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
