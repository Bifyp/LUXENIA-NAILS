'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-full shadow-xl text-sm text-white font-medium ${ok ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}>
      {msg}
    </div>
  )
}

export default function AccountSettingsPage() {
  const { data: session, update } = useSession()

  const [name, setName] = useState(session?.user?.name || '')
  const [email, setEmail] = useState(session?.user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (data.success) {
        await update({ name, email })
        showToast('✅ Профіль збережено', true)
      } else {
        showToast(`❌ ${data.error || 'Помилка'}`, false)
      }
    } catch {
      showToast('❌ Помилка збереження', false)
    }
    setSavingProfile(false)
  }

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      showToast('❌ Паролі не співпадають', false)
      return
    }
    if (newPassword.length < 6) {
      showToast('❌ Пароль мінімум 6 символів', false)
      return
    }
    setSavingPassword(true)
    try {
      const res = await fetch('/api/account/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('✅ Пароль змінено', true)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        showToast(`❌ ${data.error || 'Помилка'}`, false)
      }
    } catch {
      showToast('❌ Помилка зміни пароля', false)
    }
    setSavingPassword(false)
  }

  return (
    <div className="overflow-hidden">
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* HERO */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        <div className="container relative z-10 px-6 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              Налаштування
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              Керуйте профілем
            </h1>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <div className="container pb-32 -mt-16 relative z-10 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Back link */}
          <a href="../account" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm mb-10 transition-colors font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад до кабінету
          </a>

          {/* Profile form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Особисті дані</h2>
            <form onSubmit={handleProfileSave} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Нікнейм</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше ім'я або нік"
                  className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100"
              >
                {savingProfile ? 'Збереження...' : 'Зберегти зміни'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </form>
          </div>

          {/* Password form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Зміна пароля</h2>
            <form onSubmit={handlePasswordSave} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Поточний пароль</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Новий пароль</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all outline-none"
                />
                <p className="text-gray-500 text-xs mt-1.5">Мінімум 6 символів</p>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Підтвердіть пароль</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-gray-900 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100"
              >
                {savingPassword ? 'Збереження...' : 'Змінити пароль'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
