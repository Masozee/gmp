import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"

// Get tags for a specific publication
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if publication exists
    const publication = await sqlite.get(
      "SELECT id FROM publications WHERE id = ?",
      [params.id]
    )

    if (!publication) {
      return NextResponse.json(
        { error: "Publication not found" },
        { status: 404 }
      )
    }

    // Get tags for this publication
    const tags = await sqlite.all(`
      SELECT 
        t.id, 
        t.name, 
        t.slug,
        t.createdAt,
        t.updatedAt
      FROM 
        tags t
      JOIN 
        tags_on_publications tp ON t.id = tp.tagId
      WHERE 
        tp.publicationId = ?
      ORDER BY 
        t.name ASC
    `, [params.id])

    return NextResponse.json(tags)
  } catch (error) {
    console.error("Failed to fetch publication tags:", error)
    return NextResponse.json(
      { error: "Failed to fetch publication tags" },
      { status: 500 }
    )
  }
}

// Add tags to a publication
export async function POST(
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

    // Check if publication exists
    const publication = await sqlite.get(
      "SELECT id FROM publications WHERE id = ?",
      [params.id]
    )

    if (!publication) {
      return NextResponse.json(
        { error: "Publication not found" },
        { status: 404 }
      )
    }

    // Get tag IDs from request
    const { tagIds } = await request.json()

    if (!tagIds || !Array.isArray(tagIds) || tagIds.length === 0) {
      return NextResponse.json(
        { error: "Tag IDs are required" },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()
    const addedTags = []

    // Add each tag to the publication
    for (const tagId of tagIds) {
      // Check if tag exists
      const tag = await sqlite.get(
        "SELECT id FROM tags WHERE id = ?",
        [tagId]
      )

      if (!tag) {
        continue // Skip if tag doesn't exist
      }

      // Check if relationship already exists
      const existingRelation = await sqlite.get(
        "SELECT id FROM tags_on_publications WHERE publicationId = ? AND tagId = ?",
        [params.id, tagId]
      )

      if (existingRelation) {
        continue // Skip if relationship already exists
      }

      // Create relationship
      await sqlite.run(
        "INSERT INTO tags_on_publications (id, publicationId, tagId, createdAt) VALUES (?, ?, ?, ?)",
        [uuidv4(), params.id, tagId, now]
      )

      addedTags.push(tagId)
    }

    return NextResponse.json({
      message: `Added ${addedTags.length} tags to publication`,
      addedTags
    })
  } catch (error) {
    console.error("Failed to add tags to publication:", error)
    return NextResponse.json(
      { error: "Failed to add tags to publication" },
      { status: 500 }
    )
  }
}

// Remove a tag from a publication
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

    // Get the tag ID from request URL
    const url = new URL(request.url)
    const tagId = url.searchParams.get("tagId")

    if (!tagId) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      )
    }

    // Delete the relationship
    await sqlite.run(
      "DELETE FROM tags_on_publications WHERE publicationId = ? AND tagId = ?",
      [params.id, tagId]
    )

    return NextResponse.json({
      message: "Tag removed from publication"
    })
  } catch (error) {
    console.error("Failed to remove tag from publication:", error)
    return NextResponse.json(
      { error: "Failed to remove tag from publication" },
      { status: 500 }
    )
  }
} 