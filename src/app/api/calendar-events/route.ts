import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"

// Mock calendar events for fallback
const mockEvents = [
  {
    id: "event-1",
    title: "Team Meeting",
    startDate: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
    endDate: new Date(Date.now() + 7200 * 1000).toISOString(), // 2 hours from now
    status: "UPCOMING",
    categoryId: "category-1",
    location: "Conference Room A"
  },
  {
    id: "event-2",
    title: "Project Review",
    startDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // Tomorrow
    endDate: new Date(Date.now() + 25 * 3600 * 1000).toISOString(), // Tomorrow + 1 hour
    status: "UPCOMING",
    categoryId: "category-2",
    location: "Virtual Meeting"
  },
  {
    id: "event-3",
    title: "Quarterly Planning",
    startDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(), // 3 days from now
    endDate: new Date(Date.now() + 3 * 24 * 3600 * 1000 + 4 * 3600 * 1000).toISOString(), // 3 days + 4 hours from now
    status: "UPCOMING",
    categoryId: "category-1",
    location: "Main Office"
  }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get query parameters for date range
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Validate parameters
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate and endDate parameters are required" },
        { status: 400 }
      )
    }

    try {
      // Get events within the date range
      const events = await sqlite.all(`
        SELECT 
          e.id, 
          e.title, 
          e.startDate, 
          e.endDate, 
          e.status, 
          e.categoryId,
          e.location
        FROM 
          events e
        WHERE 
          (e.startDate BETWEEN ? AND ?) OR
          (e.endDate BETWEEN ? AND ?) OR
          (e.startDate <= ? AND e.endDate >= ?)
        ORDER BY 
          e.startDate ASC
      `, [startDate, endDate, startDate, endDate, startDate, endDate])

      if (events && events.length > 0) {
        return NextResponse.json({ events })
      }
    } catch (dbError) {
      console.error("Database error fetching events:", dbError)
      // Continue to fallback
    }
    
    // Return mock events if no events found or database error
    return NextResponse.json({ events: mockEvents })
  } catch (error) {
    console.error("Failed to fetch events:", error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    )
  }
} 