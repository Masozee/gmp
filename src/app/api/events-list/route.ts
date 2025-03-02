import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Parse search parameters
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "10")
    const status = url.searchParams.get("status")
    const categoryId = url.searchParams.get("categoryId")
    const sort = url.searchParams.get("sort") || "newest"
    
    // Calculate offset
    const offset = (page - 1) * limit
    
    // Build the WHERE clause
    let whereClause = ""
    const params: any[] = []
    let paramIndex = 1
    
    if (status) {
      whereClause += ` AND status = $${paramIndex++}`
      params.push(status)
    }
    
    if (categoryId) {
      whereClause += ` AND "categoryId" = $${paramIndex++}`
      params.push(categoryId)
    }
    
    // Determine the ORDER BY clause based on sort parameter
    let orderByClause = ""
    switch (sort) {
      case "newest":
        orderByClause = `ORDER BY e."createdAt" DESC`
        break
      case "oldest":
        orderByClause = `ORDER BY e."createdAt" ASC`
        break
      case "title_asc":
        orderByClause = `ORDER BY e.title ASC`
        break
      case "title_desc":
        orderByClause = `ORDER BY e.title DESC`
        break
      case "upcoming":
        orderByClause = `ORDER BY 
          CASE 
            WHEN e.status = 'UPCOMING' THEN 0 
            WHEN e.status = 'ONGOING' THEN 1 
            WHEN e.status = 'COMPLETED' THEN 2 
            WHEN e.status = 'CANCELLED' THEN 3 
            ELSE 4 
          END,
          e."startDate" ASC`
        break
      default:
        orderByClause = `ORDER BY e."createdAt" DESC`
    }
    
    // Count total events
    const countQuery = `
      SELECT COUNT(*) as total
      FROM events
      WHERE 1=1${whereClause}
    `
    
    const countResult = await db.$queryRawUnsafe(countQuery, ...params) as { total: bigint }[]
    const total = Number(countResult[0].total)
    
    // Fetch events with pagination
    const eventsQuery = `
      SELECT e.*, ec.name as category_name
      FROM events e
      LEFT JOIN event_categories ec ON e."categoryId" = ec.id
      WHERE 1=1${whereClause}
      ${orderByClause}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `
    
    const events = await db.$queryRawUnsafe(eventsQuery, ...params, limit, offset) as any[]
    
    // Calculate pagination
    const totalPages = Math.ceil(total / limit)
    
    return NextResponse.json({
      events: events.map((event: any) => ({
        ...event,
        category: event.category_name ? {
          id: event.categoryId,
          name: event.category_name
        } : null,
        speakers: [] // We'll handle speakers in a separate query if needed
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    })
  } catch (error) {
    console.error("Failed to fetch events:", error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    )
  }
} 