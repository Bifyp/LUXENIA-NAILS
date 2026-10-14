'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import AtelierMark from '@/components/AtelierMark';

type Service = { id: string; title: string; desc: string; price: string | null };
export default function ServicesPage() {
  const t = useTranslations('BrandUI');
  const locale = useLocale();
  const [services, setServices] = useState<Service[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/services', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Catalog unavailable');
      const data = await response.json();
      setServices(data.services ?? []);
      setState('ready');
    }).catch(() => { if (!controller.signal.aborted) setState('error'); });
    return () => controller.abort();
  }, []);
  return <div className="salon-catalog">
    <section className="salon-shell booking-heading">
      <p className="eyebrow">{t('servicesEyebrow')}</p>
      <h1>{t('servicesTitleShort')}</h1>
      <p>{t('chooseService')}</p>
    </section>
    <div className="salon-shell catalog-content">
      {state === 'loading' ? <p className="catalog-placeholder" role="status">{t('loading')}</p> : services.length ?
        <div className="service-editorial-grid">{services.map((service, i) => <Link key={service.id} className="editorial-service" href={`/${locale}/booking?service=${encodeURIComponent(service.id)}`}>
          <div className="service-top"><span className="eyebrow">{String(i + 1).padStart(2, '0')}</span><ArrowUpRight size={22} /></div>
          <h3>{service.title}</h3><p>{service.desc}</p>
          <div className="service-bottom"><span>{service.price ? `${service.price} PLN` : t('book')}</span><span>{t('book')}<ArrowUpRight size={15} aria-hidden="true" /></span></div>
        </Link>)}</div> :
        <div className="catalog-placeholder" role="status"><AtelierMark className="catalog-sign" /><h3>{t('catalogTitle')}</h3><p>{t(state === 'error' ? 'catalogError' : 'noServices')}</p><Link className="salon-link" href={`/${locale}/contact`}>{t('bookingHelpLink')}<ArrowUpRight size={18} /></Link></div>}
    </div>
    <section className="booking-banner salon-shell"><div><p className="eyebrow">{t('ctaEyebrow')}</p><h2>{t('ctaTitle')}</h2><p>{t('ctaDescription')}</p></div><Link className="salon-button" href={`/${locale}/booking`}>{t('book')}<ArrowUpRight size={20} /></Link></section>
  </div>;
}
