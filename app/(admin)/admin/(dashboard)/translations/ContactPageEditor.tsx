'use client'

import { useTranslationEditor, EditableText, EditorToolbar, EditorLoading, Toast } from '@/components/admin/editor-shared'

export default function ContactPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('ContactPage')

  const e = (key: string, tag: any = 'span', className = '', multiline = false) => (
    <EditableText value={get(key)} tKey={`ContactPage.${key}`} tag={tag} className={className} onSave={handleSave} multiline={multiline} />
  )

  if (loading) return <EditorLoading />

  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="Contact Page" />
      <Toast toast={toast} />

      <div className="overflow-hidden">

        {/* HERO - Split Screen */}
        <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Content */}
          <div className="flex items-center justify-center p-12 bg-gradient-to-br from-rose-600 via-pink-500 to-rose-500 text-white">
            <div className="max-w-xl">
              <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                {e('hero.subtitle')}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                {e('hero.title', 'h1', 'text-5xl md:text-7xl font-bold text-white')}
              </h1>
              <p className="text-xl text-white/90 mb-12 leading-relaxed">
                Зв'яжіться з нами будь-яким зручним способом
              </p>

              {/* Quick Contact Cards */}
              <div className="space-y-4">
                <p className="text-white/70 text-sm mb-4">
                  🔢 Контактна інформація (contactInfo.items) редактується в{' '}
                  <a href="/admin/translations" className="text-white underline">Таблиці переводів</a>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex items-center justify-center p-12 bg-white">
            <div className="w-full max-w-xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Напишіть нам</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                      {e('form.fields.name.label')}
                    </label>
                    <input
                      type="text"
                      placeholder={get('form.fields.name.placeholder')}
                      disabled
                      className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                      {e('form.fields.email.label')}
                    </label>
                    <input
                      type="text"
                      placeholder={get('form.fields.email.placeholder')}
                      disabled
                      className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    {e('form.fields.phone.label')}
                  </label>
                  <input
                    type="text"
                    placeholder={get('form.fields.phone.placeholder')}
                    disabled
                    className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    {e('form.fields.subject.label')}
                  </label>
                  <select
                    disabled
                    className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400 appearance-none"
                  >
                    <option>{get('form.fields.subject.placeholder')}</option>
                  </select>
                  <p className="text-gray-400 text-xs mt-1">
                    Опції (subject.options) редактуються в таблиці переводів
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    {e('form.fields.message.label')}
                  </label>
                  <textarea
                    rows={5}
                    placeholder={get('form.fields.message.placeholder')}
                    disabled
                    className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400 resize-none"
                  ></textarea>
                </div>

                <button
                  type="button"
                  disabled
                  className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-xl opacity-80"
                >
                  {e('form.submitButton')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* HOURS - Timeline Style */}
        <section className="py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent mb-6">
                {e('hours.title', 'h2', 'text-4xl md:text-5xl font-bold')}
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
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">{e('hours.weekdays.title', 'h3', 'text-2xl font-bold text-gray-800')}</h3>
                    <p className="text-gray-400 text-sm">
                      🔢 Розклад (weekdays.schedule) редактується в{' '}
                      <a href="/admin/translations" className="text-rose-500 underline">Таблиці переводів</a>
                    </p>
                  </div>
                </div>

                {/* Weekend */}
                <div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg mr-auto w-[calc(50%-2rem)]">
                    <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">{e('hours.weekend.title', 'h3', 'text-2xl font-bold text-gray-800')}</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      🔢 Розклад (weekend.schedule) редактується в таблиці переводів
                    </p>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-gray-600 text-sm">{e('hours.note', 'p', 'text-gray-600 text-sm', true)}</p>
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
                {e('social.subtitle')}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
                {e('social.title', 'h2', 'text-4xl md:text-5xl font-bold text-gray-800')}
              </h2>
              <p className="text-gray-600 mb-12 text-lg">
                {e('social.description', 'p', 'text-gray-600 text-lg', true)}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 shadow-lg">
                  <div className="text-6xl mb-4">📷</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Instagram</h3>
                  <p className="text-gray-600 text-sm">@luxenia.nails</p>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 shadow-lg">
                  <div className="text-6xl mb-4">📘</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Facebook</h3>
                  <p className="text-gray-600 text-sm">Luxenia Nails</p>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 shadow-lg">
                  <div className="text-6xl mb-4">💆‍♀️</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Booksy</h3>
                  <p className="text-gray-600 text-sm">Онлайн запис</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA - Full Width */}
        <section className="py-24 bg-gradient-to-r from-rose-600 to-pink-500 text-white">
          <div className="container px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {e('cta.title', 'span', 'text-4xl md:text-5xl font-bold text-white')} {e('cta.titleLine2', 'span', 'text-4xl md:text-5xl font-bold text-white')}
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              {e('cta.description', 'p', 'text-xl text-white/90', true)}
            </p>
            <div className="flex gap-4 justify-center items-center flex-wrap">
              <span className="px-8 py-4 bg-white text-rose-600 rounded-full font-medium shadow-lg cursor-pointer">
                {e('cta.bookingButton')}
              </span>
              <span className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-full font-medium cursor-pointer">
                {e('cta.callButton')}
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
