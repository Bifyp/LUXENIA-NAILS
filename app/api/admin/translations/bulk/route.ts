import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAccessError } from '@/lib/admin-access';
import { prisma } from '@/lib/prisma';
const safeKey = z.string().min(1).max(300).refine((value) => !value.split('.').some((part) => ['__proto__', 'prototype', 'constructor'].includes(part)));
const schema = z.object({ lang: z.enum(['en', 'ru', 'pl', 'uk']), section: safeKey, translations: z.array(z.object({ key: safeKey, value: z.string().max(100000) }).strict()).min(1).max(100) }).strict();
export async function POST(request: NextRequest) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid translations' }, { status: 400 });
  const { lang, section, translations } = parsed.data;
  if (new Set(translations.map((t) => t.key)).size !== translations.length) return NextResponse.json({ error: 'Duplicate translation keys' }, { status: 400 });
  try {
    await prisma.$transaction(translations.map(({ key, value }) => prisma.translation.upsert({ where: { lang_section_key: { lang, section, key } }, create: { lang, section, key, value }, update: { value } })));
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Save failed' }, { status: 500 }); }
}
