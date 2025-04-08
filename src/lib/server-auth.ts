import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { Session } from "./auth"

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
    // In Next.js 15, cookies() must be awaited before using its methods
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    
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
 * Get server session from JWT token
 */
export async function getServerSession(): Promise<Session | null> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return null
    }
    
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role as any,
      }
    }
  } catch (error) {
    console.error("Failed to get server session:", error)
    return null
  }
}

/**
 * Check if the current user has the specified role
 */
export async function hasServerRole(role: string): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === role
}

/**
 * Check if the user is authenticated
 */
export async function isServerAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
} 