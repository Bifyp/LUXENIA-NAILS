import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'
import { createLogger } from '../lib/logger'

const logger = createLogger('seed')

async function main() {
  // Перевірити чи адмін уже існує
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'admin' }
  })

  if (existingAdmin) {
    logger.info('Admin user already exists')
    return
  }

  // Створити першого адміна
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password || Buffer.byteLength(password) < 12 || Buffer.byteLength(password) > 72) {
    throw new Error('Set ADMIN_EMAIL and a unique ADMIN_PASSWORD (12–72 bytes) before seeding')
  }
  const adminPassword = await hash(password, 12)
  const admin = await prisma.user.create({
    data: {
      email,
      name: 'Administrator',
      password: adminPassword,
      role: 'admin',
      emailVerified: new Date()
    }
  })

  logger.info({ adminId: admin.id }, 'Admin user created')
  console.log('Administrator created. Store credentials securely.')
}

main()
  .catch((e) => {
    logger.error(e, 'Seed failed')
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })