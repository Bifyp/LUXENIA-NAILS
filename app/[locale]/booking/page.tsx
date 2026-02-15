'use client';
import { useTranslations } from 'next-intl';
import LazyImage from "../../../components/LazyImage";

export default function BookingPage() {
  const t = useTranslations('BookingPage');

  return (
    <div className="overflow-hidden">

      {/* HERO */}
      <section className="relative w-full min-h-[50vh] flex items-center justify-center fade-in bg-milk">
        <div className="container text-center relative z-10 px-6">
          <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
            {t('hero.subtitle')}
          </span>
          <h1 className="text-6xl md:text-7xl font-serif mb-8 text-graphite leading-tight">
            {t('hero.title')}<br/>
            <span className="text-gold italic">{t('hero.titleAccent')}</span>
          </h1>
          <div className="w-20 h-px bg-gold mx-auto mt-6"></div>
        </div>
      </section>

      {/* ФОРМА ЗАПИСИ */}
      <section className="py-32 fade-up">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-graphite/70 font-sans text-lg">
                {t('form.description')}
              </p>
            </div>

            <div className="p-12 bg-white shadow-2xl rounded-lg border border-gold/20">
              <form className="space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                      {t('form.fields.firstName.label')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('form.fields.firstName.placeholder')}
                      required
                      className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                      {t('form.fields.lastName.label')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('form.fields.lastName.placeholder')}
                      required
                      className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                      {t('form.fields.phone.label')}
                    </label>
                    <input
                      type="tel"
                      placeholder={t('form.fields.phone.placeholder')}
                      required
                      className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                      {t('form.fields.email.label')}
                    </label>
                    <input
                      type="email"
                      placeholder={t('form.fields.email.placeholder')}
                      className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                    {t('form.fields.service.label')}
                  </label>
                  <select 
                    required
                    className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none appearance-none bg-white"
                  >
                    <option value="">{t('form.fields.service.placeholder')}</option>
                    {t.raw('form.fields.service.options').map((option: string, idx: number) => (
                      <option key={idx}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                      {t('form.fields.date.label')}
                    </label>
                    <input
                      type="date"
                      className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                      {t('form.fields.time.label')}
                    </label>
                    <select className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none appearance-none bg-white">
                      <option value="">{t('form.fields.time.placeholder')}</option>
                      {t.raw('form.fields.time.options').map((option: string, idx: number) => (
                        <option key={idx}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                    {t('form.fields.comment.label')}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t('form.fields.comment.placeholder')}
                    className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="group relative bg-gold text-white w-full py-5 rounded-md font-sans uppercase tracking-widest text-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  <span className="relative z-10">{t('form.submitButton')}</span>
                  <div className="absolute inset-0 bg-graphite transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>

                <p className="text-center text-graphite/50 text-sm">
                  {t('form.requiredNote')}
                </p>
              </form>
            </div>

            <div className="mt-16 text-center">
              <p className="text-graphite/70 font-sans mb-4 text-lg">
                {t('contact.text')}
              </p>
              <a 
                href="tel:+48123456789" 
                className="text-4xl font-serif text-gold hover:underline inline-block transition-all duration-300 hover:scale-105"
              >
                {t('contact.phone')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ИНФОРМАЦИЯ */}
      <section className="py-32 bg-milk fade-left">
        <div className="container px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-graphite mb-6">
                {t('info.title')}
              </h2>
              <div className="w-20 h-px bg-gold mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.raw('info.items').map((info: any, idx: number) => (
                <div 
                  key={idx}
                  className="text-center p-8 bg-white border border-gold/20 transition-all duration-500 hover:border-gold hover:shadow-xl hover:-translate-y-2"
                >
                  <div className="text-5xl mb-4">{info.icon}</div>
                  <h3 className="text-xl font-serif mb-4 text-graphite">
                    {info.title}
                  </h3>
                  <p className="text-graphite/70 leading-relaxed text-sm">
                    {info.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 fade-right">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
                {t('faq.subtitle')}
              </span>
              <h2 className="text-4xl font-serif text-graphite mb-6">
                {t('faq.title')}
              </h2>
              <div className="w-20 h-px bg-gold mx-auto"></div>
            </div>

            <div className="space-y-6">
              {t.raw('faq.items').map((faq: any, idx: number) => (
                <div 
                  key={idx}
                  className="bg-white p-8 border-l-4 border-gold shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-lg font-serif mb-3 text-graphite">
                    {faq.q}
                  </h3>
                  <p className="text-graphite/70 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}