import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-auth"
import { z } from "zod"

import sqlite from "@/lib/sqlite"

const updateEventSpeakerSchema = z.object({
  role: z.string().optional(),
  order: z.number().int().min(1).optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const eventSpeaker = await sqlite.get(`SELECT * FROM eventSpeaker WHERE({
      where: { id: params.id },
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
            bio: true,
          },
        },
      },
    })

    if (!eventSpeaker) {
      return NextResponse.json(
        { error: "Event speaker not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(eventSpeaker)
  } catch (error) {
    console.error("Error fetching event speaker:", error)
    return NextResponse.json(
      { error: "Failed to fetch event speaker" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the event speaker exists
    const existingEventSpeaker = await sqlite.get(`SELECT * FROM eventSpeaker WHERE({
      where: { id: params.id },
    })

    if (!existingEventSpeaker) {
      return NextResponse.json(
        { error: "Event speaker not found" },
        { status: 404 }
      )
    }

    // Parse and validate the request body
    const body = await req.json()
    const validatedData = updateEventSpeakerSchema.parse(body)

    // Update the event speaker
    const updatedEventSpeaker = await sqlite.run(`UPDATE eventSpeaker SET({
      where: { id: params.id },
      data: {
        role: validatedData.role,
        order: validatedData.order,
      },
      include: {
        speaker: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return NextResponse.json(updatedEventSpeaker)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating event speaker:", error)
    return NextResponse.json(
      { error: "Failed to update event speaker" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the event speaker exists
    const existingEventSpeaker = await sqlite.get(`SELECT * FROM eventSpeaker WHERE({
      where: { id: params.id },
    })

    if (!existingEventSpeaker) {
      return NextResponse.json(
        { error: "Event speaker not found" },
        { status: 404 }
      )
    }

    // Delete the event speaker
    await sqlite.run(`DELETE FROM eventSpeaker WHERE({
      where: { id: params.id },
    })

    return NextResponse.json(
      { message: "Event speaker removed successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting event speaker:", error)
    return NextResponse.json(
      { error: "Failed to delete event speaker" },
      { status: 500 }
    )
  }
} 