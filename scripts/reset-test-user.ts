import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    // Delete existing test user if exists
    await prisma.user.deleteMany({
      where: {
        email: 'test@example.com'
      }
    })

    console.log('Deleted existing test user if any')

    // Create new test user
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
      },
    })

    console.log('Created new test user:', user)
  } catch (error) {
    console.error('Error resetting test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 