import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import sqlite from "@/lib/sqlite"
import { randomUUID } from "crypto"

export async function GET() {
  try {
    const users = sqlite.all(`
      SELECT * FROM users
    `);

    // Remove sensitive information before returning
    const safeUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName } = body

    // Check if user already exists
    const existingUser = sqlite.get(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)
    
    // Current timestamp
    const now = new Date().toISOString();
    const userId = randomUUID();

    // Create user
    sqlite.run(
      "INSERT INTO users (id, email, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, email, `${firstName} ${lastName}`, "USER", now, now]
    );

    // Get the created user
    const createdUser = sqlite.get(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = createdUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Failed to create user:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
} 