
import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const categories = await sqlite.all(
      "SELECT * FROM event_categories ORDER BY name ASC"
    )

    // Get publications count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const publicationsCount = await sqlite.get(
          "SELECT COUNT(*) as count FROM publications WHERE categoryId = ?",
          [category.id]
        )
        
        return {
          ...category,
          publicationsCount: publicationsCount ? publicationsCount.count : 0
        }
      })
    )

    return NextResponse.json(categoriesWithCount)
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    
    const now = new Date().toISOString()

    // Create the category
    const result = await sqlite.run(
      "INSERT INTO event_categories (name, slug, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
      [name, slug, description, now, now]
    )
    
    const category = await sqlite.get(
      "SELECT * FROM event_categories WHERE id = ?",
      [result.lastInsertRowid]
    )
    
    return NextResponse.json(category)
  } catch (error) {
    console.error("Failed to create category:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
} 