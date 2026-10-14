'use client';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, CalendarDays, Sparkles, Check, ArrowRight } from 'lucide-react';

type Service = { id: string; title: string; desc: string; price: string | null };
export default function HomePage() {
  const t = useTranslations('BrandUI');
  const locale = useLocale();
  const [services, setServices] = useState<Service[]>([]);
  const [catalogState, setCatalogState] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/services', { signal: controller.signal }).then(async r => {
      if (!r.ok) throw new Error('Catalog unavailable');
      const data = await r.json();
      setServices(data.services ?? []);
      setCatalogState('ready');
    }).catch(() => { if (!controller.signal.aborted) setCatalogState('error'); });
    return () => controller.abort();
  }, []);
  return <div className="salon-home">
    <section className="salon-shell editorial-hero">
      <div className="hero-copy">
        <p className="eyebrow"><span className="tiny-line" />{t('heroEyebrow')}</p>
        <h1>{t('heroTitle')}<br /><em>{t('heroAccent')}</em></h1>
        <p className="hero-description">{t('heroDescription')}</p>
        <div className="hero-actions"><Link className="salon-button" href={`/${locale}/booking`}>{t('book')}<ArrowUpRight size={19} /></Link><Link className="salon-link" href={`/${locale}/services`}>{t('viewServices')}<ArrowRight size={18} /></Link></div>
        <div className="hero-notes"><span><Check size={16} />{t('noteOne')}</span><span><Check size={16} />{t('noteTwo')}</span></div>
      </div>
      <figure className="hero-photo">
        <Image unoptimized src="/brand/editorial-manicure.svg" alt={t('imageAlt')} width={900} height={1125} preload />
        <figcaption><span>THE LUXENIA EDIT</span><span>{t('imageCaption')}</span></figcaption>
      </figure>
    </section>
    <div className="salon-values"><div className="salon-shell values-inner">{['valueOne','valueTwo','valueThree'].map((key, i) => <span key={key}><span className="value-index">0{i + 1}</span>{t(key)}</span>)}</div></div>
    <section className="salon-shell salon-section" id="services">
      <div className="section-heading"><div><p className="eyebrow">{t('servicesEyebrow')}</p><h2>{t('servicesTitle')}</h2></div><Link className="salon-link" href={`/${locale}/services`}>{t('fullMenu')}<ArrowUpRight size={18} /></Link></div>
      {catalogState === 'loading' ? <div className="catalog-placeholder" role="status">{t('loading')}</div> : services.length ? <div className="service-editorial-grid">{services.slice(0, 3).map((service, i) => <Link key={service.id} href={`/${locale}/booking?service=${encodeURIComponent(service.id)}`} className="editorial-service">
        <div className="service-top"><span className="eyebrow">0{i + 1}</span><ArrowUpRight size={22} /></div><h3>{service.title}</h3><p>{service.desc}</p><div className="service-bottom"><span>{service.price ? `${service.price} PLN` : t('viewServices')}</span><span>{t('book')}</span></div>
      </Link>)}</div> : <div className="catalog-placeholder"><Sparkles size={28} /><h3>{t('catalogTitle')}</h3><p>{catalogState === 'error' ? t('catalogError') : t('catalogDescription')}</p><Link className="salon-link" href={`/${locale}/services`}>{t('viewServices')}<ArrowRight size={18} /></Link></div>}
    </section>
    <section className="studio-story"><div className="salon-shell story-grid"><div><p className="eyebrow">{t('studioEyebrow')}</p><h2>{t('studioTitle')}<br /><em>{t('studioAccent')}</em></h2></div><div><p className="story-text">{t('studioDescription')}</p><Link className="salon-link" href={`/${locale}/about`}>{t('aboutStudio')}<ArrowUpRight size={18} /></Link></div></div></section>
    <section className="salon-shell salon-section"><div className="section-heading"><div><p className="eyebrow">{t('howEyebrow')}</p><h2>{t('howTitle')}</h2></div><CalendarDays className="section-icon" size={36} strokeWidth={1.2} /></div><div className="process-grid">{[1, 2, 3].map(i => <div key={i}><span className="process-number">0{i}</span><h3>{t(`step${i}Title`)}</h3><p>{t(`step${i}Description`)}</p></div>)}</div></section>
    <section className="booking-banner salon-shell"><div><p className="eyebrow">{t('ctaEyebrow')}</p><h2>{t('ctaTitle')}</h2><p>{t('ctaDescription')}</p></div><Link className="salon-button" href={`/${locale}/booking`}>{t('book')}<ArrowUpRight size={20} /></Link></section>
  </div>;
}
