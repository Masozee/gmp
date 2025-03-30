import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"
import slugify from "slugify"

export async function GET(request: NextRequest) {
  try {
    // Temporarily disable authentication for testing
    // const session = await getServerSession()
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   )
    // }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'name'
    const order = searchParams.get('order') || 'asc'

    // Create base query
    let query = "SELECT c.*, COUNT(e.id) as eventsCount FROM event_categories c LEFT JOIN events e ON c.id = e.categoryId";
    const params: any[] = [];
    
    // Add WHERE clause if search is provided
    if (search) {
      query += " WHERE c.name LIKE ? OR c.description LIKE ?";
      params.push(`%${search}%`, `%${search}%`);
    }
    
    // Add GROUP BY
    query += " GROUP BY c.id";
    
    // Add ORDER BY clause (with sanitization to prevent SQL injection)
    const validSortColumns = ["name", "slug", "createdAt", "updatedAt"];
    const validOrderValues = ["asc", "desc"];
    
    const sortColumn = validSortColumns.includes(sort) ? sort : "name";
    const orderDirection = validOrderValues.includes(order.toLowerCase()) ? order.toLowerCase() : "asc";
    
    query += ` ORDER BY c.${sortColumn} ${orderDirection}`;
    
    // Execute query
    const categories = sqlite.all(query, params);

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Failed to fetch event categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch event categories" },
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

    const json = await request.json()
    const { name, description } = json

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    // Generate a unique slug based on the name
    let slug = slugify(name, { lower: true, strict: true })
    
    // Check if slug exists
    const existingCategory = sqlite.get(
      "SELECT * FROM event_categories WHERE slug = ?",
      [slug]
    );

    // If slug exists, append a unique timestamp
    if (existingCategory) {
      slug = `${slug}-${Date.now()}`
    }

    // Current timestamp
    const now = new Date().toISOString();
    
    // Insert the category
    const result = sqlite.run(
      "INSERT INTO event_categories (name, slug, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
      [name, slug, description || null, now, now]
    );
    
    // Get the created category
    const category = sqlite.get(
      "SELECT c.*, COUNT(e.id) as eventsCount FROM event_categories c LEFT JOIN events e ON c.id = e.categoryId WHERE c.id = ? GROUP BY c.id", 
      [result.lastInsertRowid]
    );

    return NextResponse.json(category)
  } catch (error) {
    console.error("Failed to create event category:", error)
    return NextResponse.json(
      { error: "Failed to create event category" },
      { status: 500 }
    )
  }
} 