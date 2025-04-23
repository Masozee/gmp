import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"

export async function GET(
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

    // Get the publication by ID
    const publication = await sqlite.get(`
      SELECT 
        p.*, 
        c.name as categoryName
      FROM 
        publications p
      LEFT JOIN 
        event_categories c ON p.categoryId = c.id
      WHERE 
        p.id = ?
    `, [params.id])

    if (!publication) {
      return NextResponse.json(
        { error: "Publication not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(publication)
  } catch (error) {
    console.error("Failed to fetch publication:", error)
    return NextResponse.json(
      { error: "Failed to fetch publication" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params: routeParams }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { title, slug, abstract, content, categoryId, published } = await request.json()

    if (title !== undefined && !title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    // Generate slug if not provided and title is being updated
    const finalSlug = title ? (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-")) : slug
    
    const now = new Date().toISOString()

    // Build the update query dynamically based on provided fields
    const updateFields = []
    const queryParams = []

    if (title !== undefined) {
      updateFields.push("title = ?")
      queryParams.push(title)
    }

    if (finalSlug !== undefined) {
      updateFields.push("slug = ?")
      queryParams.push(finalSlug)
    }

    if (abstract !== undefined) {
      updateFields.push("abstract = ?")
      queryParams.push(abstract)
    }

    if (content !== undefined) {
      updateFields.push("content = ?")
      queryParams.push(content)
    }

    if (categoryId !== undefined) {
      updateFields.push("categoryId = ?")
      queryParams.push(categoryId)
    }

    if (published !== undefined) {
      updateFields.push("published = ?")
      queryParams.push(published)
    }

    // Always update the updatedAt field
    updateFields.push("updatedAt = ?")
    queryParams.push(now)

    // Add the ID as the last parameter for the WHERE clause
    queryParams.push(routeParams.id)

    // Update the publication
    await sqlite.run(`
      UPDATE publications 
      SET ${updateFields.join(", ")} 
      WHERE id = ?
    `, queryParams)
    
    // Get the updated publication
    const publication = await sqlite.get(`
      SELECT 
        p.*, 
        c.name as categoryName
      FROM 
        publications p
      LEFT JOIN 
        event_categories c ON p.categoryId = c.id
      WHERE 
        p.id = ?
    `, [routeParams.id])

    return NextResponse.json(publication)
  } catch (error) {
    console.error("Failed to update publication:", error)
    return NextResponse.json(
      { error: "Failed to update publication" },
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
      "DELETE FROM publications WHERE id = ?",
      [params.id]
    )

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete publication:", error)
    return NextResponse.json(
      { error: "Failed to delete publication" },
      { status: 500 }
    )
  }
} 