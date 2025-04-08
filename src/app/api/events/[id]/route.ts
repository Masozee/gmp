import { NextRequest } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"
import { apiResponse } from "@/lib/api-helpers"
import logger from "@/lib/logger"

/**
 * Get a single event by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return apiResponse.unauthorized()
    }

    // Get the event with category name
    const event = await sqlite.get(
      `SELECT e.*, c.name as categoryName 
       FROM events e
       LEFT JOIN event_categories c ON e.categoryId = c.id
       WHERE e.id = ?`,
      [params.id]
    )

    if (!event) {
      return apiResponse.notFound("Event not found")
    }

    // Get event speakers
    const speakers = await sqlite.all(
      `SELECT s.*, es.role, es.displayOrder
       FROM speakers s
       JOIN event_speakers es ON s.id = es.speakerId
       WHERE es.eventId = ?
       ORDER BY es.displayOrder ASC`,
      [params.id]
    )

    // Get event tags
    const tags = await sqlite.all(
      `SELECT t.*
       FROM tags t
       JOIN tags_on_events te ON t.id = te.tagId
       WHERE te.eventId = ?
       ORDER BY t.name ASC`,
      [params.id]
    )

    // Get event presentations
    const presentations = await sqlite.all(
      `SELECT p.*, s.firstName, s.lastName, s.organization
       FROM presentation p
       JOIN speakers s ON p.speakerId = s.id
       WHERE p.eventId = ?
       ORDER BY p.startTime ASC`,
      [params.id]
    )

    // Return event with related data
    return apiResponse.success({
      ...event,
      speakers,
      tags,
      presentations
    })
  } catch (error) {
    logger.error("Failed to fetch event", error instanceof Error ? error : new Error(String(error)))
    return apiResponse.error("Failed to fetch event")
  }
}

/**
 * Update an event by ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return apiResponse.unauthorized()
    }

    // Verify event exists
    const existingEvent = await sqlite.get(
      "SELECT id FROM events WHERE id = ?",
      [params.id]
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
        [slug, params.id]
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
      updateValues.push(params.id)
      
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
        [params.id]
      )
      
      return apiResponse.success(updatedEvent)
    })
  } catch (error) {
    logger.error("Failed to update event", error instanceof Error ? error : new Error(String(error)))
    return apiResponse.error("Failed to update event")
  }
}

/**
 * Delete an event by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return apiResponse.unauthorized()
    }

    // Verify event exists
    const existingEvent = await sqlite.get(
      "SELECT id FROM events WHERE id = ?",
      [params.id]
    )

    if (!existingEvent) {
      return apiResponse.notFound("Event not found")
    }

    // Use a transaction to ensure data consistency
    return await sqlite.transaction(async () => {
      // Delete associated records first
      await sqlite.run("DELETE FROM tags_on_events WHERE eventId = ?", [params.id])
      await sqlite.run("DELETE FROM event_speakers WHERE eventId = ?", [params.id])
      await sqlite.run("DELETE FROM presentation WHERE eventId = ?", [params.id])
      
      // Delete the event
      await sqlite.run("DELETE FROM events WHERE id = ?", [params.id])
      
      return apiResponse.noContent()
    })
  } catch (error) {
    logger.error("Failed to delete event", error instanceof Error ? error : new Error(String(error)))
    return apiResponse.error("Failed to delete event")
  }
} 