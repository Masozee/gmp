import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { compare } from "bcryptjs"
import { signToken } from "@/lib/edge-jwt"
import { z } from "zod"

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()

    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        data: null,
        error: validationResult.error.errors[0].message
      }, { status: 400 })
    }

    const { email, password } = validationResult.data

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
      },
    })

    if (!user || !user.password) {
      return NextResponse.json({
        success: false,
        data: null,
        error: "Invalid email or password"
      }, { status: 401 })
    }

    // Validate password
    const isValidPassword = await compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        data: null,
        error: "Invalid email or password"
      }, { status: 401 })
    }

    // Create session token
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
      }
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      data: responseData,
      message: "Login successful"
    }, { status: 200 })
    
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
    console.error("Login error:", error)
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "An error occurred during login"
    }, { status: 500 })
  }
} 