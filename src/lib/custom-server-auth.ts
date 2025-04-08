import { cookies } from "next/headers"
import { verifyToken } from "./edge-jwt"

interface User {
  id: string
  email: string
  role: string
}

export interface Session {
  user: User
}

export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return null
    }

    const decoded = await verifyToken(token)

    if (!decoded || !decoded.id || !decoded.email) {
      return null
    }

    return {
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || "USER",
      }
    }
  } catch (error) {
    console.error("Failed to get server session:", error)
    return null
  }
} 