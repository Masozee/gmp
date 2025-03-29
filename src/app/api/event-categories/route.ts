import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    // Fetch categories using raw SQL
    const query = `
      SELECT id, name, slug, description, "createdAt", "updatedAt"
      FROM event_categories
      ORDER BY name ASC
    `
    
    const categories = await db.$queryRawUnsafe(query) as any[]
    
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Failed to fetch event categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch event categories" },
      { status: 500 }
    )
  }
} 