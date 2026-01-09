import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing posts
  await prisma.post.deleteMany({})
  console.log('✅ Cleared existing posts')

  // Create sample posts
  const posts = await prisma.post.createMany({
    data: [
      {
        title: 'Welcome to Next.js',
        content: 'This is your first post in the Next.js application with Prisma and SQLite. Everything is working perfectly!',
        published: true,
      },
      {
        title: 'Getting Started with Prisma',
        content: 'Prisma is a modern database toolkit that makes database access easy and type-safe. It works seamlessly with Next.js and SQLite.',
        published: true,
      },
      {
        title: 'TypeScript in Next.js',
        content: 'TypeScript provides static type checking and better developer experience. Combined with Prisma, you get end-to-end type safety.',
        published: true,
      },
      {
        title: 'Draft Post',
        content: 'This is a draft post that has not been published yet.',
        published: false,
      },
      {
        title: 'Building Modern Web Apps',
        content: 'Next.js, TypeScript, Prisma, and Tailwind CSS make a powerful stack for building modern web applications with great developer experience.',
        published: true,
      },
    ],
  })

  console.log(`✅ Created ${posts.count} posts`)
  console.log('🎉 Seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
