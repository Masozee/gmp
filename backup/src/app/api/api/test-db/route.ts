import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const results: Record<string, any> = {
      status: 'success',
      dbConnected: true,
      created: {}
    }
    
    // 1. Create test user if needed
    const userCount = await prisma.user.count()
    
    if (userCount === 0) {
      const testEmail = 'test@example.com'
      const testPassword = 'password123'
      const hashedPassword = await bcrypt.hash(testPassword, 12)
      
      // Create user
      const testUser = await prisma.user.create({
        data: {
          email: testEmail,
          password: hashedPassword,
          name: 'Test User',
          role: 'ADMIN'
        }
      })
      
      // Create profile
      const testProfile = await prisma.profile.create({
        data: {
          firstName: 'Test',
          lastName: 'User',
          email: testEmail,
          category: 'STAFF',
          photoUrl: 'https://i.pravatar.cc/300'
        }
      })
      
      results.created.user = { id: testUser.id, email: testUser.email }
      results.created.profile = { id: testProfile.id, name: `${testProfile.firstName} ${testProfile.lastName}` }
    }
    
    // 2. Create event categories if needed
    const categoryCount = await prisma.eventCategory.count()
    
    if (categoryCount === 0) {
      const categories = [
        { name: 'Conference', slug: 'conference', description: 'Academic conferences and symposiums' },
        { name: 'Workshop', slug: 'workshop', description: 'Practical workshops and training sessions' },
        { name: 'Seminar', slug: 'seminar', description: 'Educational seminars and webinars' }
      ]
      
      const createdCategories = await Promise.all(
        categories.map(category => 
          prisma.eventCategory.create({ data: category })
        )
      )
      
      results.created.eventCategories = createdCategories.map(c => ({ id: c.id, name: c.name }))
    }
    
    // 3. Create events if needed
    const eventCount = await prisma.event.count()
    
    if (eventCount === 0) {
      // Get a category or create one if none exist
      let category = await prisma.eventCategory.findFirst()
      
      if (!category) {
        category = await prisma.eventCategory.create({
          data: {
            name: 'General',
            slug: 'general',
            description: 'General events'
          }
        })
      }
      
      // Create events
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const nextWeek = new Date(now)
      nextWeek.setDate(nextWeek.getDate() + 7)
      
      const lastWeek = new Date(now)
      lastWeek.setDate(lastWeek.getDate() - 7)
      
      const events = [
        {
          title: 'Upcoming Research Conference',
          slug: 'upcoming-research-conference',
          description: 'Join us for our annual research conference',
          content: 'Detailed information about the upcoming research conference.',
          status: 'UPCOMING',
          startDate: nextWeek,
          endDate: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
          location: 'University Main Campus',
          venue: 'Conference Hall',
          published: true,
          categoryId: category.id
        },
        {
          title: 'Ongoing Workshop Series',
          slug: 'ongoing-workshop-series',
          description: 'Practical workshops for researchers',
          content: 'Learn practical research skills in our workshop series.',
          status: 'ONGOING',
          startDate: lastWeek,
          endDate: nextWeek,
          location: 'Research Center',
          venue: 'Training Room B',
          published: true,
          categoryId: category.id
        },
        {
          title: 'Completed Symposium',
          slug: 'completed-symposium',
          description: 'Annual science symposium (completed)',
          content: 'Recap of our annual science symposium.',
          status: 'COMPLETED',
          startDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
          endDate: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
          location: 'Science Building',
          venue: 'Auditorium',
          published: true,
          categoryId: category.id
        }
      ]
      
      const createdEvents = await Promise.all(
        events.map(event => 
          prisma.event.create({ data: event })
        )
      )
      
      results.created.events = createdEvents.map(e => ({ id: e.id, title: e.title }))
    }
    
    // 4. Create authors/profiles if needed
    const profileCount = await prisma.profile.count()
    
    if (profileCount <= 1) { // Only the admin profile exists
      const profiles = [
        { 
          firstName: 'Jane', 
          lastName: 'Smith', 
          email: 'jane.smith@example.com',
          organization: 'University of Science',
          bio: 'Professor of Anthropology with 15 years of research experience',
          category: 'AUTHOR',
          photoUrl: 'https://i.pravatar.cc/300?img=5'
        },
        { 
          firstName: 'John', 
          lastName: 'Doe', 
          email: 'john.doe@example.com',
          organization: 'Research Institute',
          bio: 'Leading researcher in environmental sciences',
          category: 'RESEARCHER',
          photoUrl: 'https://i.pravatar.cc/300?img=12'
        },
        { 
          firstName: 'Alice', 
          lastName: 'Johnson', 
          email: 'alice.johnson@example.com',
          organization: 'Science Academy',
          bio: 'Specializes in quantum physics and theoretical mathematics',
          category: 'BOARD',
          photoUrl: 'https://i.pravatar.cc/300?img=20'
        }
      ]
      
      const createdProfiles = await Promise.all(
        profiles.map(profile => 
          prisma.profile.upsert({
            where: { email: profile.email },
            update: {},
            create: profile
          })
        )
      )
      
      results.created.profiles = createdProfiles.map(p => ({ id: p.id, name: `${p.firstName} ${p.lastName}` }))
    }
    
    // 5. Create publications if needed
    const publicationCount = await prisma.publication.count()
    
    if (publicationCount === 0) {
      // Get some authors or create if none exist
      const authors = await prisma.profile.findMany({
        where: { category: 'AUTHOR' },
        take: 2
      })
      
      // Create a category if none exists
      let category = await prisma.category.findFirst()
      
      if (!category) {
        category = await prisma.category.create({
          data: {
            name: 'Research',
            slug: 'research',
            description: 'Research publications'
          }
        })
      }
      
      // Create publications
      const publications = [
        {
          title: 'Advances in Environmental Research',
          slug: 'advances-in-environmental-research',
          description: 'A comprehensive study on environmental factors affecting biodiversity',
          content: 'Detailed content about environmental research findings...',
          status: 'PUBLISHED',
          coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop'
        },
        {
          title: 'Modern Approaches to Data Analysis',
          slug: 'modern-approaches-to-data-analysis',
          description: 'New methodologies for analyzing complex datasets',
          content: 'In-depth exploration of data analysis techniques...',
          status: 'PUBLISHED',
          coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop'
        }
      ]
      
      const createdPublications = []
      
      for (const pub of publications) {
        const publication = await prisma.publication.create({
          data: pub
        })
        
        // Connect with category
        if (category) {
          await prisma.categoriesOnPublications.create({
            data: {
              publicationId: publication.id,
              categoryId: category.id
            }
          })
        }
        
        // Connect with authors if they exist
        if (authors.length > 0) {
          for (let i = 0; i < authors.length; i++) {
            await prisma.publicationAuthor.create({
              data: {
                publicationId: publication.id,
                profileId: authors[i].id,
                order: i + 1
              }
            })
          }
        }
        
        createdPublications.push({ id: publication.id, title: publication.title })
      }
      
      results.created.publications = createdPublications
    }
    
    results.counts = {
      users: await prisma.user.count(),
      profiles: await prisma.profile.count(), 
      events: await prisma.event.count(),
      publications: await prisma.publication.count(),
      categories: await prisma.category.count(),
      eventCategories: await prisma.eventCategory.count()
    }
    
    return NextResponse.json(results)
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      status: 'error',
      dbConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 