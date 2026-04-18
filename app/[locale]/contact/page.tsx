'use client';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('ContactPage');

  return (
    <div className="overflow-hidden">

      {/* HERO - Split Screen */}
      <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Content */}
        <div className="flex items-center justify-center p-12 bg-gradient-to-br from-rose-600 via-pink-500 to-rose-500 text-white">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              {t('hero.subtitle')}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Зв'яжіться з нами будь-яким зручним способом
            </p>

            {/* Quick Contact Cards */}
            <div className="space-y-4">
              {t.raw('contactInfo.items').slice(0, 3).map((contact: any, idx: number) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{contact.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{contact.title}</h3>
                      <p className="text-white/90">{contact.info}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-12 bg-white">
          <div className="w-full max-w-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Напишіть нам</h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    {t('form.fields.name.label')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('form.fields.name.placeholder')}
                    required
                    className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all duration-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    {t('form.fields.email.label')}
                  </label>
                  <input
                    type="email"
                    placeholder={t('form.fields.email.placeholder')}
                    required
                    className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all duration-300 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  {t('form.fields.phone.label')}
                </label>
                <input
                  type="tel"
                  placeholder={t('form.fields.phone.placeholder')}
                  className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all duration-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  {t('form.fields.subject.label')}
                </label>
                <select
                  className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all duration-300 outline-none appearance-none bg-white"
                >
                  <option value="">{t('form.fields.subject.placeholder')}</option>
                  {t.raw('form.fields.subject.options').map((option: string, idx: number) => (
                    <option key={idx}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  {t('form.fields.message.label')}
                </label>
                <textarea
                  rows={5}
                  placeholder={t('form.fields.message.placeholder')}
                  required
                  className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all duration-300 outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                {t('form.submitButton')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* HOURS - Timeline Style */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent mb-6">
              {t('hours.title')}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-400 to-pink-400 -translate-x-1/2"></div>

              {/* Weekdays */}
              <div className="mb-12">
                <div className="relative bg-white rounded-2xl p-8 shadow-lg ml-auto w-[calc(50%-2rem)]">
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('hours.weekdays.title')}</h3>
                  <div className="space-y-3">
                    {t.raw('hours.weekdays.schedule').map((schedule: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-gray-600">{schedule.day}</span>
                        <span className="font-bold text-rose-600">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weekend */}
              <div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg mr-auto w-[calc(50%-2rem)]">
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('hours.weekend.title')}</h3>
                  <div className="space-y-3">
                    {t.raw('hours.weekend.schedule').map((schedule: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-gray-600">{schedule.day}</span>
                        <span className="font-bold text-rose-600">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-gray-600 text-sm">{t('hours.note')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL - Icon Grid */}
      <section className="py-32 bg-white">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 rounded-full text-sm font-medium mb-6">
              {t('social.subtitle')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
              {t('social.title')}
            </h2>
            <p className="text-gray-600 mb-12 text-lg">
              {t('social.description')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="https://www.instagram.com/lumaskin_laser_studio"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-6xl mb-4">📷</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Instagram</h3>
                <p className="text-gray-600 text-sm">@luxenia.nails</p>
              </a>

              <a
                href="https://www.facebook.com/share/1DGrdC9RvF/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-6xl mb-4">📘</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Facebook</h3>
                <p className="text-gray-600 text-sm">Luxenia Nails</p>
              </a>

              <a
                href="https://booksy.com/pl-pl/307205_lumaskin-laser-studio_depilacja_16974_swarzedz#ba_s=seo"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-6xl mb-4">💆‍♀️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Booksy</h3>
                <p className="text-gray-600 text-sm">Онлайн запис</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Full Width */}
      <section className="py-24 bg-gradient-to-r from-rose-600 to-pink-500 text-white">
        <div className="container px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('cta.title')} {t('cta.titleLine2')}
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="flex gap-4 justify-center items-center flex-wrap">
            <a
              href="/booking"
              className="px-8 py-4 bg-white text-rose-600 rounded-full font-medium shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              {t('cta.bookingButton')}
            </a>
            <a
              href="tel:+48123456789"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-full font-medium hover:bg-white hover:text-rose-600 transition-all duration-300"
            >
              {t('cta.callButton')}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
