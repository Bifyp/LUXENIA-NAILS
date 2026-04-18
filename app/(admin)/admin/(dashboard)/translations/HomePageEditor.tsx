'use client'

import { useState, useEffect, useRef } from 'react'

type Translations = Record<string, string>

// ─── Inline редактируемый текст ───────────────────────────────────────────────

function EditableText({
  value,
  tKey,
  tag = 'span',
  className = '',
  onSave,
  italic = false,
}: {
  value: string
  tKey: string
  tag?: 'span' | 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  onSave: (key: string, value: string) => Promise<void>
  italic?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [current, setCurrent] = useState(value)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    setCurrent(value)
  }, [value])

  const handleSave = async () => {
    if (current === value) { setEditing(false); return }
    setSaving(true)
    await onSave(tKey, current)
    setSaving(false)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave() }
    if (e.key === 'Escape') { setCurrent(value); setEditing(false) }
  }

  const Tag = tag

  if (editing) {
    return (
      <span className="relative inline-block w-full">
        <textarea
          autoFocus
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full bg-white/90 border-2 border-rose-400 rounded-xl px-3 py-2 text-gray-800 resize-none outline-none shadow-lg ${className}`}
          rows={current.length > 60 ? 3 : 1}
        />
        <span className="absolute -bottom-10 right-0 flex gap-2 z-50">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs px-4 py-2 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-60 font-medium"
          >
            {saving ? '...' : '✓ Сохранить'}
          </button>
          <button
            onClick={() => { setCurrent(value); setEditing(false) }}
            className="bg-gray-100 text-gray-700 text-xs px-4 py-2 rounded-xl shadow hover:bg-gray-200 font-medium"
          >
            ✕
          </button>
        </span>
      </span>
    )
  }

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement & HTMLHeadingElement & HTMLParagraphElement>}
      className={`${className} relative group cursor-pointer`}
      onClick={() => setEditing(true)}
      title="Нажмите чтобы редактировать"
    >
      {italic ? <em>{current}</em> : current}
      {saved && (
        <span className="absolute -top-8 left-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg">
          ✓ Сохранено
        </span>
      )}
      <span className="absolute inset-0 border-2 border-transparent group-hover:border-rose-400/60 group-hover:bg-rose-50/20 rounded-xl transition-all pointer-events-none" />
      <span className="absolute -top-6 right-0 hidden group-hover:block bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap z-10 shadow-lg font-medium">
        ✏️ {tKey}
      </span>
    </Tag>
  )
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function HomePageEditor() {
  const [t, setT] = useState<Translations>({})
  const [loading, setLoading] = useState(true)
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/translations')
      .then((r) => r.json())
      .then((data) => {
        // Разворачиваем плоские ключи секции HomePage в удобный объект
        const flat: Translations = {}
        const sections = data.sections || {}
        for (const [section, keys] of Object.entries(sections)) {
          for (const [key, value] of Object.entries(keys as Record<string, string>)) {
            flat[`${section}.${key}`] = value
          }
        }
        setT(flat)
        setLoading(false)
      })
  }, [])

  const get = (key: string) => t[`HomePage.${key}`] ?? key

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async (fullKey: string, value: string) => {
    // fullKey вида "HomePage.hero.title"
    const parts = fullKey.split('.')
    const section = parts[0]          // "HomePage"
    const key = parts.slice(1).join('.')  // "hero.title"

    setSavingSection(key)
    try {
      const res = await fetch('/api/admin/translations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, key, value }),
      })
      const data = await res.json()
      if (data.success) {
        setT((prev) => ({ ...prev, [fullKey]: value }))
        showToast(`✅ Переведено на RU / PL / UK`)
      } else {
        showToast(`❌ Ошибка: ${data.error}`)
      }
    } catch {
      showToast('❌ Ошибка соединения')
    }
    setSavingSection(null)
  }

  const e = (key: string, tag: 'span' | 'h1' | 'h2' | 'h3' | 'p' = 'span', className = '', italic = false) => (
    <EditableText
      value={get(key)}
      tKey={`HomePage.${key}`}
      tag={tag}
      className={className}
      onSave={handleSave}
      italic={italic}
    />
  )

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-gray-400 text-sm">Загрузка страницы...</div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Панель инструментов */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="font-semibold">✏️ Режим редактирования</span>
          <span className="text-white/80 text-xs">Нажмите на любой текст чтобы изменить</span>
        </div>
        <div className="flex items-center gap-4">
          {savingSection && (
            <span className="text-white/80 text-xs animate-pulse">
              Переводим на RU/PL/UK...
            </span>
          )}
          <a
            href="/admin/translations"
            className="text-xs bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition font-medium"
          >
            ← Таблица переводов
          </a>
        </div>
      </div>

      {/* Тост */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm px-5 py-3 rounded-2xl shadow-2xl">
          {toast}
        </div>
      )}

      {/* ═══ СТРАНИЦА КАК НА САЙТЕ ═══ */}
      <div className="overflow-hidden">

        {/* HERO - Full Screen Video Style */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
          </div>

          <div className="container relative z-10 px-6 text-center text-white">
            <div className="max-w-5xl mx-auto">
              <div className="inline-block mb-8 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <p className="text-sm font-medium tracking-wide">
                  {e('hero.subtitle')}
                </p>
              </div>

              <h1 className="text-7xl md:text-9xl font-bold mb-8 tracking-tight text-white">
                LUXENIA
              </h1>

              <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                {e('hero.description', 'p', 'text-xl md:text-2xl text-white/80')}
              </p>

              <div className="flex gap-4 justify-center items-center flex-wrap">
                <span className="inline-flex items-center gap-2 px-8 py-4 bg-white text-rose-600 rounded-full font-medium shadow-lg cursor-pointer">
                  {e('hero.bookButton')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>

                <span className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-full font-medium cursor-pointer">
                  {e('hero.servicesButton')}
                </span>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* SERVICES - Bento Grid */}
        <section className="py-32 bg-white">
          <div className="container px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 rounded-full text-sm font-medium mb-6">
                {e('services.subtitle')}
              </span>
              {e('services.title', 'h2', 'text-4xl md:text-5xl font-bold text-gray-800')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {[
                { prefix: 'services.facial', icon: '💅', gradient: 'from-rose-500 to-pink-500' },
                { prefix: 'services.peeling', icon: '✨', gradient: 'from-pink-500 to-rose-400' },
                { prefix: 'services.massage', icon: '💆', gradient: 'from-rose-400 to-pink-400' },
              ].map(({ prefix, icon, gradient }) => (
                <div
                  key={prefix}
                  className="group relative overflow-hidden bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full`}></div>

                  <div className="relative">
                    <div className="text-6xl mb-6">{icon}</div>
                    {e(`${prefix}.title`, 'h3', 'text-2xl font-bold text-gray-800 mb-4 group-hover:text-rose-600 transition-colors')}
                    {e(`${prefix}.description`, 'p', 'text-gray-600 leading-relaxed mb-6')}
                    <span className="inline-flex items-center gap-2 text-rose-600 font-medium cursor-pointer">
                      {e('services.learnMore')}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT - Split with Image */}
        <section className="relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left - Image */}
            <div className="relative h-[600px] lg:h-auto bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">📷 {get('about.imageAlt')}</span>
            </div>

            {/* Right - Content */}
            <div className="flex items-center p-12 lg:p-24 bg-white">
              <div className="max-w-xl">
                <span className="inline-block px-4 py-1 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 rounded-full text-sm font-medium mb-6">
                  {e('about.subtitle')}
                </span>
                {e('about.title', 'h2', 'text-4xl md:text-5xl font-bold mb-6 text-gray-800 leading-tight')}
                <div className="space-y-4 text-gray-600 leading-relaxed mb-8">
                  {e('about.paragraph1', 'p', 'text-gray-600 leading-relaxed')}
                  {e('about.paragraph2', 'p', 'text-gray-600 leading-relaxed')}
                </div>
                <span className="inline-flex items-center gap-2 text-rose-600 font-medium cursor-pointer">
                  {e('about.learnMore')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-32 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
          <div className="container px-6 max-w-6xl mx-auto">
            <div className="text-center mb-20">
              {e('stats.title', 'h2', 'text-4xl md:text-5xl font-bold mb-6 text-white')}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { num: 'stats.experience.number', label: 'stats.experience.label' },
                { num: 'stats.clients.number', label: 'stats.clients.label' },
                { num: 'stats.procedures.number', label: 'stats.procedures.label' },
                { num: 'stats.premium.number', label: 'stats.premium.label' },
              ].map(({ num, label }) => (
                <div key={num} className="text-center">
                  <div className="text-5xl font-bold text-rose-400 mb-4">{e(num)}</div>
                  <div className="text-sm uppercase tracking-widest text-white/70">{e(label)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="py-32 bg-white">
          <div className="container px-6 text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 rounded-full text-sm font-medium mb-6">
              {e('contact.subtitle')}
            </span>
            {e('contact.title', 'h2', 'text-4xl md:text-5xl font-bold mb-8 text-gray-800')}
            {e('contact.description', 'p', 'text-gray-600 mb-4 text-lg leading-relaxed')}
            {e('contact.address', 'p', 'text-rose-600 mb-12 text-xl font-medium')}
            <div className="flex gap-4 justify-center flex-wrap">
              <span className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg cursor-pointer">
                {e('contact.contactButton')}
              </span>
              <span className="px-8 py-4 border-2 border-rose-500 text-rose-600 rounded-full font-medium cursor-pointer hover:bg-rose-50 transition-colors">
                {e('contact.callButton')}
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
