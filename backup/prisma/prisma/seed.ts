import { PrismaClient, UserRole, UserCategory, PublicationStatus, EventStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clean up existing data
  await prisma.tagsOnPublications.deleteMany()
  await prisma.tagsOnEvents.deleteMany()
  await prisma.presentation.deleteMany()
  await prisma.eventSpeaker.deleteMany()
  await prisma.speaker.deleteMany()
  await prisma.event.deleteMany()
  await prisma.eventCategory.deleteMany()
  await prisma.image.deleteMany()
  await prisma.publicationFile.deleteMany()
  await prisma.publicationAuthor.deleteMany()
  await prisma.categoriesOnPublications.deleteMany()
  await prisma.publication.deleteMany()
  await prisma.category.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.errorLog.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()

  console.log('Cleaned up existing data')

  // Create admin user
  const adminPassword = await bcrypt.hash('password123', 12)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
    }
  })

  console.log('Created admin user:', admin.email)

  // Create admin profile
  const adminProfile = await prisma.profile.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      bio: 'System administrator',
      photoUrl: '/avatars/admin.png',
      category: UserCategory.STAFF,
    }
  })

  console.log('Created admin profile:', adminProfile.email)

  // Create test user
  const userPassword = await bcrypt.hash('password123', 12)
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Test User',
      role: UserRole.USER,
    }
  })

  console.log('Created test user:', user.email)

  // Create test profile
  const userProfile = await prisma.profile.create({
    data: {
      firstName: 'Test',
      lastName: 'User',
      email: 'user@example.com',
      bio: 'Regular user for testing',
      photoUrl: '/avatars/user.png',
      category: UserCategory.AUTHOR,
    }
  })

  console.log('Created test profile:', userProfile.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Research',
        description: 'Scientific research papers and articles',
        slug: 'research',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Technology',
        description: 'Technology related publications',
        slug: 'technology',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Medicine',
        description: 'Medical research and publications',
        slug: 'medicine',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Education',
        description: 'Educational resources and publications',
        slug: 'education',
      },
    }),
  ])

  console.log('Created categories:', categories.map(c => c.name).join(', '))

  // Create event categories
  const eventCategories = await Promise.all([
    prisma.eventCategory.create({
      data: {
        name: 'Conference',
        description: 'Academic and professional conferences',
        slug: 'conference',
      },
    }),
    prisma.eventCategory.create({
      data: {
        name: 'Workshop',
        description: 'Hands-on learning sessions',
        slug: 'workshop',
      },
    }),
    prisma.eventCategory.create({
      data: {
        name: 'Seminar',
        description: 'Educational seminars and lectures',
        slug: 'seminar',
      },
    }),
    prisma.eventCategory.create({
      data: {
        name: 'Webinar',
        description: 'Online educational events',
        slug: 'webinar',
      },
    }),
  ])

  console.log('Created event categories:', eventCategories.map(ec => ec.name).join(', '))

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({
      data: {
        name: 'AI',
        slug: 'ai',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Machine Learning',
        slug: 'machine-learning',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Healthcare',
        slug: 'healthcare',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Education',
        slug: 'education',
      },
    }),
  ])

  console.log('Created tags:', tags.map(t => t.name).join(', '))

  // Create publications
  const publications = await Promise.all([
    prisma.publication.create({
      data: {
        title: 'Advances in Machine Learning',
        description: 'This paper discusses recent advances in machine learning algorithms and their applications.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        status: PublicationStatus.PUBLISHED,
        slug: 'advances-in-machine-learning',
        categories: {
          create: {
            categoryId: categories[0].id,
          }
        },
        tags: {
          create: {
            tagId: tags[1].id,
          }
        }
      },
    }),
    prisma.publication.create({
      data: {
        title: 'The Future of Quantum Computing',
        description: 'An overview of quantum computing technology and its potential future applications.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        status: PublicationStatus.PUBLISHED,
        slug: 'future-of-quantum-computing',
        categories: {
          create: {
            categoryId: categories[1].id,
          }
        },
        tags: {
          create: {
            tagId: tags[0].id,
          }
        }
      },
    }),
    prisma.publication.create({
      data: {
        title: 'Breakthrough in Cancer Research',
        description: 'Recent breakthrough in cancer treatment research shows promising results.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        status: PublicationStatus.PUBLISHED,
        slug: 'breakthrough-in-cancer-research',
        categories: {
          create: {
            categoryId: categories[2].id,
          }
        },
        tags: {
          create: {
            tagId: tags[2].id,
          }
        }
      },
    }),
    prisma.publication.create({
      data: {
        title: 'Modern Educational Methods',
        description: 'A study on modern educational methods and their effectiveness in different learning environments.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        status: PublicationStatus.DRAFT,
        slug: 'modern-educational-methods',
        categories: {
          create: {
            categoryId: categories[3].id,
          }
        },
        tags: {
          create: {
            tagId: tags[3].id,
          }
        }
      },
    }),
  ])

  console.log('Created publications:', publications.map(p => p.title).join(', '))

  // Add authors to publications
  await Promise.all([
    prisma.publicationAuthor.create({
      data: {
        publicationId: publications[0].id,
        profileId: adminProfile.id,
        order: 1,
      }
    }),
    prisma.publicationAuthor.create({
      data: {
        publicationId: publications[1].id,
        profileId: adminProfile.id,
        order: 1,
      }
    }),
    prisma.publicationAuthor.create({
      data: {
        publicationId: publications[2].id,
        profileId: userProfile.id,
        order: 1,
      }
    }),
    prisma.publicationAuthor.create({
      data: {
        publicationId: publications[3].id,
        profileId: userProfile.id,
        order: 1,
      }
    }),
  ])

  console.log('Added authors to publications')

  // Create speakers
  const speakers = await Promise.all([
    prisma.speaker.create({
      data: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        organization: 'University of Technology',
        position: 'Professor',
        bio: 'Expert in machine learning and AI',
        photoUrl: '/avatars/speaker1.png',
      }
    }),
    prisma.speaker.create({
      data: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        organization: 'Research Institute',
        position: 'Senior Researcher',
        bio: 'Specializes in quantum computing',
        photoUrl: '/avatars/speaker2.png',
      }
    }),
  ])

  console.log('Created speakers:', speakers.map(s => `${s.firstName} ${s.lastName}`).join(', '))

  // Create events
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)
  
  const lastWeek = new Date(now)
  lastWeek.setDate(lastWeek.getDate() - 7)
  
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Annual Research Conference',
        description: 'Join us for our annual research conference featuring keynote speakers and research presentations.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        location: 'University Conference Center',
        startDate: tomorrow,
        endDate: nextWeek,
        status: EventStatus.UPCOMING,
        published: true,
        slug: 'annual-research-conference',
        categoryId: eventCategories[0].id,
        tags: {
          create: {
            tagId: tags[0].id,
          }
        }
      },
    }),
    prisma.event.create({
      data: {
        title: 'Machine Learning Workshop',
        description: 'Hands-on workshop on machine learning techniques and applications.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        location: 'Tech Hub',
        startDate: now,
        endDate: tomorrow,
        status: EventStatus.ONGOING,
        published: true,
        slug: 'machine-learning-workshop',
        categoryId: eventCategories[1].id,
        tags: {
          create: {
            tagId: tags[1].id,
          }
        }
      },
    }),
    prisma.event.create({
      data: {
        title: 'Medical Research Seminar',
        description: 'Seminar on recent advances in medical research.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        location: 'Medical School Auditorium',
        startDate: lastWeek,
        endDate: yesterday,
        status: EventStatus.COMPLETED,
        published: true,
        slug: 'medical-research-seminar',
        categoryId: eventCategories[2].id,
        tags: {
          create: {
            tagId: tags[2].id,
          }
        }
      },
    }),
    prisma.event.create({
      data: {
        title: 'Educational Technology Webinar',
        description: 'Online webinar discussing the latest in educational technology.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        location: 'Online',
        startDate: nextWeek,
        endDate: new Date(nextWeek.getTime() + 2 * 60 * 60 * 1000), // 2 hours after start
        status: EventStatus.UPCOMING,
        published: true,
        slug: 'educational-technology-webinar',
        categoryId: eventCategories[3].id,
        tags: {
          create: {
            tagId: tags[3].id,
          }
        }
      },
    }),
  ])

  console.log('Created events:', events.map(e => e.title).join(', '))

  // Add speakers to events
  await Promise.all([
    prisma.eventSpeaker.create({
      data: {
        eventId: events[0].id,
        speakerId: speakers[0].id,
        order: 1,
        role: 'Keynote Speaker',
      }
    }),
    prisma.eventSpeaker.create({
      data: {
        eventId: events[1].id,
        speakerId: speakers[1].id,
        order: 1,
        role: 'Workshop Leader',
      }
    }),
    prisma.eventSpeaker.create({
      data: {
        eventId: events[2].id,
        speakerId: speakers[0].id,
        order: 1,
        role: 'Speaker',
      }
    }),
    prisma.eventSpeaker.create({
      data: {
        eventId: events[3].id,
        speakerId: speakers[1].id,
        order: 1,
        role: 'Host',
      }
    }),
  ])

  console.log('Added speakers to events')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 