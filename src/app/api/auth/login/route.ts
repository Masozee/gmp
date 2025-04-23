import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/edge-jwt"
import sqlite from "@/lib/sqlite"
import "@/lib/db-init" // Import database initializer for Vercel
import { apiResponse } from "@/lib/api-helpers"
import logger from "@/lib/logger"

// This should be in an environment variable in a real application
const JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_for_development_only"
const JWT_EXPIRY = "1h" // Changed from 24h to 1h for 1-hour session timeout

/**
 * Handle user login
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return apiResponse.error("Email and password are required", 400)
    }

    // Find the user by email
    const user = await sqlite.get(
      "SELECT id, email, password, role FROM users WHERE email = ?",
      [email]
    )

    if (!user) {
      return apiResponse.error("Invalid credentials", 401)
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
      return apiResponse.error("Invalid credentials", 401)
    }

    // Generate token
    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    console.log(`[Login API] Generated token (first 20 chars): ${token.substring(0, 20)}...`);

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })

    // Set HttpOnly cookie directly on the response
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour in seconds (to match JWT expiry)
      path: "/",
    })

    console.log(`[Login API] Set token cookie for user: ${email}`);

    // Log successful login
    logger.info(`User ${email} logged in successfully`, { userId: user.id })

    return response
  } catch (error) {
    console.error("[Login API] Error during login:", error)
    // Handle error logging without using the logger.error that requires an Error object
    console.error("Login failed:", error instanceof Error ? error.message : String(error))
    return apiResponse.error("Authentication failed", 500)
  }
} 