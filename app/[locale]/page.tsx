'use client';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import LazyImage from "../../components/LazyImage";
import { usePagePhoto } from '../../components/hooks/usePagePhoto';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  const { url: masterUrl, alt: masterAlt } = usePagePhoto('home', '/home/master.jpg');

  return (
    <div className="overflow-hidden">

      {/* HERO - Full Screen Video Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        <div className="container relative z-10 px-6 text-center text-white">
          <div className="max-w-5xl mx-auto">
            <div className="inline-block mb-8 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <p className="text-sm font-medium tracking-wide">
                {t('hero.subtitle')}
              </p>
            </div>

            <h1 className="text-7xl md:text-9xl font-bold mb-8 tracking-tight">
              LUXENIA
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>

            <div className="flex gap-4 justify-center items-center flex-wrap">
              <a
                href={`/${locale}/booking`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-rose-600 rounded-full font-medium shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {t('hero.bookButton')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>

              <a
                href={`/${locale}/services`}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-full font-medium hover:bg-white hover:text-rose-600 transition-all duration-300"
              >
                {t('hero.servicesButton')}
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* SERVICES - Bento Grid */}
      <section className="py-32 bg-white">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 rounded-full text-sm font-medium mb-6">
              Наші послуги
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              {t('services.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[
              {
                title: t('services.facial.title'),
                desc: t('services.facial.description'),
                icon: "💅",
                gradient: "from-rose-500 to-pink-500"
              },
              {
                title: t('services.peeling.title'),
                desc: t('services.peeling.description'),
                icon: "✨",
                gradient: "from-pink-500 to-rose-400"
              },
              {
                title: t('services.massage.title'),
                desc: t('services.massage.description'),
                icon: "💆",
                gradient: "from-rose-400 to-pink-400"
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-10 rounded-bl-full`}></div>

                <div className="relative">
                  <div className="text-6xl mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-rose-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{service.desc}</p>
                  <a
                    href={`/${locale}/services`}
                    className="inline-flex items-center gap-2 text-rose-600 font-medium group-hover:gap-4 transition-all duration-300"
                  >
                    {t('services.learnMore')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT - Split with Image */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left - Image */}
          <div className="relative h-[600px] lg:h-auto">
            <LazyImage
              src={masterUrl}
              alt={masterAlt || t('about.imageAlt')}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/50 lg:to-white"></div>
          </div>

          {/* Right - Content */}
          <div className="flex items-center p-12 lg:p-24 bg-white">
            <div className="max-w-xl">
              <span className="inline-block px-4 py-1 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 rounded-full text-sm font-medium mb-6">
                Про нас
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 leading-tight">
                {t('about.title')}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed mb-8">
                <p className="text-lg">{t('about.paragraph1')}</p>
                <p>{t('about.paragraph2')}</p>
              </div>
              <a
                href={`/${locale}/about`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {t('about.learnMore')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS - Gradient Cards */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { number: t('stats.experience.number'), label: t('stats.experience.label'), gradient: "from-rose-500 to-pink-500" },
              { number: t('stats.clients.number'), label: t('stats.clients.label'), gradient: "from-pink-500 to-rose-400" },
              { number: t('stats.procedures.number'), label: t('stats.procedures.label'), gradient: "from-rose-400 to-pink-400" },
              { number: t('stats.premium.number'), label: t('stats.premium.label'), gradient: "from-pink-400 to-rose-500" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`relative group bg-gradient-to-br ${stat.gradient} rounded-3xl p-8 text-center text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
              >
                <div className="text-5xl md:text-6xl font-bold mb-3">
                  {stat.number}
                </div>
                <div className="text-sm font-medium uppercase tracking-wide text-white/90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT - Full Width CTA */}
      <section className="py-32 bg-gradient-to-br from-rose-600 via-pink-500 to-rose-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">{t('contact.title')}</h2>

          <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
          <p className="text-2xl font-medium mb-12 text-white">
            {t('contact.address')}
          </p>

          <div className="flex gap-4 justify-center items-center flex-wrap">
            <a
              href={`/${locale}/contact`}
              className="px-8 py-4 bg-white text-rose-600 rounded-full font-medium shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              {t('contact.contactButton')}
            </a>

            <a
              href="tel:+48123456789"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-full font-medium hover:bg-white hover:text-rose-600 transition-all duration-300"
            >
              {t('contact.callButton')}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
