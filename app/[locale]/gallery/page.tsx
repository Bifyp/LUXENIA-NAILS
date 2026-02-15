'use client';
import { useTranslations } from 'next-intl';
import { prisma } from "@/lib/prisma";
import LazyImage from "../../../components/LazyImage";

export const revalidate = 0;

export default async function GalleryPage() {
  const t = useTranslations('GalleryPage');
  
  const images = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="overflow-hidden">

      {/* HERO */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center fade-in bg-milk">
        <div className="container text-center relative z-10 px-6">
          <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
            {t('hero.subtitle')}
          </span>
          <h1 className="text-6xl md:text-7xl font-serif mb-8 text-graphite leading-tight">
            {t('hero.title')}<br/>
            <span className="text-gold italic">{t('hero.titleAccent')}</span>
          </h1>
          <div className="w-20 h-px bg-gold mx-auto mt-6"></div>
          <p className="text-lg text-graphite/70 font-sans mt-8 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* ГАЛЕРЕЯ (динамическая) */}
      <section className="py-32 fade-up">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

            {images.length === 0 && (
              <p className="text-center text-graphite/60 col-span-full">
                {t('gallery.emptyMessage')}
              </p>
            )}

            {images.map((img: any) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <LazyImage
                  src={img.url}
                  alt="gallery"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-graphite/80 via-graphite/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-gold/80 uppercase tracking-wider text-xs font-sans mb-2 block">
                      {t('gallery.photoLabel')}
                    </span>
                    <h3 className="text-white font-serif text-xl">
                      {t('gallery.brandName')}
                    </h3>
                  </div>
                </div>

                {/* Декоративная рамка */}
                <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/60 transition-all duration-500 pointer-events-none"></div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* КАТЕГОРИИ */}
      <section className="py-32 bg-milk fade-left">
        <div className="container px-6">
          <div className="text-center mb-20">
            <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
              {t('categories.subtitle')}
            </span>
            <h2 className="text-5xl font-serif text-graphite">{t('categories.title')}</h2>
            <div className="w-20 h-px bg-gold mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {t.raw('categories.items').map((category: any, idx: number) => (
              <div
                key={idx}
                className="text-center p-8 bg-white border border-gold/20 transition-all duration-500 hover:border-gold hover:shadow-xl hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-serif mb-2 text-graphite">
                  {category.name}
                </h3>
                <p className="text-graphite/60 text-sm uppercase tracking-wider">
                  {category.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section className="py-32 fade-right">
        <div className="container px-6">
          <div className="text-center mb-20">
            <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
              {t('reviews.subtitle')}
            </span>
            <h2 className="text-5xl font-serif text-graphite">{t('reviews.title')}</h2>
            <div className="w-20 h-px bg-gold mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {t.raw('reviews.items').map((review: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-8 border-l-4 border-gold shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start gap-6 mb-6">
                  <div className="relative shrink-0">
                    <div className="absolute -top-2 -left-2 w-full h-full border-2 border-gold/20 rounded-full"></div>
                    <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-gold/20 to-graphite/20 flex items-center justify-center text-3xl">
                      👤
                    </div>
                  </div>
                  <div>
                    <h4 className="text-graphite font-sans font-semibold mb-2 text-lg">
                      {review.name}
                    </h4>
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-gold text-lg">★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-graphite/80 font-sans italic leading-relaxed">
                  &quot;{review.text}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-graphite text-white fade-up">
        <div className="container px-6 text-center">
          <h2 className="text-5xl font-serif mb-8">
            {t('cta.title')}<br/>
            <span className="text-gold italic">{t('cta.titleAccent')}</span>?
          </h2>

          <p className="text-white/80 font-sans mb-12 text-lg max-w-2xl mx-auto">
            {t('cta.description')}
          </p>

          <div className="flex gap-6 justify-center items-center flex-wrap">
            <a
              href="/booking"
              className="group relative px-10 py-4 bg-gold text-white font-sans uppercase tracking-widest text-sm rounded-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-gold/30 hover:-translate-y-1"
            >
              <span className="relative z-10">{t('cta.bookingButton')}</span>
              <div className="absolute inset-0 bg-white text-graphite transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </a>
<a
            
              href="/services"
              className="px-10 py-4 border-2 border-gold text-gold font-sans uppercase tracking-widest text-sm rounded-sm transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-1"
            >
              {t('cta.servicesButton')}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}