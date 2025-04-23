import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"

export async function GET(request: NextRequest) {
  try {
    // Check if users table exists
    const tableInfo = await sqlite.all(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    )
    
    const usersTableExists = tableInfo.length > 0
    
    if (!usersTableExists) {
      return NextResponse.json({
        error: "Users table does not exist",
        tables: await sqlite.all("SELECT name FROM sqlite_master WHERE type='table'")
      })
    }
    
    // Check table structure
    const tableSchema = await sqlite.all("PRAGMA table_info(users)")
    
    // Check if there are any users
    const userCount = await sqlite.get("SELECT COUNT(*) as count FROM users")
    
    // Get a sample user (without sensitive info)
    // Only select columns we know exist
    const sampleUser = await sqlite.get(
      "SELECT id, name, email FROM users LIMIT 1"
    )
    
    return NextResponse.json({
      tableExists: usersTableExists,
      tableSchema,
      userCount: userCount?.count || 0,
      sampleUser: sampleUser ? {
        ...sampleUser,
        image: null // Add null image field for consistency
      } : null
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ error: "Debug error", details: String(error) }, { status: 500 })
  }
} 