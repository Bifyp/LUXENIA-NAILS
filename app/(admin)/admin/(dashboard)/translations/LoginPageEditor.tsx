'use client'

import { useTranslationEditor, EditableText, EditorToolbar, EditorLoading, Toast } from '@/components/admin/editor-shared'

export default function LoginPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('LoginPage')
  const e = (key: string, tag: any = 'span', className = '') => (
    <EditableText value={get(key)} tKey={`LoginPage.${key}`} tag={tag} className={className} onSave={handleSave} />
  )
  if (loading) return <EditorLoading />
  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="Login Page" />
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
                Вхід
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

        {/* ФОРМА ВХОДА */}
        <section className="py-32 -mt-16 relative z-10">
          <div className="container px-6">
            <div className="max-w-md mx-auto">
              <div className="p-10 bg-white shadow-2xl rounded-3xl space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    {e('form.email.label')}
                  </label>
                  <input
                    type="email"
                    placeholder={get('form.email.placeholder')}
                    disabled
                    className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    {e('form.password.label')}
                  </label>
                  <input
                    type="password"
                    placeholder={get('form.password.placeholder')}
                    disabled
                    className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" disabled className="w-4 h-4 accent-rose-500 rounded" />
                    <span className="text-gray-600 text-sm">{e('form.rememberMe')}</span>
                  </label>
                  <span className="text-rose-600 text-sm font-medium cursor-pointer">
                    {e('form.forgotPassword')}
                  </span>
                </div>

                <button
                  type="button"
                  disabled
                  className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg opacity-80"
                >
                  {e('form.submitButton')}
                </button>

                <p className="text-center text-gray-500 text-sm mt-6">
                  {e('form.noAccount')}{" "}
                  <span className="text-rose-600 font-semibold cursor-pointer">
                    {e('form.registerLink')}
                  </span>
                </p>
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-600 text-sm">
                  {e('form.loginNote', 'p', 'text-gray-600 text-sm')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ПРЕИМУЩЕСТВА РЕГИСТРАЦИИ */}
        <section className="py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                {e('benefits.title', 'h2', 'text-4xl md:text-5xl font-bold text-gray-800')}
              </h2>
            </div>

            <p className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl max-w-5xl mx-auto">
              🔢 Елементи масиву (benefits.items) редагуються в розділі{' '}
              <a href="/admin/translations" className="text-rose-500 underline">Таблиця переводів</a>{' '}
              → секція LoginPage → benefits.items
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
