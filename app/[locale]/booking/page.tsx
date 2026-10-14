'use client';
import { SLOTS_BY_DAY, availableBookingSlot } from '@/lib/booking-rules';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Sparkles } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  price?: string | null;
}

interface Package {
  id: string;
  title: string;
  sessions: string;
  price: number;
  badge: string | null;
  popular: boolean;
}

// ─── Слоты по дням недели ────────────────────────────────────────────────────
// 0=Вс, 1=Пн, 2=Вт, 3=Ср, 4=Чт, 5=Пт, 6=Сб


// ─── Inline Calendar ─────────────────────────────────────────────────────────
function Calendar({
  value,
  onChange,
  labels,
}: {
  value: string;
  onChange: (date: string) => void;
  labels: { selectedDate: string };
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const selected = value ? new Date(value + 'T00:00:00') : null;

  const locale = useLocale();
  const b = useTranslations('BrandUI');

  // Mon–Sun day labels via Intl (locale-aware)
  // Reference week: Mon=2025-01-06 … Sun=2025-01-12
  const DAYS_SHORT = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' })
      .format(new Date(2025, 0, 6 + i)) // 6 Jan 2025 = Monday
      .replace('.', '')
      .slice(0, 2)
      .toUpperCase()
  );

  // Month names via Intl (locale-aware)
  const MONTHS = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: 'long' })
      .format(new Date(2025, i, 1))
      .replace(/^\p{L}/u, (c) => c.toUpperCase())
  );

  // Grid: Monday-based
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const rawDow = firstOfMonth.getDay(); // 0=Sun
  const offset = rawDow === 0 ? 6 : rawDow - 1; // Mon=0 … Sun=6

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function handleDay(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    if (d < today) return;
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(iso);
  }

  function cellState(day: number | null): 'empty' | 'past' | 'selected' | 'today' | 'available' {
    if (day === null) return 'empty';
    const d = new Date(viewYear, viewMonth, day);
    if (d < today) return 'past';
    if (
      selected &&
      selected.getFullYear() === viewYear &&
      selected.getMonth() === viewMonth &&
      selected.getDate() === day
    ) return 'selected';
    if (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    ) return 'today';
    return 'available';
  }

  return (
    <div className="w-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={prevMonth}
          aria-label={b('prevMonth')}
          className="calendar-arrow"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span className="calendar-month">
          {MONTHS[viewMonth]} <span className="text-gold">{viewYear}</span>
        </span>

        <button
          type="button"
          onClick={nextMonth}
          aria-label={b('nextMonth')}
          className="calendar-arrow"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_SHORT.map((d) => (
          <div
            key={d}
            className="calendar-weekday text-center pb-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gold/20 mb-3" />

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          const state = cellState(day);
          if (state === 'empty') {
            return <div key={idx} />;
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={state === 'past'}
              onClick={() => day && handleDay(day)}
              className="calendar-day"
              data-state={state}
              aria-pressed={state === 'selected'}
              aria-label={new Date(viewYear, viewMonth, day!).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
            >
              {day}
              {/* Dot for today */}
              {state === 'today' && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date display */}
      {selected && (
        <div className="mt-5 pt-4 border-t border-gold/20 text-center">
          <span className="text-xs uppercase tracking-widest text-graphite/40 font-sans">{labels.selectedDate}</span>
          <p className="text-gold font-serif text-base mt-1">
            {selected.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const t = useTranslations('BookingPage');
  const b = useTranslations('BrandUI');
  const locale = useLocale();
  const slotRequest = useRef<AbortController | null>(null);
  const [catalogState, setCatalogState] = useState<'loading' | 'ready' | 'error'>('loading');

  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [tab, setTab] = useState<'services' | 'packages'>('services');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    serviceName: '',
    date: '',
    time: '',
    comment: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all(['/api/admin/services', '/api/admin/packages'].map(async url => {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error('Catalog unavailable');
      return response.json();
    })).then(([serviceData, packageData]) => {
      const catalog: Service[] = serviceData.services ?? [];
      setServices(catalog);
      setPackages(packageData.packages ?? []);
      const requestedId = new URLSearchParams(window.location.search).get('service');
      const requested = catalog.find(service => service.id === requestedId);
      if (requested) setForm(previous => ({ ...previous, serviceName: requested.title }));
      setCatalogState('ready');
    }).catch(() => { if (!controller.signal.aborted) setCatalogState('error'); });
    return () => { controller.abort(); slotRequest.current?.abort(); };
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  function handleTabChange(newTab: 'services' | 'packages') {
    setTab(newTab);
    setForm((prev) => ({ ...prev, serviceName: '' }));
  }

  function handleDateChange(date: string) {
    setForm((prev) => ({ ...prev, date, time: '' }));
    setError('');
    slotRequest.current?.abort();
    const controller = new AbortController();
    slotRequest.current = controller;
    setSlotsLoading(true);
    setBookedSlots([]);
    fetch(`/api/bookings?date=${date}`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Slots unavailable');
        const data = await response.json();
        setBookedSlots(data.bookedSlots ?? []);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setBookedSlots(SLOTS_BY_DAY[new Date(date + 'T00:00:00').getDay()] ?? []);
          setError(t('form.errorGeneric'));
        }
      })
      .finally(() => { if (!controller.signal.aborted) setSlotsLoading(false); });
  }

  // Time slots based on selected day of week
  const availableSlots: string[] = (() => {
    if (!form.date) return [];
    const d = new Date(form.date + 'T00:00:00');
    const dow = d.getDay(); // 0=Sun
    return (SLOTS_BY_DAY[dow] ?? []).filter((time) => availableBookingSlot(form.date, time));
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.status === 409) {
        setBookedSlots(previous => [...new Set([...previous, form.time])]);
        setForm(previous => ({ ...previous, time: '' }));
        setError(t('form.errorSlotTaken'));
        return;
      }
      if (!data.success) throw new Error(data.error ?? 'Error');
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('form.errorGeneric'));
    } finally {
      setLoading(false);
    }
  }

  const selectedService = services.find((s) => s.title === form.serviceName);
  const selectedPackage = packages.find((p) => p.title === form.serviceName);

  return (
    <div className="salon-booking">
      <section className="salon-shell booking-heading">
        <p className="eyebrow">{t('hero.subtitle')}</p>
        <h1>{b('bookingTitle')}<br /><em>{b('bookingAccent')}</em></h1>
        <p>{b('bookingDescription')}</p>
      </section>
      <div className="salon-shell booking-layout">
        <div className="booking-card">
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">{t('form.successTitle')}</h2>
                  <p className="text-gray-600 mb-8">{t('form.successDesc')}</p>

                  <div className="booking-success-summary text-left p-6 space-y-3 mb-8">
                    <Row label={t('form.fields.firstName.label')} value={`${form.firstName} ${form.lastName}`} />
                    <Row label={t('form.fields.service.label')} value={form.serviceName} />
                    {selectedService?.price && (
                      <Row label={t('form.fields.price')} value={`${selectedService.price} PLN`} />
                    )}
                    {selectedPackage && (
                      <Row label={t('form.fields.price')} value={`${selectedPackage.price} PLN`} />
                    )}
                    <Row label={t('form.fields.date.label')} value={form.date} />
                    <Row label={t('form.fields.time.label')} value={form.time} />
                  </div>

                  <button
                    onClick={() => {
                      setSuccess(false);
                      setForm({ firstName:'',lastName:'',phone:'',email:'',serviceName:'',date:'',time:'',comment:'' });
                    }}
                    className="salon-button"
                  >
                    {t('form.newBooking')}
                  </button>
                </div>
              ) : (

              <form onSubmit={handleSubmit}>
                <h2 className="form-section-title"><span>01</span>{b('detailsTitle')}</h2>

                {/* Name fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2 text-sm">
                      {t('form.fields.firstName.label')}
                    </label>
                    <input
                      id="firstName" name="firstName" autoComplete="given-name" type="text" value={form.firstName}
                      onChange={handleChange} placeholder={t('form.fields.firstName.placeholder')}
                      required className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all duration-300 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2 text-sm">
                      {t('form.fields.lastName.label')}
                    </label>
                    <input
                      id="lastName" name="lastName" autoComplete="family-name" type="text" value={form.lastName}
                      onChange={handleChange} placeholder={t('form.fields.lastName.placeholder')}
                      required className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all duration-300 outline-none"
                    />
                  </div>
                </div>

                {/* Contact fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2 text-sm">
                      {t('form.fields.phone.label')}
                    </label>
                    <input
                      id="phone" name="phone" autoComplete="tel" type="tel" value={form.phone}
                      onChange={handleChange} placeholder={t('form.fields.phone.placeholder')}
                      required className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all duration-300 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2 text-sm">
                      {t('form.fields.email.label')}
                    </label>
                    <input
                      id="email" name="email" autoComplete="email" type="email" value={form.email}
                      onChange={handleChange} placeholder={t('form.fields.email.placeholder')}
                      required className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all duration-300 outline-none"
                    />
                  </div>
                </div>

                <div className="form-divider" />
                <h2 className="form-section-title"><span>02</span>{b('selectionTitle')}</h2>
                {catalogState !== 'ready' ? <p role="status">{b(catalogState === 'loading' ? 'loading' : 'catalogUnavailable')}</p> : !services.length && !packages.length ? <p role="status">{b('noServices')}</p> : null}
                {/* SERVICE / PACKAGE TABS */}
                <div>
                  <label htmlFor="serviceName" className="block text-gray-700 font-medium mb-3 text-sm">
                    {t('form.fields.service.label')}
                  </label>
                  <div className="tab-control flex mb-4 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleTabChange('services')}
                      aria-pressed={tab === 'services'}
                      className={`flex-1 py-3 text-sm font-medium transition-all duration-200 ${
                        tab === 'services' ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {t('form.tabServices')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabChange('packages')}
                      aria-pressed={tab === 'packages'}
                      className={`flex-1 py-3 text-sm font-medium transition-all duration-200 border-l-2 border-gray-200 ${
                        tab === 'packages' ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {t('form.tabPackages')}
                    </button>
                  </div>

                  {tab === 'services' && (
                    <div>
                      <select
                        id="serviceName" name="serviceName" value={form.serviceName} onChange={handleChange} required
                        className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all duration-300 outline-none appearance-none bg-white"
                      >
                        <option value="">{t('form.fields.service.placeholder')}</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}{s.price ? ` — ${s.price} PLN` : ''}
                          </option>
                        ))}
                      </select>
                      {selectedService?.price && (
                        <p className="mt-1.5 text-sm text-rose-600 font-medium">
                          {t('form.fields.price')}: {selectedService.price} PLN
                        </p>
                      )}
                    </div>
                  )}

                  {tab === 'packages' && (
                    <div>
                      <select
                        id="serviceName" name="serviceName" value={form.serviceName} onChange={handleChange} required
                        className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all duration-300 outline-none appearance-none bg-white"
                      >
                        <option value="">{t('form.packagePlaceholder')}</option>
                        {packages.map((p) => (
                          <option key={p.id} value={p.title}>
                            {p.title} — {p.sessions} — {p.price} PLN
                          </option>
                        ))}
                      </select>
                      {selectedPackage && (
                        <p className="mt-1.5 text-sm text-rose-600 font-medium">
                          {t('form.fields.price')}: {selectedPackage.price} PLN · {selectedPackage.sessions}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* ─── CALENDAR ──────────────────────────────────────── */}
                <div>
                  <label className="block text-gray-700 font-medium mb-4 text-sm">
                    {t('form.fields.date.label')}
                  </label>

                  <div className="calendar-box">
                    <Calendar value={form.date} onChange={handleDateChange} labels={{ selectedDate: t('form.selectedDate') }} />
                  </div>

                  {/* Hidden input so form validation works */}
                  <input type="hidden" name="date" value={form.date} required />
                </div>

                {form.date && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-4 text-sm">
                      {t('form.fields.time.label')}
                    </label>

                    {slotsLoading ? (
                      <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
                        <svg className="w-4 h-4 animate-spin text-rose-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        {b('slotsLoading')}
                      </div>
                    ) : (
                      <div className="time-grid grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {!availableSlots.length && <p className="col-span-full text-sm">{b('noSlots')}</p>}
                        {availableSlots.map((slot) => {
                          const isBooked = bookedSlots.includes(slot);
                          const isSelected = form.time === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isBooked}
                              onClick={() => {
                                if (isBooked) return;
                                setForm((prev) => ({ ...prev, time: slot }));
                                setError('');
                              }}
                              title={isBooked ? b('booked') : slot}
                              aria-pressed={isSelected}
                              className={`relative py-2.5 text-sm font-medium rounded-xl border-2 transition-all duration-200 ${
                                isBooked
                                  ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed line-through'
                                  : isSelected
                                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg scale-105'
                                    : 'border-gray-200 text-gray-700 hover:border-rose-500 hover:text-rose-600 cursor-pointer'
                              }`}
                            >
                              {slot}
                              {isBooked && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <span className="w-4 h-px bg-gray-300 rotate-45 absolute" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <input type="hidden" name="time" value={form.time} required />
                    {form.date && !form.time && !slotsLoading && (
                      <p className="mt-2 text-xs text-gray-500">
                        {t('form.timeHint')}
                      </p>
                    )}
                  </div>
                )}

                {/* Comment */}
                <div>
                  <label htmlFor="comment" className="block text-gray-700 font-medium mb-2 text-sm">
                    {t('form.fields.comment.label')}
                  </label>
                  <textarea
                    id="comment" name="comment" rows={4} value={form.comment}
                    onChange={handleChange} placeholder={t('form.fields.comment.placeholder')}
                    className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all duration-300 outline-none resize-none"
                  />
                </div>

                {error && <p role="alert" className="text-red-700 text-sm">{error}</p>}

                <button
                  type="submit" disabled={loading || slotsLoading || catalogState !== 'ready' || !form.serviceName || !form.date || !form.time}
                  className="w-full py-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span>
                    {loading ? t('form.submitting') : t('form.submitButton')}
                  </span>
                </button>

                <p className="text-center text-gray-500 text-sm">
                  {b('requiredNote')}
                </p>
              </form>
              )}
        </div>
        <aside className="booking-sidebar">
          <p className="eyebrow">LUXENIA · NAIL STUDIO</p>
          <h2>{b('bookingAsideTitle')}</h2>
          <p>{b('bookingAsideText')}</p>
          <div className="booking-summary" aria-live="polite">
            <span><Sparkles size={18} />{form.serviceName || b('summaryEmpty')}</span>
            <span><CalendarDays size={18} />{form.date ? `${new Date(form.date + 'T00:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}${form.time ? ` · ${form.time}` : ''}` : b('summaryDate')}</span>
            {(selectedService?.price || selectedPackage) && <strong>{selectedService?.price ?? selectedPackage?.price} PLN</strong>}
          </div>
          <p>{b('bookingHelp')}</p>
          <Link className="salon-link" href={`/${locale}/contact`}>{b('bookingHelpLink')}<ArrowUpRight size={16} /></Link>
        </aside>
      </div>
      <section className="salon-shell booking-faq">
        <p className="eyebrow">{t('faq.subtitle')}</p>
        <h2>{b('faqTitle')}</h2>
        {t.raw('faq.items').map((faq: { question: string; answer: string }, idx: number) => <details key={idx}>
          <summary>{faq.question}</summary><p>{faq.answer}</p>
        </details>)}
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm border-b border-gold/10 pb-2 last:border-0 last:pb-0">
      <span className="text-graphite/50">{label}</span>
      <span className="font-medium text-graphite max-w-[55%] text-right wrap-anywhere">{value}</span>
    </div>
  );
}