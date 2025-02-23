import { NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signToken } from "@/lib/edge-jwt"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log("[Login API] Attempt for email:", email)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    })

    if (!user) {
      console.log("[Login API] User not found")
      return NextResponse.json(
        { error: "Invalid email or password", success: false },
        { status: 401 }
      )
    }

    // Check if user is archived
    if (user.status === "ARCHIVED") {
      console.log("[Login API] User is archived")
      return NextResponse.json(
        { error: "Account is archived. Please contact support.", success: false },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await compare(password, user.password)

    if (!isValidPassword) {
      console.log("[Login API] Invalid password")
      return NextResponse.json(
        { error: "Invalid email or password", success: false },
        { status: 401 }
      )
    }

    console.log("[Login API] Password verified, generating token")

    // Generate JWT token with user data
    const tokenData = {
      id: user.id,
      email: user.email,
      role: user.role,
    }
    console.log("[Login API] Token data:", tokenData)
    
    const token = await signToken(tokenData)
    console.log("[Login API] Token generated")

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Create response with cookie
    const response = NextResponse.json({
      user: userWithoutPassword,
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

    console.log("[Login API] Setting cookie with options:", {
      ...cookieOptions,
      value: token.substring(0, 10) + "...",
    })

    // Set cookie in response
    response.cookies.set(cookieOptions)

    console.log("[Login API] Cookie set, returning response")

    return response
  } catch (error) {
    console.error("[Login API] Error:", error)
    return NextResponse.json(
      { 
        error: "An unexpected error occurred during login. Please try again.",
        success: false,
        details: process.env.NODE_ENV === "development" ? error : undefined
      },
      { status: 500 }
    )
  }
} 