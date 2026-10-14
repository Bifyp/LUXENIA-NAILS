'use client';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import AtelierMark from '@/components/AtelierMark';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

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
    <section className="atelier-hero">
      <div className="salon-shell">
        <div className="poster-meta"><span>INDEPENDENT NAIL ATELIER</span><span>{t('noteOne')}<span className="live-square" aria-hidden="true" /></span></div>
        <div className="poster-masthead"><h1>LUXENIA</h1><AtelierMark className="atelier-asterisk" /></div>
        <div className="poster-composition">
          <div className="poster-copy">
            <p className="eyebrow">{t('heroEyebrow')}</p>
            <h2>{t('heroTitle')}<br /><span>{t('heroAccent')}</span></h2>
            <p className="hero-description">{t('heroDescription')}</p>
            <div className="hero-actions"><Link className="salon-button" href={`/${locale}/booking`}>{t('book')}<ArrowUpRight size={20} /></Link><Link className="salon-link" href={`/${locale}/services`}>{t('viewServices')}</Link></div>
            <div className="shade-study" aria-label={t('imageCaption')}><div className="shade-bars" aria-hidden="true"><span /><span /><span /></div><p>COLOUR STUDY / 01<br /><span>{t('imageCaption')}</span></p></div>
          </div>
          <figure className="campaign-frame">
            <div className="campaign-photo"><Image unoptimized src="/brand/editorial-manicure.svg" alt={t('imageAlt')} width={1000} height={1250} preload /><span className="photo-index" aria-hidden="true">LX—01</span></div>
            <figcaption><span>THE COLOUR ISSUE</span><span>{t('imageCaption')}</span></figcaption>
          </figure>
        </div>
      </div>
    </section>
    <div className="atelier-strip" aria-hidden="true"><span>GOOD NAILS.</span><AtelierMark className="strip-star" /><span>YOUR RULES.</span><AtelierMark className="strip-star" /><span>GOOD NAILS.</span></div>
    <section className="salon-shell salon-section" id="services">
      <div className="section-heading"><div><p className="eyebrow">01 / {t('servicesEyebrow')}</p><h2>{t('servicesTitle')}</h2></div><Link className="salon-link" href={`/${locale}/services`}>{t('fullMenu')}<ArrowRight size={18} /></Link></div>
      {catalogState === 'loading' ? <div className="catalog-placeholder" role="status">{t('loading')}</div> : services.length ? <div className="service-editorial-grid">{services.slice(0, 4).map((service, i) => <Link key={service.id} href={`/${locale}/booking?service=${encodeURIComponent(service.id)}`} className="editorial-service">
        <div className="service-top"><span className="eyebrow">{String(i + 1).padStart(2,'0')}</span></div><h3>{service.title}</h3><p>{service.desc}</p><div className="service-bottom"><span>{service.price ? `${service.price} PLN` : '—'}</span><span>{t('book')}<ArrowUpRight size={17} /></span></div>
      </Link>)}</div> : <div className="catalog-placeholder"><span className="empty-index" aria-hidden="true">[ — ]</span><div><h3>{t('catalogTitle')}</h3><p>{catalogState === 'error' ? t('catalogError') : t('catalogDescription')}</p></div><Link className="salon-link" href={`/${locale}/services`}>{t('viewServices')}<ArrowRight size={18} /></Link></div>}
    </section>
    <section className="atelier-manifesto"><div className="salon-shell manifesto-grid"><div><p className="eyebrow">02 / {t('studioEyebrow')}</p><h2>{t('studioTitle')}<br /><span>{t('studioAccent')}</span></h2></div><div className="manifesto-note"><AtelierMark className="manifesto-asterisk" /><p>{t('studioDescription')}</p><Link className="salon-link" href={`/${locale}/gallery`}>{t('galleryLink')}<ArrowUpRight size={20} /></Link></div></div></section>
    <section className="salon-shell salon-section booking-ticket">
      <div className="ticket-copy"><p className="eyebrow">03 / {t('ctaEyebrow')}</p><h2>{t('ctaTitle')}</h2><p>{t('ctaDescription')}</p><div className="ticket-steps"><span>01 — {t('step1Title')}</span><span>02 — {t('step2Title')}</span><span>03 — {t('step3Title')}</span></div></div>
      <div className="ticket-action"><p>{t('noteOne')}</p><Link className="salon-button" href={`/${locale}/booking`}>{t('book')}<ArrowUpRight size={22} /></Link><span>{t('noteTwo')}</span></div>
    </section>
  </div>;
}
