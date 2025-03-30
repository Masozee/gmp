import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"
// Import the database initialization module
import "@/lib/initialize"

export async function GET(request: NextRequest) {
  try {
    // Temporarily disable auth check for development
    // const session = await getServerSession()
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   )
    // }

    const searchParams = new URL(request.url).searchParams
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "name"
    const order = searchParams.get("order") || "asc"

    // Create base query
    let query = "SELECT c.*, COUNT(p.id) as publicationsCount FROM event_categories c LEFT JOIN publications p ON c.id = p.categoryId"
    const params: any[] = []
    
    // Add WHERE clause if search is provided
    if (search) {
      query += " WHERE c.name LIKE ? OR c.slug LIKE ?"
      params.push(`%${search}%`, `%${search}%`)
    }
    
    // Add GROUP BY
    query += " GROUP BY c.id"
    
    // Add ORDER BY clause (with sanitization to prevent SQL injection)
    const validSortColumns = ["name", "slug", "createdAt", "updatedAt"]
    const validOrderValues = ["asc", "desc"]
    
    const sortColumn = validSortColumns.includes(sort) ? sort : "name"
    const orderDirection = validOrderValues.includes(order.toLowerCase()) ? order.toLowerCase() : "asc"
    
    query += ` ORDER BY c.${sortColumn} ${orderDirection}`
    
    // Execute query
    const categories = sqlite.all(query, params)
    
    return NextResponse.json(categories)
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
    
    // Check if category with this slug already exists
    const existingCategory = sqlite.get(
      "SELECT * FROM event_categories WHERE slug = ?",
      [slug]
    )
    
    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 400 }
      )
    }
    
    // Current timestamp
    const now = new Date().toISOString()
    
    // Insert the category
    const result = sqlite.run(
      "INSERT INTO event_categories (name, slug, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
      [name, slug, description || null, now, now]
    )
    
    // Get the created category
    const category = sqlite.get(
      "SELECT c.*, COUNT(p.id) as publicationsCount FROM event_categories c LEFT JOIN publications p ON c.id = p.categoryId WHERE c.id = ? GROUP BY c.id", 
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