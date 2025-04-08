"use client"

import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyToken } from "./jwt"
import { compare } from "bcryptjs"
import { signToken } from "./edge-jwt"
import { jwtVerify } from "jose"

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

// User interface
interface User {
  id: string
  email: string
  role: "USER" | "ADMIN"
}

// Export the session interface to avoid TypeScript errors
export interface Session {
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

// Create a simple auth handler that depends on an API call instead of direct DB access
export async function signIn(email: string, password: string) {
  // Call an API endpoint instead of directly accessing the database
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

// Get server session from JWT token
export async function getServerSession(): Promise<Session | null> {
  try {
    // This function would normally extract the token from cookies
    // For now, we'll just return null
    return null
  } catch (error) {
    console.error("Failed to get server session:", error)
    return null
  }
}

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
    // Use client-side cookie access instead of server-only cookies()
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