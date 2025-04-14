"use client"

import { useState, useEffect } from "react"
import { getSession } from "@/lib/auth"

export interface User {
  id: string
  email: string
  role: "USER" | "ADMIN"
}

export interface Session {
  user?: User
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = await getSession()
        setSession(sessionData)
        setStatus(sessionData?.user ? "authenticated" : "unauthenticated")
      } catch (error) {
        console.error("Failed to load session:", error)
        setStatus("unauthenticated")
      }
    }

    loadSession()
  }, [])

  return {
    data: session,
    status,
  }
} 