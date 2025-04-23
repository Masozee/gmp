import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the tag with publication count
    const tag = await sqlite.get(`
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
      WHERE 
        t.id = ?
      GROUP BY 
        t.id
    `, [params.id])

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      )
    }

    // Get publications for this tag
    const publications = await sqlite.all(`
      SELECT 
        p.id, 
        p.title, 
        p.slug, 
        p.abstract, 
        p.published,
        p.createdAt,
        p.updatedAt
      FROM 
        publications p
      JOIN 
        tags_on_publications tp ON p.id = tp.publicationId
      WHERE 
        tp.tagId = ?
      ORDER BY 
        p.createdAt DESC
      LIMIT 10
    `, [params.id])

    return NextResponse.json({
      ...tag,
      publications
    })
  } catch (error) {
    console.error("Failed to fetch tag:", error)
    return NextResponse.json(
      { error: "Failed to fetch tag" },
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

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    
    // Check if tag with this slug already exists (excluding current tag)
    const existingTag = await sqlite.get(
      "SELECT * FROM tags WHERE slug = ? AND id != ?",
      [slug, params.id]
    )

    if (existingTag) {
      return NextResponse.json(
        { error: "A tag with this name already exists" },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    // Update the tag
    await sqlite.run(
      "UPDATE tags SET name = ?, slug = ?, updatedAt = ? WHERE id = ?",
      [name, slug, now, params.id]
    )
    
    // Get the updated tag
    const tag = await sqlite.get(
      "SELECT * FROM tags WHERE id = ?",
      [params.id]
    )

    return NextResponse.json(tag)
  } catch (error) {
    console.error("Failed to update tag:", error)
    return NextResponse.json(
      { error: "Failed to update tag" },
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

    // Delete tag relationships first
    await sqlite.run(
      "DELETE FROM tags_on_publications WHERE tagId = ?",
      [params.id]
    )

    // Then delete the tag
    await sqlite.run(
      "DELETE FROM tags WHERE id = ?",
      [params.id]
    )

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete tag:", error)
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    )
  }
} 