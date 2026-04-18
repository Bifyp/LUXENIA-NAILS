import { getTranslations } from 'next-intl/server';
import { prisma } from "@/lib/prisma";
import GalleryClient from "./GalleryClient";

export const revalidate = 0;

export default async function GalleryPage() {
  const t = await getTranslations('GalleryPage');

  const images = await prisma.gallery.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="overflow-hidden">

      {/* HERO - Minimal with Pattern */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-500 to-pink-500">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        <div className="container text-center relative z-10 px-6">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
              {t('hero.subtitle')}
            </span>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* ГАЛЕРЕЯ */}
      <section className="py-24 bg-white">
        <div className="container px-6">
          <GalleryClient
            images={images}
            emptyMessage={t('gallery.emptyMessage')}
            photoLabel={t('gallery.photoLabel')}
            brandName={t('gallery.brandName')}
          />
        </div>
      </section>

      {/* CTA - Split Design */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left - Dark */}
          <div className="bg-gray-900 text-white p-16 lg:p-24 flex items-center">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {t('cta.title')}
              </h2>
              <p className="text-white/80 mb-8 text-lg leading-relaxed">
                {t('cta.description')}
              </p>
              <a
                href="/booking"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-medium shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {t('cta.bookingButton')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right - Gradient */}
          <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-16 lg:p-24 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-8xl mb-6">💅</div>
              <p className="text-2xl font-bold mb-4">Професійний догляд</p>
              <a
                href="/services"
                className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-full font-medium hover:bg-white hover:text-rose-600 transition-all duration-300"
              >
                {t('cta.servicesButton')}
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
