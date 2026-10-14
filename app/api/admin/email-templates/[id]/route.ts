import { editableEmailTemplateSchema } from '@/lib/content-validations'
import { adminAccessError } from '@/lib/admin-access';
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  try {
    const { id } = await params
    const parsed = editableEmailTemplateSchema.pick({ subject: true, body: true, enabled: true }).partial().safeParse(await request.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'Invalid template' }, { status: 400 })
    const template = await prisma.emailTemplate.update({ where: { id }, data: parsed.data })

    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error('Error updating email template:', error)
    return NextResponse.json({ success: false, error: 'Failed to update template' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  try {
    const { id } = await params
    await prisma.emailTemplate.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting email template:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete template' }, { status: 500 })
  }
}
