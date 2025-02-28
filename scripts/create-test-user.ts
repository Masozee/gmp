import { PrismaClient, UserRole, UserCategory } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    const password = await hash('password123', 10)
    
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password,
        role: UserRole.USER,
      },
    })

    const profile = await prisma.profile.create({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        category: UserCategory.STAFF,
      },
    })

    console.log('Test user created:', user)
    console.log('Test profile created:', profile)
  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 