'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

type Service = {
  id: string
  icon: string
  title: string
  desc: string
  price: string
}

export default function ServicesPage() {
  const t = useTranslations('ServicesPage');
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/services')
      .then(r => r.json())
      .then(d => setServices(d.services || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      {/* HERO - Magazine Style */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-600 via-pink-500 to-rose-500">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        <div className="container relative z-10 px-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              Наші послуги
            </span>
            <h1 className="text-6xl md:text-8xl font-bold mb-8">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">{t('hero.subtitle')}</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <div className="container pb-32 -mt-16 relative z-10 px-6">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-pink-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        )}

        {!loading && services.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-2xl max-w-2xl mx-auto">
            <div className="text-6xl mb-6">💅</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">{t('empty.title')}</h3>
            <p className="text-gray-600 text-lg">{t('empty.subtitle')}</p>
          </div>
        )}

        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, idx) => (
              <div
                key={service.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Gradient top bar */}
                <div className={`h-2 bg-gradient-to-r ${
                  idx % 3 === 0 ? 'from-rose-500 to-pink-500' :
                  idx % 3 === 1 ? 'from-pink-500 to-rose-400' :
                  'from-rose-400 to-pink-400'
                }`}></div>

                <div className="p-8">
                  <div className="text-6xl mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-rose-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed min-h-[80px]">{service.desc}</p>

                  {service.price && (
                    <div className="mb-6 py-4 px-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl">
                      <span className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
                        {service.price}
                      </span>
                    </div>
                  )}

                  <a
                    href="/booking"
                    className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    {t('serviceCard.selectButton')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
