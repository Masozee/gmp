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
    const sort = searchParams.get('sort') || 'lastName'
    const order = searchParams.get('order') || 'asc'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    const where: any = {}

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { organization: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
      ]
    }

    const speakers = await prisma.speaker.findMany({
      where,
      orderBy: {
        [sort]: order,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        _count: {
          select: {
            events: true,
            presentations: true
          }
        }
      }
    })

    // Get total count for pagination
    const totalSpeakers = await prisma.speaker.count({ where })

    return NextResponse.json({ 
      speakers, 
      pagination: {
        total: totalSpeakers,
        page,
        pageSize,
        totalPages: Math.ceil(totalSpeakers / pageSize)
      }
    })
  } catch (error) {
    console.error("Failed to fetch speakers:", error)
    return NextResponse.json(
      { error: "Failed to fetch speakers" },
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
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const organization = formData.get("organization") as string
    const position = formData.get("position") as string
    const bio = formData.get("bio") as string
    const photo = formData.get("photo") as File | null

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required" },
        { status: 400 }
      )
    }

    // Check if email is already in use
    const existingSpeaker = await prisma.speaker.findUnique({
      where: { email },
    })

    if (existingSpeaker) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      )
    }

    // Handle photo upload
    let photoUrl: string | undefined = undefined
    if (photo) {
      try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = join(cwd(), "public", "uploads")
        try {
          await access(uploadsDir, constants.F_OK)
        } catch (error) {
          await mkdir(uploadsDir, { recursive: true })
        }

        // Generate a unique filename for the photo
        const filename = `${Date.now()}-${Math.floor(Math.random() * 1000000000)}-${photo.name}`
        const filePath = join(uploadsDir, filename)
        
        // Write the file to disk
        const buffer = Buffer.from(await photo.arrayBuffer())
        await writeFile(filePath, buffer)
        
        // Set the photo URL (relative to /public)
        photoUrl = `/uploads/${filename}`
      } catch (error) {
        console.error("Error uploading photo:", error)
      }
    }

    // Create the speaker
    const speaker = await prisma.speaker.create({
      data: {
        firstName,
        lastName,
        email,
        organization,
        position,
        bio,
        photoUrl,
      },
    })

    return NextResponse.json(speaker)
  } catch (error) {
    console.error("Failed to create speaker:", error)
    return NextResponse.json(
      { error: "Failed to create speaker" },
      { status: 500 }
    )
  }
} 