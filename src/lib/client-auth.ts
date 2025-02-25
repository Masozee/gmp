"use client"

import { verifyToken } from "./jwt"

interface User {
  id: string
  email: string
  role: "USER" | "ADMIN"
}

interface Session {
  user?: User
}

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