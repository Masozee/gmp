import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create default event category if it doesn't exist
    const defaultCategory = await prisma.eventCategory.upsert({
      where: {
        slug: 'general'
      },
      update: {},
      create: {
        name: 'General',
        slug: 'general',
        description: 'General events category'
      }
    })

    console.log('Created default event category:', defaultCategory.name)

    // Create a test event if no events exist
    const existingEvents = await prisma.event.count()
    
    if (existingEvents === 0) {
      const startDate = new Date()
      const endDate = new Date(startDate)
      endDate.setHours(endDate.getHours() + 2)

      const testEvent = await prisma.event.create({
        data: {
          title: 'Test Event',
          slug: 'test-event',
          description: 'This is a test event',
          content: 'Test event content',
          status: 'UPCOMING',
          startDate,
          endDate,
          published: true,
          categoryId: defaultCategory.id
        }
      })

      console.log('Created test event:', testEvent.title)
    } else {
      console.log('Skipping test event creation - events already exist')
    }

    console.log('Seed completed successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 