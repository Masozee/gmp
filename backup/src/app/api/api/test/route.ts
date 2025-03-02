import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    console.log("[Test API] Starting user creation...")
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      console.log("[Test API] Missing email or password")
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    console.log("[Test API] Checking for existing user...")
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      console.log("[Test API] User already exists")
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    console.log("[Test API] Hashing password...")
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log("[Test API] Creating user...")
    // Create user with ADMIN role using raw SQL
    const result = await prisma.$executeRaw`
      INSERT INTO users (id, email, password, role, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${email.toLowerCase()}, ${hashedPassword}, 'ADMIN', NOW(), NOW())
    `

    if (result !== 1) {
      throw new Error("Failed to create user")
    }

    // Fetch the created user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
      },
    })

    if (!user) {
      throw new Error("User was created but could not be retrieved")
    }

    console.log("[Test API] User created successfully:", user)
    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("[Test API] Error creating test user:", error)
    if (error instanceof Error) {
      console.error("[Test API] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
    }
    return NextResponse.json(
      { error: "Failed to create test user" },
      { status: 500 }
    )
  }
} 