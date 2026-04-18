'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/admin/bookings', icon: '📅', title: 'Бронювання' },
  { href: '/admin/gallery', icon: '🖼️', title: 'Галерея' },
  { href: '/admin/services', icon: '✨', title: 'Послуги' },
  { href: '/admin/packages', icon: '🎁', title: 'Пакети' },
  { href: '/admin/products', icon: '🛍️', title: 'Магазин' },
  { href: '/admin/email-templates', icon: '📧', title: 'Email шаблони' },
  { href: '/admin/translations', icon: '🌐', title: 'Переклади' },
  { href: '/admin/security', icon: '🔒', title: 'Безпека' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen p-6 hidden md:block">
      <div className="mb-10">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-1">
          Admin Panel
        </h2>
        <p className="text-xs text-gray-400">Керування сайтом</p>
      </div>

      <nav className="flex flex-col gap-1.5">
        {NAV_ITEMS.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group
                ${active
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-rose-600'
                }`}
            >
              <span className="text-lg transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
              <span className="font-medium text-sm">{item.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-8">
        <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100/50">
          <p className="text-xs font-medium text-rose-600 mb-1.5">💡 Підказка</p>
          <p className="text-xs text-gray-500 leading-relaxed">Drag & drop для швидкого завантаження</p>
        </div>
      </div>
    </aside>
  )
}
