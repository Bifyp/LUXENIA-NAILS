import { editableServiceSchema } from '@/lib/content-validations'
import { adminAccessError } from '@/lib/admin-access';
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  try {
    const { id } = await params
    const parsed = editableServiceSchema.partial().safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'Invalid service' }, { status: 400 })
    const service = await prisma.service.update({ where: { id }, data: parsed.data })

    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error('[PATCH /api/admin/services/:id]', error)
    return NextResponse.json({ error: 'Помилка оновлення' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  try {
    const { id } = await params
    await prisma.service.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/services/:id]', error)
    return NextResponse.json({ error: 'Помилка видалення' }, { status: 500 })
  }
}