'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

interface Benefit {
  id: string;
  text: string;
}

interface Package {
  id: string;
  title: string;
  badge: string | null;
  sessions: string;
  price: number;
  oldPrice: number;
  savings: string;
  popular: boolean;
  benefits: Benefit[];
}

export default function PackagesPage() {
  const t = useTranslations('PackagesPage');
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/packages')
      .then((r) => r.json())
      .then((data) => {
        setPackages(data.packages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* HERO - Dark with Gradient */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10 px-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
              Пакети послуг
            </span>
            <h1 className="text-6xl md:text-8xl font-bold mb-8">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <div className="container pb-32 -mt-16 relative z-10 px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-pink-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-2xl max-w-2xl mx-auto">
            <div className="text-6xl mb-6">📦</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              {t('empty.title')}
            </h3>
            <p className="text-gray-600 text-lg">
              {t('empty.subtitle')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {packages.map((pkg, idx) => (
              <div
                key={pkg.id}
                className={`relative rounded-3xl overflow-hidden transition-all duration-500 ${
                  pkg.popular
                    ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-2xl scale-105 lg:scale-110'
                    : 'bg-white shadow-xl hover:shadow-2xl'
                } hover:-translate-y-2`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white text-rose-600 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg z-10">
                    {pkg.badge || t('popularBadge')}
                  </div>
                )}

                <div className={`p-8 ${pkg.popular ? 'pt-12' : ''}`}>
                  <div className="text-center mb-8">
                    <h3 className={`text-3xl font-bold mb-3 ${pkg.popular ? 'text-white' : 'text-gray-800'}`}>
                      {pkg.title}
                    </h3>

                    <p className={`mb-8 text-lg ${pkg.popular ? 'text-white/90' : 'text-gray-600'}`}>
                      {pkg.sessions}
                    </p>

                    <div className={`mb-8 py-6 px-4 rounded-2xl ${pkg.popular ? 'bg-white/10 backdrop-blur-sm' : 'bg-gradient-to-r from-rose-50 to-pink-50'}`}>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className={`text-5xl font-bold ${pkg.popular ? 'text-white' : 'bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent'}`}>
                          {pkg.price}
                        </span>
                        <span className={`text-lg ${pkg.popular ? 'text-white/80' : 'text-gray-500'}`}>PLN</span>
                      </div>
                      {pkg.oldPrice > 0 && (
                        <div className="mt-2">
                          <span className={`text-sm line-through ${pkg.popular ? 'text-white/60' : 'text-gray-400'}`}>
                            {pkg.oldPrice} PLN
                          </span>
                          {pkg.savings && (
                            <span className={`ml-2 text-sm font-bold ${pkg.popular ? 'text-white' : 'text-emerald-600'}`}>
                              Економія {pkg.savings}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {pkg.benefits.length > 0 && (
                    <ul className="space-y-3 mb-8">
                      {pkg.benefits.map((b) => (
                        <li key={b.id} className={`flex items-start gap-3 ${pkg.popular ? 'text-white/90' : 'text-gray-600'}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            pkg.popular ? 'bg-white/20' : 'bg-gradient-to-br from-rose-500 to-pink-500'
                          }`}>
                            <svg className={`w-3 h-3 ${pkg.popular ? 'text-white' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm">{b.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <a
                    href="/booking"
                    className={`inline-flex items-center justify-center gap-2 w-full px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      pkg.popular
                        ? 'bg-white text-rose-600 hover:bg-gray-50'
                        : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                    }`}
                  >
                    {t('selectButton')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="inline-block px-6 py-3 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-600 text-sm">
              {t('validityNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
