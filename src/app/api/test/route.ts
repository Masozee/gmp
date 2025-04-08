import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"

export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "API is working", 
    timestamp: new Date().toISOString() 
  })
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

export async function POST() {
  return NextResponse.json({ status: "ok", message: "POST is working" })
} 