'use client';
import Link from 'next/link';
import AtelierMark from '@/components/AtelierMark';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
export default function Footer() {
  const locale = useLocale();
  const t = useTranslations('BrandUI');
  const h = useTranslations('Header');
  return <footer className="salon-footer">
    <div className="salon-shell footer-grid">
      <div><Link className="brand-mark" href={`/${locale}`}><span>LUXENIA<AtelierMark className="brand-dot" /></span><small>NAIL STUDIO</small></Link><p>{t('footerLine')}</p></div>
      <nav aria-label={t('navigation')}>{['services', 'gallery', 'about', 'contact', 'shop'].map(key => <Link key={key} href={`/${locale}/${key}`}>{h(key)}</Link>)}</nav>
      <Link className="salon-button" href={`/${locale}/booking`}>{t('book')}<ArrowUpRight size={18} /></Link>
    </div>
    <div className="salon-shell footer-wordmark" aria-hidden="true">LUXENIA<AtelierMark className="footer-mark" /></div>
    <div className="salon-shell footer-bottom"><span>© {new Date().getFullYear()} Luxenia Nails</span><span>{t('footerNote')}</span></div>
  </footer>;
}
