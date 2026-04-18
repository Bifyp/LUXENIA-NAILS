//app/(admin)/admin/(dashboard)/bookings/page.tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

type Booking = {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  serviceName: string
  date: string
  time: string
  comment: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

type Stats = {
  total: number
  pending: number
  confirmed: number
  cancelled: number
}

const STATUS_CONFIG = {
  pending:   { label: 'Очікує',     color: 'bg-orange-50 text-orange-600 border-orange-200' },
  confirmed: { label: 'Підтверджено', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  cancelled: { label: 'Скасовано',  color: 'bg-gray-50 text-gray-500 border-gray-200' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm text-white font-medium ${ok ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-rose-500 to-pink-500'}`}>
      {msg}
    </div>
  )
}

// ─── Booking detail modal ────────────────────────────────────────────────────

function BookingModal({
  booking,
  onClose,
  onStatusChange,
}: {
  booking: Booking
  onClose: () => void
  onStatusChange: (id: string, status: string) => Promise<void>
}) {
  const [saving, setSaving] = useState<string | null>(null)

  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    closeBtnRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleStatus = async (status: string) => {
    setSaving(status)
    await onStatusChange(booking.id, status)
    setSaving(null)
    onClose()
  }

  const cfg = STATUS_CONFIG[booking.status]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <p className="text-rose-500 text-xs uppercase tracking-[0.2em] mb-0.5 font-semibold">Деталі бронювання</p>
            <h2 id="booking-title" className="text-xl font-bold text-gray-900">{booking.firstName} {booking.lastName}</h2>
          </div>
          <button ref={closeBtnRef} onClick={onClose} aria-label="Закрити" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-colors">✕</button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Status badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${cfg.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {cfg.label}
          </div>

          {/* Details */}
          <div className="bg-gradient-to-br from-gray-50 to-rose-50/30 rounded-2xl p-4 space-y-3">
            {[
              { label: 'Послуга', value: booking.serviceName },
              { label: 'Дата', value: formatDate(booking.date) },
              { label: 'Час', value: booking.time },
              { label: 'Телефон', value: booking.phone },
              { label: 'Email', value: booking.email },
              ...(booking.comment ? [{ label: 'Коментар', value: booking.comment }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-xs text-gray-400 uppercase tracking-wider shrink-0 font-medium">{label}</span>
                <span className="text-sm text-gray-900 text-right font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* Status actions */}
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">Змінити статус</p>
            <div className="flex gap-2 flex-wrap">
              {booking.status !== 'confirmed' && (
                <button
                  onClick={() => handleStatus('confirmed')}
                  disabled={!!saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-60 transition-all"
                >
                  {saving === 'confirmed' ? '...' : '✓ Підтвердити'}
                </button>
              )}
              {booking.status !== 'cancelled' && (
                <button
                  onClick={() => handleStatus('cancelled')}
                  disabled={!!saving}
                  className="flex-1 py-2.5 rounded-xl bg-gray-50 text-gray-600 border border-gray-200 text-sm font-semibold hover:bg-gray-100 hover:scale-105 disabled:opacity-60 transition-all"
                >
                  {saving === 'cancelled' ? '...' : '✕ Скасувати'}
                </button>
              )}
              {booking.status !== 'pending' && (
                <button
                  onClick={() => handleStatus('pending')}
                  disabled={!!saving}
                  className="flex-1 py-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 text-sm font-semibold hover:bg-orange-100 hover:scale-105 disabled:opacity-60 transition-all"
                >
                  {saving === 'pending' ? '...' : '↩ В очікування'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, confirmed: 0, cancelled: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [selected, setSelected] = useState<Booking | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const toastTimerRef = useRef<number | null>(null)

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const safeShowToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    // @ts-ignore
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => () => { if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current) }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/bookings')
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Помилка завантаження')
      setBookings(data.bookings || [])
      setStats(data.stats || { total: 0, pending: 0, confirmed: 0, cancelled: 0 })
    } catch {
      safeShowToast('❌ Помилка завантаження', false)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    if (data.success) {
      safeShowToast('✅ Статус оновлено', true)
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: status as Booking['status'] } : b))
      setStats((prev) => {
        const old = bookings.find((b) => b.id === id)?.status
        if (!old) return prev
        return {
          ...prev,
          [old]: prev[old] - 1,
          [status]: prev[status as keyof Stats] + 1,
        }
      })
    } else {
      safeShowToast(`❌ ${data.error}`, false)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250)
    return () => clearTimeout(t)
  }, [search])

  const filtered = bookings.filter((b) => {
    const matchStatus = filter === 'all' || b.status === filter
    const q = debouncedSearch.trim().toLowerCase()
    const matchSearch = !q ||
      `${b.firstName} ${b.lastName}`.toLowerCase().includes(q) ||
      b.serviceName.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.phone.includes(q)
    return matchStatus && matchSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-rose-50/30 p-6 md:p-8">

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
      {selected && (
        <BookingModal
          booking={selected}
          onClose={() => { setSelected(null) }}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Header */}
      <header className="border-b border-rose-200/50 pb-7 mb-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="text-rose-500 text-xs uppercase tracking-[0.3em] font-semibold mb-2 block">Luxenia</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Бронювання</h1>
            <p className="text-gray-500 text-sm mt-1.5">{stats.total} всього</p>
          </div>
          <a href="/admin" className="text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors">← Адмін-панель</a>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-3 gap-3 max-w-sm">
          {[
            { key: 'pending', label: 'Очікують', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
            { key: 'confirmed', label: 'Підтверджено', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { key: 'cancelled', label: 'Скасовано', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
          ].map(({ key, label, color, bg, border }) => (
            <button
              key={key}
              onClick={() => setFilter(filter === key ? 'all' : key as typeof filter)}
              className={`${bg} rounded-2xl px-3 py-2.5 text-center transition-all border-2 hover:scale-105 ${filter === key ? `${border}` : 'border-transparent'}`}
            >
              <p className={`text-2xl font-bold ${color}`}>{stats[key as keyof Stats]}</p>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">{label}</p>
            </button>
          ))}
        </div>

        {/* Search + filter */}
        <div className="mt-5 flex gap-3 flex-wrap">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm pointer-events-none">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Пошук за іменем, послугою, email..."
              className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-2xl text-sm text-gray-700 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 bg-white placeholder:text-gray-300 w-72 transition-all"
            />
          </div>
          <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1 shadow-sm">
            {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === f ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {f === 'all' ? 'Всі' : STATUS_CONFIG[f].label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-3 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-5xl mb-4">📅</div>
          <p className="text-gray-400 text-sm font-medium">
            {search || filter !== 'all' ? 'Нічого не знайдено' : 'Бронювань ще немає'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
                <th className="text-left py-3 px-5 text-gray-600 text-xs uppercase tracking-wider font-semibold">Клієнт</th>
                <th className="text-left py-3 px-5 text-gray-600 text-xs uppercase tracking-wider font-semibold hidden md:table-cell">Послуга</th>
                <th className="text-left py-3 px-5 text-gray-600 text-xs uppercase tracking-wider font-semibold">Дата / Час</th>
                <th className="text-left py-3 px-5 text-gray-600 text-xs uppercase tracking-wider font-semibold">Статус</th>
                <th className="py-3 px-5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((b) => {
                const cfg = STATUS_CONFIG[b.status]
                return (
                  <tr
                      key={b.id}
                      tabIndex={0}
                      role="button"
                      className="hover:bg-rose-50/30 transition-colors cursor-pointer"
                      onClick={() => setSelected(b)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelected(b) }}
                    >
                    <td className="py-4 px-5">
                      <p className="font-semibold text-gray-900">{b.firstName} {b.lastName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{b.phone}</p>
                    </td>
                    <td className="py-4 px-5 hidden md:table-cell">
                      <p className="text-gray-700">{b.serviceName}</p>
                    </td>
                    <td className="py-4 px-5">
                      <p className="text-gray-900 font-medium">{formatDate(b.date)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{b.time}</p>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.color}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className="text-rose-400 text-lg">→</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400 font-medium">
            Показано {filtered.length} з {stats.total}
          </div>
        </div>
      )}
    </div>
  )
}