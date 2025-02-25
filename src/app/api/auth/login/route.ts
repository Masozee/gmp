import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { signToken } from "@/lib/edge-jwt"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    console.log("[Login API] Attempt for email:", email)

    // Find or create user
    let user;
    
    try {
      // Find existing user
      user = await prisma.user.findUnique({
        where: { email },
      })

      // Create new user if not found
      if (!user) {
        console.log("[Login API] User not found, creating new user")
        user = await prisma.user.create({
          data: { 
            email,
          },
        })
      }
    } catch (error) {
      console.error("[Login API] Error finding/creating user:", error)
      throw new Error("Failed to find or create user")
    }

    console.log("[Login API] User found/created, generating token")

    // Generate JWT token with user data
    const token = await signToken({
      id: user.id,
      email: user.email || "",
      role: "USER", // Default role since role field was removed
    })
    console.log("[Login API] Token generated")

    // Create response with cookie
    const response = NextResponse.json({
      user,
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