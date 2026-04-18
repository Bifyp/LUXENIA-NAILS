'use client'

import { useTranslationEditor, EditableText, EditorToolbar, EditorLoading, Toast } from '@/components/admin/editor-shared'

export default function BookingPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('BookingPage')

  const e = (key: string, tag: any = 'span', className = '', multiline = false) => (
    <EditableText value={get(key)} tKey={`BookingPage.${key}`} tag={tag} className={className} onSave={handleSave} multiline={multiline} />
  )

  if (loading) return <EditorLoading />

  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="Booking Page" />
      <Toast toast={toast} />

      <div className="overflow-hidden">

        {/* HERO */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
          </div>

          <div className="container relative z-10 px-6 text-center text-white">
            <div className="max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                {e('hero.subtitle')}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                {e('hero.title', 'h1', 'text-5xl md:text-7xl font-bold text-white')}
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                {e('hero.titleAccent', 'p', 'text-xl md:text-2xl text-white/90')}
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        </section>

        {/* ФОРМА */}
        <section className="py-32 -mt-16 relative z-10">
          <div className="container px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <p className="text-gray-600 text-lg">
                  {e('form.description', 'p', 'text-gray-600 text-lg', true)}
                </p>
              </div>

              <div className="p-12 bg-white shadow-2xl rounded-3xl">
                <div className="space-y-8">

                  {/* Name fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        {e('form.fields.firstName.label')}
                      </label>
                      <input
                        type="text"
                        placeholder={get('form.fields.firstName.placeholder')}
                        disabled
                        className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        {e('form.fields.lastName.label')}
                      </label>
                      <input
                        type="text"
                        placeholder={get('form.fields.lastName.placeholder')}
                        disabled
                        className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Contact fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  {/* SERVICE / PACKAGE TABS */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-3 text-sm">
                      {e('form.fields.service.label')}
                    </label>
                    <div className="flex gap-0 mb-4 border-2 border-gray-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        disabled
                        className="flex-1 py-3 text-sm font-medium bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                      >
                        ✨ {e('form.tabServices')}
                      </button>
                      <button
                        type="button"
                        disabled
                        className="flex-1 py-3 text-sm font-medium border-l-2 border-gray-200 text-gray-600"
                      >
                        🎁 {e('form.tabPackages')}
                      </button>
                    </div>

                    <select
                      disabled
                      className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400 appearance-none"
                    >
                      <option>{get('form.fields.service.placeholder')}</option>
                    </select>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-4 text-sm">
                      {e('form.fields.date.label')}
                    </label>
                    <div className="border-2 border-gray-200 rounded-2xl p-6 bg-gray-50">
                      <p className="text-gray-400 text-sm text-center py-8">📅 Календарь (не редактируется)</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-4 text-sm">
                      {e('form.fields.time.label')}
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {['09:00', '10:00', '11:00', '12:00', '13:00'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          disabled
                          className="py-2.5 text-sm font-medium rounded-xl border-2 border-gray-200 text-gray-400 bg-gray-50"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                      {e('form.fields.comment.label')}
                    </label>
                    <textarea
                      disabled
                      rows={4}
                      placeholder={get('form.fields.comment.placeholder')}
                      className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400 resize-none"
                    />
                  </div>

                  <button
                    type="button"
                    disabled
                    className="w-full py-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg opacity-80"
                  >
                    {e('form.submitButton')}
                  </button>

                  <p className="text-center text-gray-500 text-sm">
                    {e('form.requiredNote')}
                  </p>
                </div>
              </div>

              <div className="mt-16 text-center">
                <p className="text-gray-600 mb-4 text-lg">
                  {e('contact.text', 'p', 'text-gray-600 text-lg')}
                </p>
                <span className="text-4xl font-bold text-rose-600">
                  {e('contact.phone')}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ИНФОРМАЦИЯ */}
        <section className="py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  {e('info.title', 'h2', 'text-4xl md:text-5xl font-bold text-gray-800')}
                </h2>
              </div>
              <p className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl">
                🔢 Элементы массива (info.items) редактируются в разделе{' '}
                <a href="/admin/translations" className="text-rose-500 underline">Таблица переводов</a>{' '}
                → секция BookingPage → info.items
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-32">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 rounded-full text-sm font-medium mb-6">
                  {e('faq.subtitle')}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  {e('faq.title', 'h2', 'text-4xl md:text-5xl font-bold text-gray-800')}
                </h2>
              </div>
              <p className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl">
                🔢 Вопросы FAQ редактируются в разделе{' '}
                <a href="/admin/translations" className="text-rose-500 underline">Таблица переводов</a>{' '}
                → секция BookingPage → faq.items
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
