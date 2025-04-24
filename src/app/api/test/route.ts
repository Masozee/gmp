import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"

export async function GET(request: NextRequest) {
  try {
    // Test database connection by fetching users
    const users = await sqlite.all('SELECT id, name, email, role FROM users LIMIT 10');
    
    // Test database connection by fetching events
    const events = await sqlite.all('SELECT id, title FROM events LIMIT 5');
    
    // Test database connection by fetching speakers
    const speakers = await sqlite.all('SELECT id, firstName, lastName FROM speakers LIMIT 5');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection is working',
      data: {
        users,
        events,
        speakers
      }
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    // Don't close the database connection here, it will be handled by the application
  }
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface PublicationCount {
  count: number;
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
    const category = await sqlite.get<Category>(
      "SELECT * FROM event_categories WHERE id = ?",
      [params.id]
    )
    
    // Get publications count
    const publicationsCount = await sqlite.get<PublicationCount>(
      "SELECT COUNT(*) as count FROM publications WHERE categoryId = ?",
      [params.id]
    )

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

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