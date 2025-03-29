import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { signToken } from "@/lib/edge-jwt"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, firstName, lastName } = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email,
      },
    })

    const profile = await prisma.profile.create({
      data: {
        firstName,
        lastName,
        email,
        category: "STAFF",
      },
    })

    // Generate JWT token
    const token = await signToken({
      id: user.id,
      email: user.email,
      role: "USER",
    })

    // Create response with cookie
    const response = NextResponse.json({
      user,
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