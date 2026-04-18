'use client'

import { useTranslationEditor, EditableText, EditorToolbar, EditorLoading, Toast } from '@/components/admin/editor-shared'

export default function ServicesPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('ServicesPage')
  const e = (key: string, tag: any = 'span', className = '', multiline = false) => (
    <EditableText value={get(key)} tKey={`ServicesPage.${key}`} tag={tag} className={className} onSave={handleSave} multiline={multiline} />
  )
  if (loading) return <EditorLoading />
  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="Services Page" />
      <Toast toast={toast} />
      <div className="overflow-hidden">

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
                {e('hero.title', 'h1', 'text-6xl md:text-8xl font-bold text-white')}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">{e('hero.subtitle', 'p', 'text-xl md:text-2xl text-white/90')}</p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        </section>

        <div className="container pb-32 -mt-16 relative z-10 px-6">
          <p className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl max-w-4xl mx-auto bg-white">
            💅 Послуги керуються через <a href="/admin/services" className="text-rose-500 underline">Адмін-панель → Послуги</a>
          </p>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-4">Переклади для порожнього стану:</p>
            <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-8">
              <div className="text-6xl mb-4">💅</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{e('empty.title', 'h3', 'text-2xl font-bold text-gray-800')}</h3>
              <p className="text-gray-600">{e('empty.subtitle', 'p', 'text-gray-600')}</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-4">Переклад кнопки:</p>
            <div className="max-w-md mx-auto">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-full">
                {e('serviceCard.selectButton')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
