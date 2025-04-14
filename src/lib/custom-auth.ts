"use client"

import { compare } from "bcryptjs"
import sqlite from "./sqlite"
import { signToken } from "./edge-jwt"

// Type definitions
export interface User {
  id: string
  email: string
  name?: string
  role: string
}

export interface Session {
  user: User
}

// Verify JWT token on client side
export function verifyToken(token: string): any {
  try {
    // This is a simplified version - in production you would use proper JWT verification
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to verify token:", error);
    return null;
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

    if (!decoded || !decoded.id || !decoded.email) {
      return null
    }

    return {
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || "USER",
      },
    }
  } catch (error) {
    console.error("Failed to get session:", error)
    return null
  }
}

// Server-side authentication
export async function signIn(email: string, password: string) {
  const user = await sqlite.get(
    "SELECT id, email, password, name, role FROM users WHERE email = ?",
    [email.toLowerCase()]
  )

  if (!user || !user.password) {
    return null
  }

  const isValidPassword = await compare(password, user.password)
  if (!isValidPassword) {
    return null
  }

  // Create session token
  const token = await signToken({
    id: user.id,
    email: user.email || "",
    role: user.role || "USER",
  })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  }
} 