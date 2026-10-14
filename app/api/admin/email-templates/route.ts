import { editableEmailTemplateSchema } from '@/lib/content-validations'
import { adminAccessError } from '@/lib/admin-access';
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: [{ type: 'asc' }, { lang: 'asc' }],
    })
    return NextResponse.json({ success: true, templates })
  } catch (error) {
    console.error('Error fetching email templates:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch templates' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  try {
    const parsed = editableEmailTemplateSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'Invalid template' }, { status: 400 })
    const template = await prisma.emailTemplate.create({ data: parsed.data })

    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error('Error creating email template:', error)
    return NextResponse.json({ success: false, error: 'Failed to create template' }, { status: 500 })
  }
}
