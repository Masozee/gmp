import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create a test event category if it doesn't exist
    const category = await prisma.eventCategory.upsert({
      where: { slug: 'test-category' },
      update: {},
      create: {
        name: 'Test Category',
        slug: 'test-category',
        description: 'A category for test events',
      },
    })

    // Create some test events
    const events = [
      {
        title: 'Today\'s Test Event',
        description: 'A test event for today',
        content: 'Test event content',
        startDate: new Date(),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        location: 'Test Location',
        venue: 'Test Venue',
        status: 'UPCOMING',
        published: true,
        categoryId: category.id,
      },
      {
        title: 'Tomorrow\'s Test Event',
        description: 'A test event for tomorrow',
        content: 'Test event content',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endDate: new Date(Date.now() + 26 * 60 * 60 * 1000), // Tomorrow + 2 hours
        location: 'Test Location',
        venue: 'Test Venue',
        status: 'UPCOMING',
        published: true,
        categoryId: category.id,
      },
      {
        title: 'Next Week\'s Test Event',
        description: 'A test event for next week',
        content: 'Test event content',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 7 days + 2 hours
        location: 'Test Location',
        venue: 'Test Venue',
        status: 'UPCOMING',
        published: true,
        categoryId: category.id,
      },
    ]

    for (const eventData of events) {
      const slug = slugify(eventData.title, { lower: true, strict: true })
      await prisma.event.upsert({
        where: { slug },
        update: eventData,
        create: {
          ...eventData,
          slug,
        },
      })
    }

    console.log('Created test events successfully')
  } catch (error) {
    console.error('Error creating test events:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 