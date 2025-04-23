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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    
    // Calculate pagination
    const { offset, limit: validLimit } = await sqlite.paginate(page, limit)
    
    // Build query conditions
    const conditions = []
    const params: any[] = []
    
    if (search) {
      conditions.push("(p.title LIKE ? OR p.abstract LIKE ?)")
      params.push(`%${search}%`, `%${search}%`)
    }
    
    if (status && status !== "all") {
      conditions.push("p.published = ?")
      params.push(status === "PUBLISHED" ? 1 : 0)
    }
    
    // Build the WHERE clause
    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(" AND ")}`
      : ""
    
    // Get publications with pagination
    const publications = await sqlite.all(`
      SELECT 
        p.id, 
        p.title, 
        p.slug, 
        p.abstract, 
        p.published, 
        p.categoryId,
        p.createdAt,
        p.updatedAt,
        c.name as categoryName
      FROM 
        publications p
      LEFT JOIN 
        event_categories c ON p.categoryId = c.id
      ${whereClause}
      ORDER BY 
        p.createdAt DESC
      LIMIT ? OFFSET ?
    `, [...params, validLimit, offset])
    
    // Get total count for pagination
    const totalCount = await sqlite.get(`
      SELECT COUNT(*) as count 
      FROM publications p
      ${whereClause}
    `, params)
    
    return NextResponse.json({
      publications,
      pagination: {
        page,
        limit: validLimit,
        totalCount: totalCount ? totalCount.count : 0,
        totalPages: Math.ceil((totalCount ? totalCount.count : 0) / validLimit)
      }
    })
  } catch (error) {
    console.error("Failed to fetch publications:", error)
    return NextResponse.json(
      { error: "Failed to fetch publications" },
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