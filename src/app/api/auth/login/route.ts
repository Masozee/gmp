import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/edge-jwt"
import sqlite from "@/lib/sqlite"
import { apiResponse } from "@/lib/api-helpers"
import logger from "@/lib/logger"

// This should be in an environment variable in a real application
const JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_for_development_only"
const JWT_EXPIRY = "24h" // 24 hours

/**
 * Handle user login
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email) {
      return apiResponse.badRequest("Email is required")
    }
    
    if (!password) {
      return apiResponse.badRequest("Password is required")
    }

    // Find user by email
    const user = await sqlite.get(
      "SELECT id, email, password, role FROM users WHERE email = ?",
      [email]
    )

    // User not found
    if (!user) {
      return apiResponse.error("Invalid email or password", 401)
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password)
    
    if (!passwordValid) {
      // Log failed login attempt
      logger.warn(`Failed login attempt for user ${email}`, { userId: user.id })
      return apiResponse.error("Invalid email or password", 401)
    }

    // Create payload for JWT token
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    }
    
    // Create JWT token using jose (same library used in middleware)
    const token = await signToken(tokenPayload)
    console.log(`[Login API] Generated token (first 20 chars): ${token.substring(0, 20)}...`);

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })

    // Set HttpOnly cookie directly on the response
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
      sameSite: "lax", // Changed from strict to lax for better compatibility
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })
    
    console.log(`[Login API] Set token cookie for user: ${email}`);
    console.log(`[Login API] Cookies in response:`, response.cookies);

    // Log successful login
    logger.info(`User ${email} logged in successfully`, { userId: user.id })

    return response
  } catch (error) {
    console.error("[Login API] Error during login:", error);
    logger.error("Login error", error instanceof Error ? error : new Error(String(error)))
    return apiResponse.error("An error occurred during login")
  }
} 