import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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

  console.log('Categories have been seeded.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 