import TranslationEditor from '@/components/admin/TranslationEditor'

export default function TranslationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-rose-50/30 p-6 md:p-8">
      <header className="border-b border-rose-200/50 pb-7 mb-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="text-rose-500 text-xs uppercase tracking-[0.3em] font-semibold mb-2 block">Luxenia</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Переклади</h1>
            <p className="text-gray-500 text-sm mt-1.5">Управління текстами сайту</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-sm text-rose-500 hover:text-rose-600 transition-colors font-medium">← Адмін-панель</a>
            <a
              href="/admin/translations/preview"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all"
            >
              👁 Відкрити сторінки
            </a>
          </div>
        </div>
      </header>
      <TranslationEditor />
    </div>
  )
}