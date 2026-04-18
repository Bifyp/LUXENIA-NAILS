'use client'

import { useState, useEffect } from 'react'

type EmailTemplate = {
  id: string
  type: string
  lang: string
  subject: string
  body: string
  enabled: boolean
}

const TEMPLATE_TYPES = [
  { value: 'welcome', label: 'Вітальний лист', icon: '👋' },
  { value: 'booking-confirmation', label: 'Підтвердження бронювання', icon: '✅' },
  { value: 'booking-reminder', label: 'Нагадування про бронювання', icon: '⏰' },
  { value: 'password-reset', label: 'Скидання пароля', icon: '🔑' },
]

const LANGUAGES = [
  { value: 'uk', label: '🇺🇦 Українська' },
  { value: 'ru', label: '🇷🇺 Русский' },
  { value: 'pl', label: '🇵🇱 Polski' },
  { value: 'en', label: '🇬🇧 English' },
]

const VARIABLES = [
  { var: '{{name}}', desc: "Ім'я користувача" },
  { var: '{{email}}', desc: 'Email користувача' },
  { var: '{{link}}', desc: 'Посилання (для підтвердження/скидання)' },
  { var: '{{date}}', desc: 'Дата бронювання' },
  { var: '{{time}}', desc: 'Час бронювання' },
  { var: '{{service}}', desc: 'Назва послуги' },
]

const DEFAULT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); padding: 40px 20px;">
  <div style="background: white; border-radius: 24px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #f43f5e; font-size: 48px; margin: 0; font-weight: bold;">LUXENIA</h1>
      <p style="color: #ec4899; margin: 10px 0 0 0;">Професійний догляд за нігтями</p>
    </div>

    <div style="color: #374151; line-height: 1.6;">
      <p style="font-size: 18px; margin-bottom: 20px;">Привіт, <strong>{{name}}</strong>!</p>

      <p style="margin-bottom: 20px;">Ваш текст тут...</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="{{link}}" style="display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; box-shadow: 0 4px 15px rgba(244, 63, 94, 0.4);">
          Перейти
        </a>
      </div>

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        З повагою,<br>
        Команда Luxenia
      </p>
    </div>
  </div>
</div>
`.trim()

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const [form, setForm] = useState({
    type: 'welcome',
    lang: 'uk',
    subject: '',
    body: DEFAULT_TEMPLATE,
    enabled: true,
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    setLoading(true)
    const res = await fetch('/api/admin/email-templates')
    const data = await res.json()
    if (data.success) setTemplates(data.templates)
    setLoading(false)
  }

  async function handleSave() {
    const url = selectedTemplate
      ? `/api/admin/email-templates/${selectedTemplate.id}`
      : '/api/admin/email-templates'

    const res = await fetch(url, {
      method: selectedTemplate ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (data.success) {
      await loadTemplates()
      setIsEditing(false)
      setSelectedTemplate(null)
      setForm({ type: 'welcome', lang: 'uk', subject: '', body: DEFAULT_TEMPLATE, enabled: true })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Видалити цей шаблон?')) return

    const res = await fetch(`/api/admin/email-templates/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) await loadTemplates()
  }

  function handleEdit(template: EmailTemplate) {
    setSelectedTemplate(template)
    setForm({
      type: template.type,
      lang: template.lang,
      subject: template.subject,
      body: template.body,
      enabled: template.enabled,
    })
    setIsEditing(true)
  }

  function insertVariable(variable: string) {
    setForm(prev => ({ ...prev, body: prev.body + ' ' + variable }))
  }

  const groupedTemplates = templates.reduce((acc, t) => {
    if (!acc[t.type]) acc[t.type] = []
    acc[t.type].push(t)
    return acc
  }, {} as Record<string, EmailTemplate[]>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-rose-50/30 p-6 md:p-8">

      {/* Header */}
      <header className="border-b border-rose-200/50 pb-7 mb-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="text-rose-500 text-xs uppercase tracking-[0.3em] font-semibold mb-2 block">Luxenia</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Email Шаблони</h1>
            <p className="text-gray-500 text-sm mt-1.5">Конструктор листів для клієнтів</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-sm text-rose-500 hover:text-rose-600 transition-colors font-medium">← Адмін-панель</a>
            <button
              onClick={() => {
                setIsEditing(true)
                setSelectedTemplate(null)
                setForm({ type: 'welcome', lang: 'uk', subject: '', body: DEFAULT_TEMPLATE, enabled: true })
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              <span className="text-base leading-none">+</span> Новий шаблон
            </button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-3 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Список шаблонів */}
          <div className="lg:col-span-1 space-y-4">
            {TEMPLATE_TYPES.map(type => (
              <div key={type.value} className="bg-white rounded-3xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">{type.icon}</span>
                  {type.label}
                </h3>
                <div className="space-y-2">
                  {groupedTemplates[type.value]?.map(template => (
                    <div key={template.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {LANGUAGES.find(l => l.value === template.lang)?.label}
                        </span>
                        {!template.enabled && <span className="text-xs text-gray-400">(вимкнено)</span>}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(template)}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center text-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(template.id)}
                          className="w-8 h-8 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 flex items-center justify-center text-sm"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  )) || <p className="text-gray-400 text-sm">Немає шаблонів</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Редактор */}
          {isEditing && (
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {selectedTemplate ? 'Редагувати шаблон' : 'Новий шаблон'}
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Тип листа</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      disabled={!!selectedTemplate}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none"
                    >
                      {TEMPLATE_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Мова</label>
                    <select
                      value={form.lang}
                      onChange={(e) => setForm({ ...form, lang: e.target.value })}
                      disabled={!!selectedTemplate}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none"
                    >
                      {LANGUAGES.map(l => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Тема листа</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Наприклад: Підтвердження бронювання в Luxenia"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Змінні (клікніть щоб вставити)</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {VARIABLES.map(v => (
                      <button
                        key={v.var}
                        onClick={() => insertVariable(v.var)}
                        className="px-3 py-1.5 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 rounded-lg text-xs font-medium hover:shadow-md transition-all"
                        title={v.desc}
                      >
                        {v.var}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">HTML код листа</label>
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    rows={16}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none font-mono text-sm"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.enabled}
                    onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                    className="w-5 h-5 accent-rose-500"
                  />
                  <label className="text-sm text-gray-700">Шаблон активний</label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    💾 Зберегти
                  </button>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    👁 {showPreview ? 'Сховати' : 'Попередній перегляд'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setSelectedTemplate(null)
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    ✕ Скасувати
                  </button>
                </div>

                {showPreview && (
                  <div className="mt-6 p-6 bg-gray-50 rounded-2xl">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">Попередній перегляд:</h3>
                    <div className="bg-white rounded-xl p-4 shadow-inner">
                      <div dangerouslySetInnerHTML={{ __html: form.body }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isEditing && (
            <div className="lg:col-span-2 flex items-center justify-center bg-white rounded-3xl p-12 shadow-lg">
              <div className="text-center">
                <div className="text-6xl mb-4">📧</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Виберіть шаблон для редагування</h3>
                <p className="text-gray-500">або створіть новий шаблон</p>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
