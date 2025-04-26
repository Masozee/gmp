"use client"

import { verifyToken } from "./jwt"
import { jwtVerify } from "jose"

// User interface
export interface User {
  id: string | number
  email: string
  role: string
}

// Export the session interface for compatibility
export interface Session {
  user?: User
}

// Client-side session getter
export async function getSession(): Promise<Session | null> {
  try {
    // Get token from cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

    if (!token) {
      return null
    }

    const decoded = verifyToken(token)

    return {
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
    }
  } catch (error) {
    console.error("Failed to get session:", error)
    return null
  }
}

// Sign in function that calls the API
export async function signIn(email: string, password: string) {
  // Call the API endpoint
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Authentication failed');
    }

    const contentType = response.headers.get("content-type");
if (contentType && contentType.includes("application/json")) {
  return await response.json();
} else {
  throw new Error("Unexpected response from server");
}
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// This should be in an environment variable in a real application
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "test_jwt_secret_for_development_only"
)

export interface UserSession {
  id: string | number
  email: string
  role: string
}

/**
 * Get the current authenticated user from the JWT token in cookies
 * Returns null if not authenticated or token is invalid
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    // Use client-side cookie access
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]
    
    if (!token) {
      return null
    }
    
    const verified = await jwtVerify(token, JWT_SECRET)
    const payload = verified.payload as unknown as UserSession
    
    return payload
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

/**
 * Check if the current user has the specified role
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === role
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
} 