import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-auth"
import { z } from "zod"

import sqlite from "@/lib/sqlite"

const eventSpeakerSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  speakerId: z.string().min(1, "Speaker ID is required"),
  role: z.string().optional(),
  order: z.number().int().min(1).default(1),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const url = new URL(req.url)
    const eventId = url.searchParams.get("eventId")
    const speakerId = url.searchParams.get("speakerId")

    // Build the query
    const query: any = {}
    if (eventId) query.eventId = eventId
    if (speakerId) query.speakerId = speakerId

    // Get event speakers with related data
    const eventSpeakers = await sqlite.all(`SELECT * FROM eventSpeaker({
      where: query,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
          },
        },
        speaker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            organization: true,
            position: true,
            photoUrl: true,
          },
        },
      },
      orderBy: [
        { order: "asc" },
        { speaker: { firstName: "asc" } },
      ],
    })

    return NextResponse.json(eventSpeakers)
  } catch (error) {
    console.error("Error fetching event speakers:", error)
    return NextResponse.json(
      { error: "Failed to fetch event speakers" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse and validate the request body
    const body = await req.json()
    const validatedData = eventSpeakerSchema.parse(body)

    // Check if event exists
    const event = await sqlite.get(`SELECT * FROM event WHERE({
      where: { id: validatedData.eventId },
    })
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if speaker exists
    const speaker = await sqlite.get(`SELECT * FROM speaker WHERE({
      where: { id: validatedData.speakerId },
    })
    if (!speaker) {
      return NextResponse.json({ error: "Speaker not found" }, { status: 404 })
    }

    // Check if the relationship already exists
    const existingRelation = await sqlite.get(`SELECT * FROM eventSpeaker({
      where: {
        eventId: validatedData.eventId,
        speakerId: validatedData.speakerId,
      },
    })
    if (existingRelation) {
      return NextResponse.json(
        { error: "Speaker is already assigned to this event" },
        { status: 400 }
      )
    }

    // Create the event speaker relationship
    const eventSpeaker = await sqlite.run(`INSERT INTO eventSpeaker({
      data: {
        eventId: validatedData.eventId,
        speakerId: validatedData.speakerId,
        role: validatedData.role,
        order: validatedData.order,
      },
      include: {
        speaker: {
          select: {
            firstName: true,
            lastName: true,
            organization: true,
          },
        },
      },
    })

    return NextResponse.json(eventSpeaker, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating event speaker:", error)
    return NextResponse.json(
      { error: "Failed to create event speaker" },
      { status: 500 }
    )
  }
} 