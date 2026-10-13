import { editableServiceSchema } from '@/lib/content-validations'
import { adminAccessError } from '@/lib/admin-access';
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.service.findMany()
    return NextResponse.json({ services })
  } catch (error) {
    console.error('[GET /api/admin/services]', error)
    return NextResponse.json({ error: 'Помилка завантаження' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  try {
    const parsed = editableServiceSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'Invalid service' }, { status: 400 })
    const service = await prisma.service.create({ data: parsed.data })
    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error('[POST /api/admin/services]', error)
    return NextResponse.json({ error: 'Помилка створення' }, { status: 500 })
  }
}