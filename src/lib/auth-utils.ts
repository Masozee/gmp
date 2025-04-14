import { cookies } from "next/headers"
import { jwtVerify } from "jose"

// This should be in an environment variable in a real application
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "test_jwt_secret_for_development_only"
)

export interface UserSession {
  id: string
  email: string
  role: string
}

/**
 * Get the current authenticated user from the JWT token in cookies
 * Returns null if not authenticated or token is invalid
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    // Get the token from cookies
    const token = cookies().get("token")?.value
    
    if (!token) {
      return null
    }
    
    // Verify the token
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