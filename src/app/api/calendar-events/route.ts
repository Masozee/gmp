import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Parse search parameters
    const url = new URL(request.url)
    const startDate = url.searchParams.get("startDate")
    const endDate = url.searchParams.get("endDate")
    
    // Validate date parameters
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate and endDate parameters are required" },
        { status: 400 }
      )
    }
    
    // Build the query to fetch events within the date range
    const query = `
      SELECT 
        id, 
        title, 
        "startDate", 
        "endDate", 
        status, 
        "categoryId",
        location
      FROM events
      WHERE 
        ("startDate"::date BETWEEN $1::date AND $2::date) OR
        ("endDate"::date BETWEEN $1::date AND $2::date) OR
        ($1::date BETWEEN "startDate"::date AND "endDate"::date) OR
        ($2::date BETWEEN "startDate"::date AND "endDate"::date)
      ORDER BY "startDate" ASC
    `
    
    console.log("Executing calendar events query with dates:", startDate, endDate)
    
    const events = await db.$queryRawUnsafe(query, startDate, endDate) as any[]
    
    console.log(`Found ${events.length} events for the date range`)
    
    return NextResponse.json({
      events: events.map((event: any) => ({
        id: event.id,
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        status: event.status,
        categoryId: event.categoryId,
        location: event.location
      }))
    })
  } catch (error) {
    console.error("Failed to fetch calendar events:", error)
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 }
    )
  }
} 