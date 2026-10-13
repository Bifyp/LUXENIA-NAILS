import { z } from 'zod'
import { adminAccessError } from '@/lib/admin-access';
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
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
    return NextResponse.json({ error: 'Помилка завантаження перекладів' }, { status: 500 })
  }
}

// ─── DeepL ───────────────────────────────────────────────────────────────────

const DEEPL_LANG_MAP: Record<string, string> = {
  en: 'EN', ru: 'RU', pl: 'PL', uk: 'UK',
}

async function translateWithDeepL(text: string, sourceLang: string, targetLang: string): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) throw new Error('DEEPL_API_KEY не задан в .env')

  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    signal: AbortSignal.timeout(10000),
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      source_lang: DEEPL_LANG_MAP[sourceLang] || 'EN',
      target_lang: DEEPL_LANG_MAP[targetLang],
    }),
  })

  if (!response.ok) throw new Error(`DeepL error [${response.status}]: ${await response.text()}`)
  const data = await response.json()
  return data.translations[0].text
}

// ─── PATCH ────────────────────────────────────────────────────────────────────

const editSchema = z.object({ section: z.string().min(1).max(100).refine((v) => !['__proto__', 'prototype', 'constructor'].includes(v)), key: z.string().min(1).max(300).refine((v) => !v.split('.').some((k) => ['__proto__', 'prototype', 'constructor'].includes(k))), value: z.string().max(100000), sourceLang: z.enum(['en', 'ru', 'pl', 'uk']).default('en') })

export async function PATCH(request: NextRequest) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  try {
    const input = editSchema.safeParse(await request.json().catch(() => null))
    if (!input.success) return NextResponse.json({ error: 'Invalid translation' }, { status: 400 })
    const { section, key, value, sourceLang } = input.data

    if (!section || !key || value === undefined || value === null)
      return NextResponse.json({ error: 'Обов\'язкові поля: section, key, value' }, { status: 400 })
    if (typeof value !== 'string')
      return NextResponse.json({ error: 'value має бути рядком' }, { status: 400 })

    // Всі мови крім sourceLang
    const ALL_LANGS = ['en', 'ru', 'pl', 'uk']
    const targetLangs = ALL_LANGS.filter((l) => l !== sourceLang)

    // Зберігаємо sourceLang як є
    await prisma.translation.upsert({
      where: { lang_section_key: { lang: sourceLang, section, key } },
      update: { value },
      create: { lang: sourceLang, section, key, value },
    })

    const translationResults: Record<string, string | null> = { [sourceLang]: value }
    const errors: Record<string, string> = {}
    const isJsonArray = value.trimStart().startsWith('[')

    for (const lang of targetLangs) {
      try {
        let translatedValue: string

        if (isJsonArray) {
          const parsed = JSON.parse(value)
          if (Array.isArray(parsed) && parsed.every((i) => typeof i === 'string')) {
            const items = await Promise.all(parsed.map((item) => translateWithDeepL(item, sourceLang, lang)))
            translatedValue = JSON.stringify(items)
          } else {
            translatedValue = value
          }
        } else {
          translatedValue = await translateWithDeepL(value, sourceLang, lang)
        }

        await prisma.translation.upsert({
          where: { lang_section_key: { lang, section, key } },
          update: { value: translatedValue },
          create: { lang, section, key, value: translatedValue },
        })
        translationResults[lang] = translatedValue
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Невідома помилка'
        errors[lang] = message
        translationResults[lang] = null
        console.error(`[DeepL] Помилка перекладу на ${lang}:`, message)
      }
    }


    return NextResponse.json({
      success: true,
      section,
      key,
      sourceLang,
      translations: translationResults,
      ...(Object.keys(errors).length > 0 && { errors }),
    })
  } catch (error) {
    console.error('[PATCH /api/admin/translations]', error)
    return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 })
  }
}
