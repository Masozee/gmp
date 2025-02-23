import { cookies } from "next/headers"
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies"
import { verifyToken } from "./jwt"

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
    const cookieStore = cookies() as unknown as RequestCookies
    const token = cookieStore.get('token')?.value

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
    console.error("Failed to get server session:", error)
    return null
  }
} 