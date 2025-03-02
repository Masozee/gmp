import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import { mkdir, access } from "fs/promises"
import { constants } from "fs"
import { cwd } from "process"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const speakerId = searchParams.get('speakerId')
    const eventId = searchParams.get('eventId')
    const sort = searchParams.get('sort') || 'startTime'
    const order = searchParams.get('order') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { abstract: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (speakerId) {
      where.speakerId = speakerId
    }

    if (eventId) {
      where.eventId = eventId
    }

    const presentations = await prisma.presentation.findMany({
      where,
      orderBy: {
        [sort]: order,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        speaker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
          }
        }
      }
    })

    // Get total count for pagination
    const totalPresentations = await prisma.presentation.count({ where })

    return NextResponse.json({ 
      presentations, 
      pagination: {
        total: totalPresentations,
        page,
        pageSize,
        totalPages: Math.ceil(totalPresentations / pageSize)
      }
    })
  } catch (error) {
    console.error("Failed to fetch presentations:", error)
    return NextResponse.json(
      { error: "Failed to fetch presentations" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const abstract = formData.get("abstract") as string
    const speakerId = formData.get("speakerId") as string
    const eventId = formData.get("eventId") as string
    const slides = formData.get("slides") as File | null
    const videoUrl = formData.get("videoUrl") as string
    const duration = formData.get("duration") ? parseInt(formData.get("duration") as string) : null
    const startTime = formData.get("startTime") as string
    const endTime = formData.get("endTime") as string

    // Validate required fields
    if (!title || !speakerId) {
      return NextResponse.json(
        { error: "Title and speaker ID are required" },
        { status: 400 }
      )
    }

    // Check if speaker exists
    const speaker = await prisma.speaker.findUnique({
      where: { id: speakerId },
    })

    if (!speaker) {
      return NextResponse.json(
        { error: "Speaker not found" },
        { status: 400 }
      )
    }

    // Check if event exists if provided
    if (eventId) {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
      })

      if (!event) {
        return NextResponse.json(
          { error: "Event not found" },
          { status: 400 }
        )
      }
    }

    // Handle slides upload
    let slidesUrl: string | undefined = undefined
    if (slides) {
      try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = join(cwd(), "public", "uploads")
        try {
          await access(uploadsDir, constants.F_OK)
        } catch (error) {
          await mkdir(uploadsDir, { recursive: true })
        }

        // Generate a unique filename for the slides
        const filename = `${Date.now()}-${Math.floor(Math.random() * 1000000000)}-${slides.name}`
        const filePath = join(uploadsDir, filename)
        
        // Write the file to disk
        const buffer = Buffer.from(await slides.arrayBuffer())
        await writeFile(filePath, buffer)
        
        // Set the slides URL (relative to /public)
        slidesUrl = `/uploads/${filename}`
      } catch (error) {
        console.error("Error uploading slides:", error)
      }
    }

    // Create the presentation
    const presentation = await prisma.presentation.create({
      data: {
        title,
        abstract,
        speakerId,
        eventId: eventId || null,
        slides: slidesUrl,
        videoUrl,
        duration,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
      },
      include: {
        speaker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
          }
        }
      }
    })

    return NextResponse.json(presentation)
  } catch (error) {
    console.error("Failed to create presentation:", error)
    return NextResponse.json(
      { error: "Failed to create presentation" },
      { status: 500 }
    )
  }
} 