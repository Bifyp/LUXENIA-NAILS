'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import AtelierMark from '@/components/AtelierMark';
import { ArrowUpRight, Menu, X, ChevronDown, UserRound } from 'lucide-react';

export default function Header() {
  const t = useTranslations('Header');
  const b = useTranslations('BrandUI');
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  const [languageOpen, setLanguageOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const languages = [{ code: 'pl', name: 'Polski' }, { code: 'en', name: 'English' }, { code: 'ru', name: 'Русский' }, { code: 'uk', name: 'Українська' }];
  const links = ['services', 'packages', 'gallery', 'about', 'contact', 'shop'] as const;

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setLanguageOpen(false);
        setProfileOpen(false);
      }
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuPath(null);
        setLanguageOpen(false);
        setProfileOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', escape);
    };
  }, []);

  function switchLocale(code: string) {
    const segments = pathname.split('/');
    segments[1] = code;
    router.replace(segments.join('/') + window.location.search);
    setLanguageOpen(false);
    setMenuPath(null);
  }

  return (
    <header className="salon-header" ref={headerRef}>
      <div className="salon-shell header-inner">
        <Link className="brand-mark" href={`/${locale}`} aria-label="Luxenia Nails">
          <span>LUXENIA<AtelierMark className="brand-dot" /></span>
          <small>NAIL STUDIO</small>
        </Link>
        <nav className="desktop-nav" aria-label={b('navigation')}>
          {links.slice(0, 5).map(key => <Link key={key} href={`/${locale}/${key}`} aria-current={pathname === `/${locale}/${key}` ? 'page' : undefined}>{t(key)}</Link>)}
        </nav>
        <div className="header-actions">
          <div className="header-dropdown">
            <button className="quiet-button language-toggle" onClick={() => { setLanguageOpen(!languageOpen); setProfileOpen(false); }} aria-expanded={languageOpen} aria-label={t('language')}>
              {locale.toUpperCase()} <ChevronDown size={14} aria-hidden="true" />
            </button>
            {languageOpen && <div className="dropdown-panel">{languages.map(lang => <button key={lang.code} onClick={() => switchLocale(lang.code)} aria-current={lang.code === locale ? 'true' : undefined}>{lang.name}</button>)}</div>}
          </div>
          <div className="header-dropdown account-dropdown">
            {session ? <>
              <button className="quiet-button" onClick={() => { setProfileOpen(!profileOpen); setLanguageOpen(false); }} aria-expanded={profileOpen} aria-label={t('account')}><UserRound size={19} /></button>
              {profileOpen && <div className="dropdown-panel">
                <Link href={`/${locale}/account`} onClick={() => setProfileOpen(false)}>{t('account')}</Link>
                {session.user?.role === 'admin' && <Link href="/admin">{t('adminPanel')}</Link>}
                <button onClick={() => { setProfileOpen(false); void signOut(); }}>{t('logout')}</button>
              </div>}
            </> : <Link href={`/${locale}/login`} className="quiet-button" aria-label={t('login')}><UserRound size={19} /></Link>}
          </div>
          <Link href={`/${locale}/booking`} className="salon-button header-booking">{b('book')}<ArrowUpRight size={16} aria-hidden="true" /></Link>
          <button ref={menuButtonRef} className="quiet-button menu-toggle" aria-label={open ? b('closeMenu') : b('openMenu')} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setMenuPath(open ? null : pathname)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && <nav id="mobile-navigation" className="mobile-nav salon-shell" aria-label={b('navigation')}>
        {links.map(key => <Link key={key} href={`/${locale}/${key}`} onClick={() => setMenuPath(null)} aria-current={pathname === `/${locale}/${key}` ? 'page' : undefined}>{t(key)}<ArrowUpRight size={18} aria-hidden="true" /></Link>)}
        <Link href={`/${locale}/${session ? 'account' : 'login'}`} onClick={() => setMenuPath(null)}>{session ? t('account') : t('login')}<UserRound size={18} /></Link>
        {session?.user?.role === 'admin' && <Link href="/admin">{t('adminPanel')}</Link>}
        <Link className="salon-button" href={`/${locale}/booking`} onClick={() => setMenuPath(null)}>{b('book')}<ArrowUpRight size={18} /></Link>
      </nav>}
    </header>
  );
}
