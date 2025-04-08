import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"

// Define the context type outside of the function
type RouteContext = { params: { id: string } };

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const category = await sqlite.get(
      "SELECT * FROM event_categories WHERE id = ?",
      [params.id]
    )

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Get publications count for this category
    const publicationsCount = await sqlite.get(
      "SELECT COUNT(*) as count FROM publications WHERE categoryId = ?",
      [params.id]
    )

    // Add count to category
    return NextResponse.json({
      ...category,
      publicationsCount: publicationsCount ? publicationsCount.count : 0
    })
  } catch (error) {
    console.error("Failed to fetch category:", error)
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
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
  { params }: RouteContext
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