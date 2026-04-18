'use client'

import { useTranslationEditor, EditableText, EditorToolbar, EditorLoading, Toast } from '@/components/admin/editor-shared'

export default function AboutPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('AboutPage')

  const e = (key: string, tag: any = 'span', className = '', italic = false, multiline = false) => (
    <EditableText value={get(key)} tKey={`AboutPage.${key}`} tag={tag} className={className} onSave={handleSave} italic={italic} multiline={multiline} />
  )

  if (loading) return <EditorLoading />

  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="About Page" />
      <Toast toast={toast} />

      <div className="overflow-hidden">

        {/* HERO - Full Screen with Gradient */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/90 via-pink-500/90 to-rose-600/90"></div>

          <div className="container relative z-10 px-6 py-32 text-center text-white">
            <div className="max-w-4xl mx-auto">
              <div className="inline-block mb-8 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <p className="text-sm font-medium tracking-wide">
                  {e('hero.subtitle')}
                </p>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                {e('hero.title', 'h1', 'text-6xl md:text-8xl font-bold text-white')}
              </h1>

              <div className="w-24 h-1 bg-white/50 mx-auto mb-8"></div>

              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                {e('mission.title', 'p', 'text-xl md:text-2xl text-white/90')}
              </p>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* MISSION - Split Layout */}
        <section className="py-32 bg-white">
          <div className="container px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-rose-400 to-pink-400 rounded-3xl opacity-20 blur-2xl"></div>
                    <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-12">
                      <div className="text-7xl mb-6">✨</div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        {e('mission.subtitle', 'h2', 'text-3xl font-bold text-gray-800')}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  {e('mission.paragraph1', 'p', 'text-lg text-gray-600 leading-relaxed', false, true)}
                  {e('mission.paragraph2', 'p', 'text-lg text-gray-600 leading-relaxed', false, true)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MASTER - Bento Grid Style */}
        <section className="py-32 bg-gradient-to-b from-white to-pink-50/30">
          <div className="container px-6">
            <div className="max-w-7xl mx-auto">

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Large Image Card */}
                <div className="lg:col-span-2 lg:row-span-2">
                  <div className="relative h-full min-h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">📷 {get('master.imageAlt')}</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h2 className="text-4xl font-bold mb-2">{e('master.name', 'h2', 'text-4xl font-bold text-white')}</h2>
                      <p className="text-xl text-rose-300">{e('master.title', 'p', 'text-xl text-rose-300')}</p>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-3xl p-8 shadow-lg">
                  <div className="text-5xl mb-4">💅</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{e('master.subtitle', 'h3', 'text-2xl font-bold text-gray-800')}</h3>
                  {e('master.paragraph1', 'p', 'text-gray-600 leading-relaxed', false, true)}
                </div>

                {/* Quote Card */}
                <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-3xl p-8 shadow-lg text-white">
                  <svg className="w-12 h-12 mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-lg italic leading-relaxed">
                    &quot;{e('master.quote', 'span', 'text-lg text-white', false, true)}&quot;
                  </p>
                </div>
              </div>

              {/* Certificates */}
              <div className="mt-6 bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{e('master.certificatesTitle', 'h3', 'text-2xl font-bold text-gray-800')}</h3>
                <p className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl">
                  🔢 Элементы массива (сертификаты) редактируются в разделе{' '}
                  <a href="/admin/translations" className="text-rose-500 underline">Таблица переводов</a>{' '}
                  → секция AboutPage → master.certificates
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES - Card Carousel Style */}
        <section className="py-32 bg-white">
          <div className="container px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 rounded-full text-sm font-medium mb-6">
                {e('values.subtitle')}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
                {e('values.title', 'h2', 'text-4xl md:text-5xl font-bold')}
              </h2>
            </div>

            <p className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl max-w-6xl mx-auto">
              🔢 Элементы массива (ценности) редактируются в разделе{' '}
              <a href="/admin/translations" className="text-rose-500 underline">Таблица переводов</a>{' '}
              → секция AboutPage → values.items
            </p>
          </div>
        </section>

        {/* STUDIO - Magazine Style */}
        <section className="py-32 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
          </div>

          <div className="container px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                <div>
                  <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
                    {e('studio.subtitle')}
                  </span>
                  <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                    {e('studio.title', 'span', 'text-5xl md:text-6xl font-bold text-white')} {e('studio.titleLine2', 'span', 'text-5xl md:text-6xl font-bold text-white')}
                  </h2>
                  <p className="text-xl text-white/80 mb-8 leading-relaxed">
                    {e('studio.paragraph', 'p', 'text-xl text-white/80', false, true)}
                  </p>

                  <div className="mb-8">
                    <p className="text-gray-400 text-sm py-4 border border-dashed border-white/20 rounded-xl px-4">
                      🔢 Элементы массива (особенности студии) редактируются в разделе{' '}
                      <a href="/admin/translations" className="text-rose-400 underline">Таблица переводов</a>{' '}
                      → секция AboutPage → studio.features
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full font-medium shadow-lg cursor-pointer">
                    {e('studio.linkText')}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-rose-400 to-pink-400 rounded-3xl opacity-30 blur-2xl"></div>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-rose-100 to-pink-100 h-[600px] flex items-center justify-center">
                    <span className="text-gray-400 text-sm">📷 {get('studio.imageAlt')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA - Minimal */}
        <section className="py-32 bg-white">
          <div className="container px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                {e('cta.title', 'h2', 'text-4xl md:text-5xl font-bold text-gray-800')}
              </h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                {e('cta.description', 'p', 'text-xl text-gray-600', false, true)}
              </p>
              <div className="flex gap-4 justify-center items-center flex-wrap">
                <span className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg cursor-pointer">
                  {e('cta.bookButton')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <span className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 rounded-full font-medium cursor-pointer hover:border-rose-500 hover:text-rose-600 transition-all duration-300">
                  {e('cta.servicesButton')}
                </span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
