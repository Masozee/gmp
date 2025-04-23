import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"

export async function GET(request: NextRequest) {
  try {
    // Check database connection
    const tables = await sqlite.all(
      "SELECT name FROM sqlite_master WHERE type='table'"
    )
    
    // Get a sample of data from existing tables
    const tableData: Record<string, any> = {}
    
    // Get sample users if the table exists
    if (tables.some(t => t.name === 'users')) {
      tableData.users = await sqlite.all("SELECT id, name, email FROM users LIMIT 3")
    }
    
    // Get sample events if the table exists
    if (tables.some(t => t.name === 'events')) {
      tableData.events = await sqlite.all("SELECT id, title, startDate, endDate FROM events LIMIT 3")
    }
    
    // Get sample categories if the table exists
    if (tables.some(t => t.name === 'event_categories')) {
      tableData.categories = await sqlite.all("SELECT id, name FROM event_categories LIMIT 3")
    }
    
    return NextResponse.json({
      connected: true,
      dbPath: './db/app.db',
      tables: tables.map(t => t.name),
      sampleData: tableData
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json({ 
      connected: false,
      error: String(error),
      message: "Failed to connect to the database. Make sure the db/app.db file exists and is accessible."
    }, { status: 500 })
  }
} 