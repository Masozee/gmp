
import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { hash } from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body
    
    // Simple validation
    if (!email || !password || !name) {
      return NextResponse.json({ 
        error: "Missing required fields" 
      }, { status: 400 })
    }

    // Generate a timestamp
    const now = new Date().toISOString()
    
    // Hash the password
    const hashedPassword = await hash(password, 12)
    
    // Create the user
    const result = await sqlite.run(
      "INSERT INTO users (email, password, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [email, hashedPassword, name, "ADMIN", now, now]
    )
    
    return NextResponse.json({ 
      success: true,
      id: result.lastInsertRowid
    })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json({ 
      error: "Failed to create admin user" 
    }, { status: 500 })
  }
} 