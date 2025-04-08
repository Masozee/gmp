
import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { hash } from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await sqlite.get(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 10)
    
    // Create timestamp
    const now = new Date().toISOString()
    
    // Create user
    const result = await sqlite.run(
      "INSERT INTO users (email, password, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [email, hashedPassword, name, "user", now, now]
    )
    
    // Get created user (without password)
    const user = await sqlite.get(
      "SELECT id, email, name, role, createdAt, updatedAt FROM users WHERE id = ?",
      [result.lastInsertRowid]
    )
    
    return NextResponse.json(user)
  } catch (error) {
    console.error("Failed to register user:", error)
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    )
  }
} 