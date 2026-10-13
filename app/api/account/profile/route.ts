import { emailSchema } from '@/lib/validations'
import { z } from 'zod'
// app/api/account/profile/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизовано' }, { status: 401 })
    }

    const parsed = z.object({ name: z.string().trim().max(100), email: emailSchema }).safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    const { name, email } = parsed.data

    if (!email) {
      return NextResponse.json({ error: 'Email обовʼязковий' }, { status: 400 })
    }

    const current = await prisma.user.findUnique({ where: { id: session.user.id }, select: { email: true } })
    if (!current) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // An unverified email change would bypass signup verification.
    if (current.email !== email) return NextResponse.json({ error: 'Email change requires verification; contact the studio' }, { status: 400 })

    // Перевірка чи email вже зайнятий іншим користувачем
    const existing = await prisma.user.findFirst({
      where: { email, id: { not: session.user.id } },
    })
    if (existing) {
      return NextResponse.json({ error: 'Цей email вже використовується' }, { status: 409 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name || null, email },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PATCH /api/account/profile]', error)
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 })
  }
}