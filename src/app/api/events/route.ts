import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"
import { apiResponse } from "@/lib/api-helpers"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return apiResponse.unauthorized()
    }

    // Parse query parameters
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const { offset } = await sqlite.paginate(page, limit)

    // Get total count with search filter
    let countQuery = "SELECT COUNT(*) as total FROM events"
    let countParams: any[] = []
    let whereClause = ""

    if (search) {
      whereClause = " WHERE title LIKE ? OR description LIKE ?"
      countParams = [`%${search}%`, `%${search}%`]
    }

    const countResult = await sqlite.get<{ total: number }>(
      countQuery + whereClause,
      countParams
    )
    const total = countResult?.total || 0

    // Get events with pagination and search
    let eventsQuery = `
      SELECT e.*, c.name as categoryName
      FROM events e
      LEFT JOIN event_categories c ON e.categoryId = c.id
    `
    let eventsParams: any[] = []

    if (search) {
      eventsQuery += " WHERE e.title LIKE ? OR e.description LIKE ?"
      eventsParams = [`%${search}%`, `%${search}%`]
    }

    eventsQuery += " ORDER BY e.startDate DESC LIMIT ? OFFSET ?"
    eventsParams.push(limit, offset)

    const events = await sqlite.all(eventsQuery, eventsParams)

    return apiResponse.success({
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Failed to fetch events:", error)
    return apiResponse.error("Failed to fetch events")
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return apiResponse.unauthorized()
    }

    const body = await request.json()
    const { title, description, location, startDate, endDate, categoryId } = body

    // Validate required fields
    if (!title) {
      return apiResponse.badRequest("Title is required")
    }
    if (!description) {
      return apiResponse.badRequest("Description is required")
    }
    if (!location) {
      return apiResponse.badRequest("Location is required")
    }
    if (!startDate) {
      return apiResponse.badRequest("Start date is required")
    }
    if (!endDate) {
      return apiResponse.badRequest("End date is required")
    }

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    // Check if slug already exists
    const existingEvent = await sqlite.get(
      "SELECT id FROM events WHERE slug = ?",
      [slug]
    )

    if (existingEvent) {
      return apiResponse.badRequest("An event with this title already exists")
    }

    const now = new Date().toISOString()
    const id = await sqlite.generateId()

    // Use a transaction to ensure data consistency
    return await sqlite.transaction(async () => {
      await sqlite.run(
        `INSERT INTO events (
          id, title, slug, description, location, startDate, endDate, 
          status, published, categoryId, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          title,
          slug,
          description,
          location,
          new Date(startDate).toISOString(),
          new Date(endDate).toISOString(),
          "DRAFT",
          0,
          categoryId || null,
          now,
          now
        ]
      )

      const createdEvent = await sqlite.get(
        `SELECT e.*, c.name as categoryName 
         FROM events e
         LEFT JOIN event_categories c ON e.categoryId = c.id
         WHERE e.id = ?`,
        [id]
      )

      return apiResponse.created(createdEvent)
    })
  } catch (error) {
    console.error("Failed to create event:", error)
    return apiResponse.error("Failed to create event")
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return apiResponse.unauthorized()
    }

    // Extract the ID from the URL
    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const id = pathParts[pathParts.length - 1]
    
    if (!id) {
      return apiResponse.badRequest("Event ID is required")
    }

    // Verify event exists
    const existingEvent = await sqlite.get(
      "SELECT id FROM events WHERE id = ?",
      [id]
    )

    if (!existingEvent) {
      return apiResponse.notFound("Event not found")
    }

    const body = await request.json()
    const { title, description, location, startDate, endDate, categoryId, status, published } = body

    // Validate required fields
    if (!title) {
      return apiResponse.badRequest("Title is required")
    }
    if (!description) {
      return apiResponse.badRequest("Description is required")
    }
    if (!location) {
      return apiResponse.badRequest("Location is required")
    }

    // Generate slug from title if title changed
    let slug = null
    if (title) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      
      // Check if slug already exists for another event
      const existingEventWithSlug = await sqlite.get(
        "SELECT id FROM events WHERE slug = ? AND id != ?",
        [slug, id]
      )

      if (existingEventWithSlug) {
        return apiResponse.badRequest("An event with this title already exists")
      }
    }
    
    const now = new Date().toISOString()

    // Use a transaction to ensure data consistency
    return await sqlite.transaction(async () => {
      // Build update query dynamically based on provided fields
      const updateFields = []
      const updateValues = []
      
      if (title) {
        updateFields.push("title = ?")
        updateValues.push(title)
      }
      
      if (slug) {
        updateFields.push("slug = ?")
        updateValues.push(slug)
      }
      
      if (description) {
        updateFields.push("description = ?")
        updateValues.push(description)
      }
      
      if (location) {
        updateFields.push("location = ?")
        updateValues.push(location)
      }
      
      if (startDate) {
        updateFields.push("startDate = ?")
        updateValues.push(new Date(startDate).toISOString())
      }
      
      if (endDate) {
        updateFields.push("endDate = ?")
        updateValues.push(new Date(endDate).toISOString())
      }
      
      if (status) {
        updateFields.push("status = ?")
        updateValues.push(status)
      }
      
      if (published !== undefined) {
        updateFields.push("published = ?")
        updateValues.push(published ? 1 : 0)
      }
      
      if (categoryId !== undefined) {
        updateFields.push("categoryId = ?")
        updateValues.push(categoryId || null)
      }
      
      // Always update the updatedAt timestamp
      updateFields.push("updatedAt = ?")
      updateValues.push(now)
      
      // Add the id to the values array
      updateValues.push(id)
      
      // Execute the update
      await sqlite.run(
        `UPDATE events SET ${updateFields.join(", ")} WHERE id = ?`,
        updateValues
      )
      
      // Get the updated event with category name
      const updatedEvent = await sqlite.get(
        `SELECT e.*, c.name as categoryName 
         FROM events e
         LEFT JOIN event_categories c ON e.categoryId = c.id
         WHERE e.id = ?`,
        [id]
      )
      
      return apiResponse.success(updatedEvent)
    })
  } catch (error) {
    console.error("Failed to update event:", error)
    return apiResponse.error("Failed to update event")
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return apiResponse.unauthorized()
    }
    
    // Extract the ID from the URL
    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const id = pathParts[pathParts.length - 1]
    
    if (!id) {
      return apiResponse.badRequest("Event ID is required")
    }

    // Verify event exists
    const existingEvent = await sqlite.get(
      "SELECT id FROM events WHERE id = ?",
      [id]
    )

    if (!existingEvent) {
      return apiResponse.notFound("Event not found")
    }

    // Use a transaction to ensure data consistency
    return await sqlite.transaction(async () => {
      // Delete associated records first
      await sqlite.run("DELETE FROM tags_on_events WHERE eventId = ?", [id])
      await sqlite.run("DELETE FROM event_speakers WHERE eventId = ?", [id])
      await sqlite.run("DELETE FROM presentation WHERE eventId = ?", [id])
      
      // Delete the event
      await sqlite.run("DELETE FROM events WHERE id = ?", [id])
      
      return apiResponse.noContent()
    })
  } catch (error) {
    console.error("Failed to delete event:", error)
    return apiResponse.error("Failed to delete event")
  }
} 