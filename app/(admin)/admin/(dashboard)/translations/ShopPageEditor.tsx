'use client'

import { useState, useEffect } from 'react'

export default function ShopPageEditor() {
  const [lang, setLang] = useState('uk')
  const [data, setData] = useState({
    hero: { title: '', subtitle: '', description: '' },
    empty: { title: '', subtitle: '' },
    filters: { all: '' },
    product: { order: '', inStock: '', outOfStock: '', featured: '' },
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadTranslations()
  }, [lang])

  async function loadTranslations() {
    const res = await fetch(`/api/admin/translations?lang=${lang}&section=ShopPage`)
    const json = await res.json()
    if (json.translations) {
      const obj: any = { hero: {}, empty: {}, filters: {}, product: {} }
      json.translations.forEach((t: any) => {
        const parts = t.key.split('.')
        if (parts.length === 2) {
          obj[parts[0]][parts[1]] = t.value
        }
      })
      setData(obj)
    }
  }

  async function handleSave() {
    setSaving(true)
    const translations = [
      { key: 'hero.title', value: data.hero.title },
      { key: 'hero.subtitle', value: data.hero.subtitle },
      { key: 'hero.description', value: data.hero.description },
      { key: 'empty.title', value: data.empty.title },
      { key: 'empty.subtitle', value: data.empty.subtitle },
      { key: 'filters.all', value: data.filters.all },
      { key: 'product.order', value: data.product.order },
      { key: 'product.inStock', value: data.product.inStock },
      { key: 'product.outOfStock', value: data.product.outOfStock },
      { key: 'product.featured', value: data.product.featured },
    ]

    await fetch('/api/admin/translations/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang, section: 'ShopPage', translations }),
    })

    setSaving(false)
    alert('Збережено!')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Магазин</h2>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="border-2 border-gray-200 rounded-xl px-4 py-2"
        >
          <option value="uk">🇺🇦 Українська</option>
          <option value="ru">🇷🇺 Русский</option>
          <option value="en">🇬🇧 English</option>
          <option value="pl">🇵🇱 Polski</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
        <h3 className="text-lg font-bold text-gray-800">Hero секція</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
          <input
            type="text"
            value={data.hero.title}
            onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Підзаголовок</label>
          <input
            type="text"
            value={data.hero.subtitle}
            onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Опис</label>
          <textarea
            rows={2}
            value={data.hero.description}
            onChange={(e) => setData({ ...data, hero: { ...data.hero, description: e.target.value } })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
        <h3 className="text-lg font-bold text-gray-800">Порожній стан</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
          <input
            type="text"
            value={data.empty.title}
            onChange={(e) => setData({ ...data, empty: { ...data.empty, title: e.target.value } })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Підзаголовок</label>
          <input
            type="text"
            value={data.empty.subtitle}
            onChange={(e) => setData({ ...data, empty: { ...data.empty, subtitle: e.target.value } })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
        <h3 className="text-lg font-bold text-gray-800">Фільтри та товари</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Всі категорії</label>
          <input
            type="text"
            value={data.filters.all}
            onChange={(e) => setData({ ...data, filters: { ...data.filters, all: e.target.value } })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">В наявності</label>
          <input
            type="text"
            value={data.product.inStock}
            onChange={(e) => setData({ ...data, product: { ...data.product, inStock: e.target.value } })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Немає в наявності</label>
          <input
            type="text"
            value={data.product.outOfStock}
            onChange={(e) => setData({ ...data, product: { ...data.product, outOfStock: e.target.value } })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Хіт продажів</label>
          <input
            type="text"
            value={data.product.featured}
            onChange={(e) => setData({ ...data, product: { ...data.product, featured: e.target.value } })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Кнопка "Замовити"</label>
          <input
            type="text"
            value={data.product.order}
            onChange={(e) => setData({ ...data, product: { ...data.product, order: e.target.value } })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
      >
        {saving ? 'Збереження...' : 'Зберегти'}
      </button>
    </div>
  )
}
