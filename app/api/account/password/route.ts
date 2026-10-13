import { passwordSchema } from '@/lib/validations'
import { z } from 'zod'
import { withRateLimit, LIMITS } from '@/lib/rate-limiter'
// app/api/account/password/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { compare, hash } from 'bcryptjs'

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизовано' }, { status: 401 })
    }

    const limited = await withRateLimit(req, LIMITS.auth)
    if (limited) return limited
    const parsed = z.object({ currentPassword: z.string().min(1).max(1000), newPassword: passwordSchema }).safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    const { currentPassword, newPassword } = parsed.data

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Заповніть всі поля' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Пароль мінімум 6 символів' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user?.password) {
      return NextResponse.json({ error: 'Помилка' }, { status: 400 })
    }

    const isValid = await compare(currentPassword, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Невірний поточний пароль' }, { status: 400 })
    }

    const hashed = await hash(newPassword, 12)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PATCH /api/account/password]', error)
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 })
  }
}