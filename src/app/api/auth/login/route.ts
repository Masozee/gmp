import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
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
    const body = await request.json()

    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

    const user = await sqlite.get(`SELECT * FROM user WHERE({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
      },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const isValidPassword = await compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Create session token
    const token = await signToken({
      id: user.id,
      email: user.email || "",
      role: "USER",
    })

    // Set cookie and return response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      success: true,
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    )
  }
} 