const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
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

    console.log("Admin user created:", admin)
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 