'use client'

// app/(admin)/admin/page.tsx

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Booking = {
  id: string
  firstName: string
  lastName: string
  serviceName: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

type Stats = {
  total: number
  pending: number
  confirmed: number
  cancelled: number
}

const STATUS_CONFIG = {
  pending:   { label: 'Очікує',       color: 'bg-orange-50 text-orange-600 border-orange-200' },
  confirmed: { label: 'Підтверджено', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  cancelled: { label: 'Скасовано',    color: 'bg-gray-50 text-gray-500 border-gray-200' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

const NAV_SECTIONS = [
  {
    href: '/admin/bookings',
    icon: '📅',
    title: 'Бронювання',
    desc: 'Перегляд та управління записами клієнтів',
    accent: 'from-rose-50 to-pink-50',
    iconBg: 'bg-gradient-to-br from-rose-100 to-pink-100',
  },
  {
    href: '/admin/gallery',
    icon: '🖼️',
    title: 'Галерея',
    desc: 'Завантаження та організація фотографій',
    accent: 'from-purple-50 to-pink-50',
    iconBg: 'bg-gradient-to-br from-purple-100 to-pink-100',
  },
  {
    href: '/admin/packages',
    icon: '🎁',
    title: 'Пакети',
    desc: 'Налаштування пакетів та цін',
    accent: 'from-pink-50 to-rose-50',
    iconBg: 'bg-gradient-to-br from-pink-100 to-rose-100',
  },
  {
    href: '/admin/services',
    icon: '✨',
    title: 'Послуги',
    desc: 'Управління переліком послуг студії',
    accent: 'from-rose-50 to-orange-50',
    iconBg: 'bg-gradient-to-br from-rose-100 to-orange-100',
  },
  {
    href: '/admin/products',
    icon: '🛍️',
    title: 'Магазин',
    desc: 'Управління товарами та продуктами',
    accent: 'from-pink-50 to-purple-50',
    iconBg: 'bg-gradient-to-br from-pink-100 to-purple-100',
  },
  {
    href: '/admin/email-templates',
    icon: '📧',
    title: 'Email шаблони',
    desc: 'Конструктор листів для клієнтів',
    accent: 'from-blue-50 to-rose-50',
    iconBg: 'bg-gradient-to-br from-blue-100 to-rose-100',
  },
  {
    href: '/admin/translations',
    icon: '🌐',
    title: 'Переклади',
    desc: 'Редагування текстів сайту (uk/ru/pl/en)',
    accent: 'from-orange-50 to-rose-50',
    iconBg: 'bg-gradient-to-br from-orange-100 to-rose-100',
  },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, confirmed: 0, cancelled: 0 })
  const [recent, setRecent] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats ?? { total: 0, pending: 0, confirmed: 0, cancelled: 0 })
        // Останні 5 бронювань, відсортовані за датою створення
        const sorted = (data.bookings ?? [])
          .slice()
          .sort((a: Booking & { createdAt: string }, b: Booking & { createdAt: string }) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5)
        setRecent(sorted)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const greeting =
    now.getHours() < 12 ? 'Доброго ранку' :
    now.getHours() < 17 ? 'Доброго дня' : 'Доброго вечора'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-rose-50/30 p-6 md:p-10 space-y-10">

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="border-b border-rose-200/50 pb-7">
        <span className="text-rose-500 text-xs uppercase tracking-[0.3em] font-medium mb-2 block">
          Luxenia
        </span>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">{greeting} 👋</h1>
        <p className="text-gray-500 text-sm mt-1.5">
          {now.toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </header>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.25em] text-gray-400 font-medium mb-4">
          Статистика бронювань
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'total',     label: 'Всього',        icon: '📋', bg: 'bg-white',   text: 'text-gray-900', border: 'border-gray-100' },
            { key: 'pending',   label: 'Очікують',      icon: '⏳', bg: 'bg-orange-50',    text: 'text-orange-600', border: 'border-orange-100' },
            { key: 'confirmed', label: 'Підтверджено',  icon: '✅', bg: 'bg-emerald-50',  text: 'text-emerald-600', border: 'border-emerald-100' },
            { key: 'cancelled', label: 'Скасовано',     icon: '❌', bg: 'bg-gray-50',      text: 'text-gray-500', border: 'border-gray-100' },
          ].map(({ key, label, icon, bg, text, border }) => (
            <Link
              key={key}
              href={key === 'total' ? '/admin/bookings' : `/admin/bookings?filter=${key}`}
              className={`${bg} rounded-2xl p-5 border ${border} hover:shadow-lg hover:scale-105 transition-all group`}
            >
              <div className="text-2xl mb-3">{icon}</div>
              <p className={`text-3xl font-bold ${text}`}>
                {loading ? <span className="inline-block w-8 h-7 bg-current/10 rounded animate-pulse" /> : stats[key as keyof Stats]}
              </p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent bookings ──────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs uppercase tracking-[0.25em] text-gray-400 font-medium">
            Останні бронювання
          </h2>
          <Link href="/admin/bookings" className="text-xs text-rose-500 hover:text-rose-600 font-medium">
            Всі →
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-sm">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 flex items-center justify-center h-32 text-sm text-gray-400 shadow-sm">
            Бронювань ще немає
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
                  <th className="text-left py-3 px-5 text-gray-600 text-xs uppercase tracking-wider font-semibold">Клієнт</th>
                  <th className="text-left py-3 px-5 text-gray-600 text-xs uppercase tracking-wider font-semibold hidden md:table-cell">Послуга</th>
                  <th className="text-left py-3 px-5 text-gray-600 text-xs uppercase tracking-wider font-semibold">Дата</th>
                  <th className="text-left py-3 px-5 text-gray-600 text-xs uppercase tracking-wider font-semibold">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((b) => {
                  const cfg = STATUS_CONFIG[b.status]
                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-rose-50/30 transition-colors cursor-pointer"
                      onClick={() => window.location.href = '/admin/bookings'}
                    >
                      <td className="py-3.5 px-5 font-semibold text-gray-900">
                        {b.firstName} {b.lastName}
                      </td>
                      <td className="py-3.5 px-5 text-gray-600 hidden md:table-cell">
                        {b.serviceName}
                      </td>
                      <td className="py-3.5 px-5 text-gray-600">
                        {formatDate(b.date)}
                        <span className="ml-1.5 text-xs text-gray-400">{b.time}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.color}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Navigation cards ─────────────────────────────────────── */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.25em] text-gray-400 font-medium mb-4">
          Розділи адмін-панелі
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAV_SECTIONS.map(({ href, icon, title, desc, accent, iconBg }) => (
            <Link
              key={href}
              href={href}
              className={`bg-gradient-to-br ${accent} border border-rose-100/50 rounded-2xl p-5 hover:shadow-lg hover:scale-105 transition-all group flex items-start gap-4`}
            >
              <div className={`${iconBg} w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                {icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
              </div>
              <span className="ml-auto text-rose-400 group-hover:text-rose-500 transition-colors text-lg self-center">→</span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}