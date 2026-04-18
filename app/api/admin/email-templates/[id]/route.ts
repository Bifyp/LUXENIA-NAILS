import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { subject, body: emailBody, enabled } = body

    const template = await prisma.emailTemplate.update({
      where: { id: params.id },
      data: {
        subject,
        body: emailBody,
        enabled,
      },
    })

    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error('Error updating email template:', error)
    return NextResponse.json({ success: false, error: 'Failed to update template' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.emailTemplate.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting email template:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete template' }, { status: 500 })
  }
}
