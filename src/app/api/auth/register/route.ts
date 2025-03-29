import { NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { signToken } from "@/lib/edge-jwt"
import bcrypt from "bcryptjs"
import { z } from "zod"

// UserRole enum
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  CONTRIBUTOR = 'CONTRIBUTOR',
}
// UserCategory enum
export enum UserCategory {
  ACADEMIC = 'ACADEMIC',
  PRACTITIONER = 'PRACTITIONER',
  STUDENT = 'STUDENT',
  OTHER = 'OTHER',
}



// Validation schema
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password, firstName, lastName } = validationResult.data

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
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: `${firstName} ${lastName}`,
        },
      })

      const profile = await tx.profile.create({
        data: {
          firstName,
          lastName,
          email,
          category: UserCategory.STAFF,
        },
      })

      return { user, profile }
    })

    const { user, profile } = result

    // Generate JWT token
    const token = await signToken({
      id: user.id,
      email: user.email || "",
      role: "USER",
    })

    // Create response with cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      profile,
      success: true,
    })

    // Cookie settings
    const cookieOptions = {
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    }

    // Set cookie in response
    response.cookies.set(cookieOptions)

    return response
  } catch (error) {
    console.error("Registration failed:", error)
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
} 