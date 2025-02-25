import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
      profile: {
        create: {
          firstName: "Admin",
          lastName: "User",
          category: "STAFF",
        },
      },
    },
    include: {
      profile: true,
    },
  })

  console.log({ admin })

  // Create initial categories
  const categories = [
    {
      name: 'Research Papers',
      slug: 'research-papers',
      description: 'Academic research papers and studies',
    },
    {
      name: 'Policy Briefs',
      slug: 'policy-briefs',
      description: 'Policy analysis and recommendations',
    },
    {
      name: 'Reports',
      slug: 'reports',
      description: 'Detailed reports and analyses',
    },
    {
      name: 'Articles',
      slug: 'articles',
      description: 'News articles and opinion pieces',
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('Database has been seeded.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 