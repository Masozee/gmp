import { NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await sqlite.run(`INSERT INTO user({
      data: {
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Error creating test user:", error)
    return NextResponse.json(
      { error: "Failed to create test user" },
      { status: 500 }
    )
  }
} 