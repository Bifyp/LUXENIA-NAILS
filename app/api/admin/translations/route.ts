import { z } from 'zod'
import { adminAccessError } from '@/lib/admin-access';
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  try {
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') || 'en'

    const translations = await prisma.translation.findMany({
      where: { lang },
      select: { section: true, key: true, value: true },
      orderBy: [{ section: 'asc' }, { key: 'asc' }],
    })

    const sections: Record<string, Record<string, string>> = {}
    for (const { section, key, value } of translations) {
      if (!sections[section]) sections[section] = {}
      sections[section][key] = value
    }

    return NextResponse.json({ sections })
  } catch (error) {
    console.error('[GET /api/admin/translations]', error)
    return NextResponse.json({ error: 'Ошибка загрузки переводов' }, { status: 500 })
  }
}

const DEEPL_LANG_MAP: Record<string, string> = { ru: 'RU', pl: 'PL', uk: 'UK' }
const TARGET_LANGUAGES = ['ru', 'pl', 'uk'] as const

async function translateWithDeepL(text: string, targetLang: string): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) throw new Error('DEEPL_API_KEY не задан в .env')
  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    signal: AbortSignal.timeout(10000),
    headers: { Authorization: `DeepL-Auth-Key ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: [text], source_lang: 'EN', target_lang: DEEPL_LANG_MAP[targetLang] }),
  })
  if (!response.ok) throw new Error(`DeepL API error [${response.status}]: ${await response.text()}`)
  const data = await response.json()
  return data.translations[0].text
}

const editSchema = z.object({ section: z.string().min(1).max(100).refine((v) => !['__proto__', 'prototype', 'constructor'].includes(v)), key: z.string().min(1).max(300).refine((v) => !v.split('.').some((k) => ['__proto__', 'prototype', 'constructor'].includes(k))), value: z.string().max(100000), sourceLang: z.enum(['en', 'ru', 'pl', 'uk']).default('en') })

export async function PATCH(request: NextRequest) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  try {
    const input = editSchema.safeParse(await request.json().catch(() => null))
    if (!input.success) return NextResponse.json({ error: 'Invalid translation' }, { status: 400 })
    const { section, key, value } = input.data
    if (!section || !key || value === undefined || value === null)
      return NextResponse.json({ error: 'Обязательные поля: section, key, value' }, { status: 400 })
    if (typeof value !== 'string')
      return NextResponse.json({ error: 'value должен быть строкой' }, { status: 400 })

    await prisma.translation.upsert({
      where: { lang_section_key: { lang: 'en', section, key } },
      update: { value }, create: { lang: 'en', section, key, value },
    })

    const translationResults: Record<string, string | null> = {}
    const errors: Record<string, string> = {}
    const isJsonValue = value.trimStart().startsWith('[') || value.trimStart().startsWith('{')

    if (isJsonValue) {
      for (const lang of TARGET_LANGUAGES) {
        try {
          const parsed = JSON.parse(value)
          if (Array.isArray(parsed) && parsed.every((i) => typeof i === 'string')) {
            const translatedItems = await Promise.all(parsed.map((item) => translateWithDeepL(item, lang)))
            const translatedValue = JSON.stringify(translatedItems)
            await prisma.translation.upsert({
              where: { lang_section_key: { lang, section, key } },
              update: { value: translatedValue }, create: { lang, section, key, value: translatedValue },
            })
            translationResults[lang] = translatedValue
          } else {
            await prisma.translation.upsert({
              where: { lang_section_key: { lang, section, key } },
              update: { value }, create: { lang, section, key, value },
            })
            translationResults[lang] = value
          }
        } catch { errors[lang] = 'Не удалось обработать JSON'; translationResults[lang] = null }
      }
    } else {
      await Promise.allSettled(TARGET_LANGUAGES.map(async (lang) => {
        try {
          const translated = await translateWithDeepL(value, lang)
          await prisma.translation.upsert({
            where: { lang_section_key: { lang, section, key } },
            update: { value: translated }, create: { lang, section, key, value: translated },
          })
          translationResults[lang] = translated
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Неизвестная ошибка'
          errors[lang] = message; translationResults[lang] = null
        }
      }))
    }


    return NextResponse.json({ success: true, section, key, en: value, translations: translationResults, ...(Object.keys(errors).length > 0 && { errors }) })
  } catch (error) {
    console.error('[PATCH /api/admin/translations]', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}