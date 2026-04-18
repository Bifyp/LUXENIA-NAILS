import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
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
  try {
    const body = await request.json()
    const { type, lang, subject, body: emailBody, enabled } = body

    const template = await prisma.emailTemplate.create({
      data: {
        type,
        lang,
        subject,
        body: emailBody,
        enabled: enabled ?? true,
      },
    })

    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error('Error creating email template:', error)
    return NextResponse.json({ success: false, error: 'Failed to create template' }, { status: 500 })
  }
}
