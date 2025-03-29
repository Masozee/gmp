import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import sqlite from "@/lib/sqlite"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName } = body

    // Check if user already exists
    const existingUser = await sqlite.get(`SELECT * FROM user WHERE({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create admin user and profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "ADMIN",
          profile: {
            create: {
              firstName,
              lastName,
            },
          },
        },
        include: {
          profile: true,
        },
      })

      return user
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Failed to create admin user:", error)
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    )
  }
} 