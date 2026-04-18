'use client'

import { useTranslationEditor, EditableText, EditorToolbar, EditorLoading, Toast } from '@/components/admin/editor-shared'

export default function RegisterPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('RegisterPage')
  const e = (key: string, tag: any = 'span', className = '', multiline = false) => (
    <EditableText value={get(key)} tKey={`RegisterPage.${key}`} tag={tag} className={className} onSave={handleSave} multiline={multiline} />
  )
  if (loading) return <EditorLoading />
  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="Register Page" />
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
                Реєстрація
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

        {/* FORM */}
        <section className="py-32 -mt-16 relative z-10">
          <div className="container px-6">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-10">
                <p className="text-gray-600 text-lg">{e('intro.description', 'p', 'text-gray-600 text-lg', true)}</p>
              </div>

              <div className="p-10 bg-white shadow-2xl rounded-3xl space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">{e('form.name.label')} *</label>
                  <input type="text" placeholder={get('form.name.placeholder')} disabled className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400" />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">{e('form.email.label')} *</label>
                  <input type="email" placeholder={get('form.email.placeholder')} disabled className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400" />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">{e('form.password.label')} *</label>
                  <input type="password" placeholder={get('form.password.placeholder')} disabled className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400" />
                  <p className="text-gray-500 text-xs mt-2">{e('form.password.hint')}</p>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">{e('form.confirmPassword.label')} *</label>
                  <input type="password" placeholder={get('form.confirmPassword.placeholder')} disabled className="border-2 border-gray-200 p-4 w-full rounded-xl bg-gray-50 text-gray-400" />
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" disabled className="w-4 h-4 mt-1 accent-rose-500 rounded" />
                  <label className="text-gray-600 text-sm">
                    {e('form.terms')}{" "}
                    <span className="text-rose-600 font-medium cursor-pointer">{e('form.termsLink')}</span>{" "}
                    {e('form.and')}{" "}
                    <span className="text-rose-600 font-medium cursor-pointer">{e('form.privacyLink')}</span>
                  </label>
                </div>
                <button type="button" disabled className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg opacity-80">
                  {e('form.registerButton')}
                </button>
                <p className="text-center text-gray-500 text-sm mt-6">
                  {e('form.haveAccount')}{" "}
                  <span className="text-rose-600 font-semibold cursor-pointer">{e('form.loginLink')}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">{e('benefits.title', 'h2', 'text-4xl md:text-5xl font-bold text-gray-800')}</h2>
            </div>
            <p className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl max-w-6xl mx-auto">
              🔢 Елементи масиву (benefits.items) редагуються в розділі{' '}
              <a href="/admin/translations" className="text-rose-500 underline">Таблиця переводів</a>{' '}
              → секція RegisterPage → benefits.items
            </p>
          </div>
        </section>

        {/* SECURITY */}
        <section className="py-32">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full mb-8">
                <span className="text-4xl">🔒</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">{e('security.title', 'h2', 'text-3xl md:text-4xl font-bold text-gray-800')}</h2>
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto text-lg">{e('security.description', 'p', 'text-gray-600 text-lg', true)}</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
