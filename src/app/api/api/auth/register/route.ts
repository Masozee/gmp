import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { signToken } from "@/lib/edge-jwt"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { UserRole, UserCategory } from "@prisma/client"

// Validation schema
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
})

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    
    // Validate input
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        data: null,
        error: validationResult.error.errors[0].message
      }, { status: 400 })
    }

    const { email, password, firstName, lastName } = validationResult.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        data: null,
        error: "User already exists"
      }, { status: 400 })
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

    // Create response data
    const responseData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      profile
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      data: responseData,
      message: "Registration successful"
    }, { status: 201 })
    
    // Set cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60, // 1 day
    })
    
    return response
  } catch (error) {
    console.error("Registration failed:", error)
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Registration failed"
    }, { status: 500 })
  }
} 