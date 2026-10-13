import { editablePackageSchema } from '@/lib/content-validations'
import { adminAccessError } from '@/lib/admin-access';
// app/api/admin/packages/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      include: { benefits: true },
      orderBy: { title: 'asc' },
    })
    return NextResponse.json({ packages })
  } catch (error) {
    console.error('[GET /api/admin/packages]', error)
    return NextResponse.json({ error: 'Помилка завантаження' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  try {
    const parsed = editablePackageSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
    const { benefits, ...fields } = parsed.data
    const data = { ...fields, benefits: { create: benefits.filter(Boolean).map((text) => ({ text })) } }

    const pkg = await prisma.package.create({
      data,
      include: { benefits: true },
    })

    return NextResponse.json({ success: true, package: pkg })
  } catch (error) {
    // Подробный лог ошибки
    console.error('[POST /api/admin/packages] FULL ERROR:', error)
    console.error('[POST /api/admin/packages] ERROR MESSAGE:', (error as Error)?.message)
    console.error('[POST /api/admin/packages] ERROR STACK:', (error as Error)?.stack)

    const message = (error as Error)?.message || 'Невідома помилка'
    return NextResponse.json({ error: 'Помилка створення' }, { status: 500 })
  }
}