import { cookies } from "next/headers"
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies"
import { verifyToken } from "./edge-jwt"

interface User {
  id: string
  email: string
  role: "USER" | "ADMIN"
}

interface Session {
  user?: User
}

export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return null
    }

    const decoded = await verifyToken(token)

    return {
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
    }
  } catch (error) {
    console.error("Failed to get server session:", error)
    return null
  }
} 