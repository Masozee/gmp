import { verifyToken, signToken } from "@/lib/edge-jwt"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // Get the token from the cookies
    const token = req.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 })
    }

    // Verify the token
    const decoded = await verifyToken(token)

    // Create a new token to refresh the expiration time
    const newToken = await signToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    })

    // Create the response
    const response = NextResponse.json({
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      }
    }, { status: 200 })

    // Set a fresh cookie with the new token
    response.cookies.set({
      name: "token",
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour in seconds
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Session verification error:", error)
    return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 })
  }
} 