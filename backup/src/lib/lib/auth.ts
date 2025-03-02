"use client"

import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyToken } from "./jwt"

// Extend the built-in types
declare module "next-auth" {
  interface User {
    id: string
    email: string
    role: "USER" | "ADMIN"
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    role: "USER" | "ADMIN"
  }
}

interface User {
  id: string
  email: string
  role: "USER" | "ADMIN"
}

interface Session {
  user?: User
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Here you would typically verify credentials against your database
          // For now, we'll use the JWT token verification
          const token = credentials.password // This should be your JWT token
          const decoded = verifyToken(token)

          return {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.role = token.role as "USER" | "ADMIN"
      }
      return session
    }
  }
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