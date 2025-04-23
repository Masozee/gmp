import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"

// Get all tags
export async function GET(request: NextRequest) {
  try {
    // Get tags with publication counts
    const tags = await sqlite.all(`
      SELECT 
        t.id, 
        t.name, 
        t.slug,
        t.createdAt,
        t.updatedAt,
        COUNT(tp.publicationId) as publicationCount
      FROM 
        tags t
      LEFT JOIN 
        tags_on_publications tp ON t.id = tp.tagId
      GROUP BY 
        t.id
      ORDER BY 
        t.name ASC
    `)
    
    return NextResponse.json(tags)
  } catch (error) {
    console.error("Failed to fetch tags:", error)
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    )
  }
}

// Create a new tag
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    
    // Check if tag with this slug already exists
    const existingTag = await sqlite.get(
      "SELECT * FROM tags WHERE slug = ?",
      [slug]
    )

    if (existingTag) {
      return NextResponse.json(
        { error: "A tag with this name already exists" },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    // Create the tag
    const result = await sqlite.run(
      "INSERT INTO tags (name, slug, createdAt, updatedAt) VALUES (?, ?, ?, ?)",
      [name, slug, now, now]
    )
    
    // Get the created tag with the last inserted ID
    const lastInsertId = result ? (result as any).lastID : null
    
    if (!lastInsertId) {
      throw new Error("Failed to get the inserted tag ID")
    }
    
    const tag = await sqlite.get(
      "SELECT * FROM tags WHERE id = ?",
      [lastInsertId]
    )

    return NextResponse.json(tag)
  } catch (error) {
    console.error("Failed to create tag:", error)
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Update the category
    await sqlite.run(
      "UPDATE event_categories SET name = ?, slug = ?, description = ?, updatedAt = ? WHERE id = ?",
      [name, slug, description, now, params.id]
    )
    
    // Get the updated category
    const category = await sqlite.get(
      "SELECT * FROM event_categories WHERE id = ?",
      [params.id]
    )
    
    // Get publications count
    const publicationsCount = await sqlite.get(
      "SELECT COUNT(*) as count FROM publications WHERE categoryId = ?",
      [params.id]
    )

    return NextResponse.json({
      ...category,
      publicationsCount: publicationsCount ? publicationsCount.count : 0
    })
  } catch (error) {
    console.error("Failed to update category:", error)
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await sqlite.run(
      "DELETE FROM event_categories WHERE id = ?",
      [params.id]
    )

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
} 