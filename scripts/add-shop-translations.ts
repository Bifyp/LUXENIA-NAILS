import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const translations = [
    { lang: 'uk', section: 'Header', key: 'shop', value: 'Магазин' },
    { lang: 'ru', section: 'Header', key: 'shop', value: 'Магазин' },
    { lang: 'en', section: 'Header', key: 'shop', value: 'Shop' },
    { lang: 'pl', section: 'Header', key: 'shop', value: 'Sklep' },
  ]

  for (const t of translations) {
    await prisma.translation.upsert({
      where: {
        lang_section_key: {
          lang: t.lang,
          section: t.section,
          key: t.key,
        },
      },
      update: { value: t.value },
      create: t,
    })
    console.log(`✅ Added: ${t.lang} - ${t.section}.${t.key} = ${t.value}`)
  }

  console.log('\n✨ Done!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
