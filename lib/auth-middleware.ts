import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { createLogger } from './logger'

const logger = createLogger('auth-middleware')

export async function requireAuth(req: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    logger.warn({ path: req.nextUrl.pathname }, 'Unauthorized access attempt')
    return null
  }

  return session
}

export async function requireAdminAuth(req: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    logger.warn({ path: req.nextUrl.pathname }, 'Unauthorized access')
    return null
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  const role = user?.role ?? 'user'
  if (role !== 'admin') {
    logger.warn({ email: session.user.email }, 'Non-admin access attempt')
    return null
  }

  return session
}

export function checkAdminAuth(session: { user?: { role?: string } } | null | undefined): boolean {
  const role = session?.user?.role ?? 'user'
  return role === 'admin'
}