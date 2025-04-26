import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/edge-jwt"
import database from "@/lib/database"
import "@/lib/db-init" // Import database initializer for Vercel
import { apiResponse } from "@/lib/api-helpers"
import logger from "@/lib/logger"
import { createServerSupabaseClient } from "@/lib/supabaseClient"

// This should be in an environment variable in a real application
const JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_for_development_only"
const JWT_EXPIRY = "1h" // Changed from 24h to 1h for 1-hour session timeout

// Define user interface
interface User {
  id: string;
  email: string | null | undefined;
  role: string;
  password?: string;
}

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

    let user: User;

    if (database.isUsingSupabase()) {
      // Use Supabase for authentication with the proper client
      const cookieStore = cookies();
      const supabase = createServerSupabaseClient(cookieStore);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("[Login API] Supabase auth error:", error);
        return apiResponse.error("Invalid credentials", 401);
      }

      if (!data?.user) {
        return apiResponse.error("User not found", 401);
      }

      // Extract user role from user metadata
      const role = data.user.user_metadata?.role || 'user';

      user = {
        id: data.user.id,
        email: data.user.email,
        role: role.toUpperCase(), // Ensure consistent casing for roles
      };

      // With Supabase, the session is already managed via cookies
      // We just need to return the user data
      console.log(`[Login API] Supabase authentication successful for: ${email}`);
      
      // Still create our own JWT token for compatibility with existing code
      const token = await signToken({
        id: user.id,
        email: user.email || email, // Use provided email as fallback
        role: user.role,
      });

      // Create response with user data
      const response = NextResponse.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });

      // Set our custom token cookie
      response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour in seconds (to match JWT expiry)
        path: "/",
      });

      // Log successful login
      logger.info(`User ${email} logged in successfully with Supabase`, { userId: user.id });

      return response;
    } else {
      // Find the user by email using the database abstraction
      const dbUser = await database.get<any>(
        "SELECT id, email, password, role FROM users WHERE email = ?",
        [email]
      );

      if (!dbUser) {
        return apiResponse.error("Invalid credentials", 401);
      }

      // Verify password
      const passwordValid = await bcrypt.compare(password, dbUser.password);
      if (!passwordValid) {
        return apiResponse.error("Invalid credentials", 401);
      }
      
      user = dbUser as User;

      // Generate token
      const token = await signToken({
        id: user.id,
        email: user.email || email, // Use provided email as fallback
        role: user.role,
      });

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

      return response;
    }
  } catch (error) {
    console.error("[Login API] Error during login:", error)
    // Handle error logging without using the logger.error that requires an Error object
    console.error("Login failed:", error instanceof Error ? error.message : String(error))
    return apiResponse.error("Authentication failed", 500)
  }
} 