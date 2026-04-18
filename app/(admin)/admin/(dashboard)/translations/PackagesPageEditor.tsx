'use client'

import { useTranslationEditor, EditableText, EditorToolbar, EditorLoading, Toast } from '@/components/admin/editor-shared'

export default function PackagesPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('PackagesPage')
  const e = (key: string, tag: any = 'span', className = '', multiline = false) => (
    <EditableText value={get(key)} tKey={`PackagesPage.${key}`} tag={tag} className={className} onSave={handleSave} multiline={multiline} />
  )
  if (loading) return <EditorLoading />
  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="Packages Page" />
      <Toast toast={toast} />
      <div className="overflow-hidden">

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
                {e('hero.title', 'h1', 'text-6xl md:text-8xl font-bold text-white')}
              </h1>
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
                {e('hero.subtitle', 'p', 'text-xl md:text-2xl text-white/80')}
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        </section>

        <div className="container pb-32 -mt-16 relative z-10 px-6">
          <p className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl max-w-4xl mx-auto bg-white">
            📦 Пакети керуються через <a href="/admin/packages" className="text-rose-500 underline">Адмін-панель → Пакети</a>
          </p>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-4">Переклади для порожнього стану:</p>
            <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-8">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {e('empty.title', 'h3', 'text-2xl font-bold text-gray-800')}
              </h3>
              <p className="text-gray-600">
                {e('empty.subtitle', 'p', 'text-gray-600')}
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-4">Переклади кнопок та міток:</p>
            <div className="max-w-md mx-auto space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow">
                <p className="text-xs text-gray-500 mb-2">Кнопка вибору:</p>
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-full">
                  {e('selectButton')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow">
                <p className="text-xs text-gray-500 mb-2">Бейдж популярного:</p>
                <span className="px-4 py-2 bg-white text-rose-600 text-xs font-bold uppercase rounded-full shadow">
                  {e('popularBadge')}
                </span>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow">
                <p className="text-xs text-gray-500 mb-2">Примітка про термін дії:</p>
                <p className="text-gray-600 text-sm">
                  {e('validityNote', 'p', 'text-gray-600 text-sm')}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
