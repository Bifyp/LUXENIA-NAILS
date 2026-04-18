'use client'

import { useTranslationEditor, EditableText, EditorToolbar, EditorLoading, Toast } from '@/components/admin/editor-shared'

export default function ForgotPasswordPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('ForgotPasswordPage')
  const e = (key: string, tag: any = 'span', className = '', multiline = false) => (
    <EditableText value={get(key)} tKey={`ForgotPasswordPage.${key}`} tag={tag} className={className} onSave={handleSave} multiline={multiline} />
  )
  if (loading) return <EditorLoading />
  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="Forgot Password Page" />
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
                Відновлення
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                {e('title', 'h1', 'text-5xl md:text-7xl font-bold text-white')}
              </h1>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        </section>

        <section className="py-32 -mt-16 relative z-10">
          <div className="container px-6">
            <div className="max-w-md mx-auto bg-white p-10 shadow-2xl rounded-3xl">

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full mb-6">
                  <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg">
                  {e('description', 'p', 'text-gray-600 text-lg', true)}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-700 font-medium mb-2">
                    {e('emailLabel')}
                  </label>
                  <input
                    type="email"
                    disabled
                    className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400"
                    placeholder={get('emailPlaceholder')}
                  />
                </div>

                <button
                  type="button"
                  disabled
                  className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg opacity-80"
                >
                  {e('submit')}
                </button>

                <div className="text-center">
                  <span className="text-rose-600 text-sm font-medium cursor-pointer">
                    ← Назад до входу
                  </span>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-gray-500 text-sm text-center mb-4">Успішна відправка:</p>
                <div className="text-center py-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{e('sentTitle', 'h3', 'text-lg font-bold text-gray-800')}</h3>
                  <p className="text-gray-600 text-sm">{e('sentDescription', 'p', 'text-gray-600 text-sm', true)}</p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
