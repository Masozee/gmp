import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"
import slugify from "slugify"
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
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'startDate'
    const order = searchParams.get('order') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (category) {
      where.categoryId = category
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        speakers: {
          include: {
            speaker: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                photoUrl: true,
              },
            },
          },
          orderBy: {
            order: 'asc'
          }
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        [sort]: order,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    // Get total count for pagination
    const totalEvents = await prisma.event.count({ where })

    return NextResponse.json({ 
      events, 
      pagination: {
        total: totalEvents,
        page,
        pageSize,
        totalPages: Math.ceil(totalEvents / pageSize)
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
    const description = formData.get("description") as string
    const content = formData.get("content") as string
    const status = formData.get("status") as "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED"
    const posterImage = formData.get("posterImage") as File | null
    const posterCredit = formData.get("posterCredit") as string
    const startDate = formData.get("startDate") as string
    const endDate = formData.get("endDate") as string
    const location = formData.get("location") as string
    const venue = formData.get("venue") as string
    const categoryId = formData.get("categoryId") as string
    const published = formData.get("published") === "true"
    
    // Get speaker IDs from form data
    const speakerIds: { id: string, order: number, role?: string }[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("speakers[") && key.endsWith("][id]")) {
        const match = key.match(/speakers\[(\d+)\]\[id\]/)
        if (match) {
          const index = parseInt(match[1])
          const role = formData.get(`speakers[${index}][role]`) as string | undefined
          speakerIds.push({ 
            id: value as string, 
            order: index + 1,
            role
          })
        }
      }
    }

    // Get tag IDs from form data
    const tagIds: string[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("tags[") && key.endsWith("]")) {
        tagIds.push(value as string)
      }
    }

    // Generate a unique slug based on the title
    let slug = slugify(title, { lower: true, strict: true })
    
    // Check if slug exists
    const existingEvent = await prisma.event.findUnique({
      where: { slug },
    })

    // If slug exists, append a unique timestamp
    if (existingEvent) {
      slug = `${slug}-${Date.now()}`
    }

    // Handle poster image upload
    let posterImageUrl: string | undefined = undefined
    if (posterImage) {
      try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = join(cwd(), "public", "uploads")
        try {
          await access(uploadsDir, constants.F_OK)
        } catch (error) {
          await mkdir(uploadsDir, { recursive: true })
        }

        // Generate a unique filename for the poster image
        const filename = `${Date.now()}-${Math.floor(Math.random() * 1000000000)}-${posterImage.name}`
        const filePath = join(uploadsDir, filename)
        
        // Write the file to disk
        const buffer = Buffer.from(await posterImage.arrayBuffer())
        await writeFile(filePath, buffer)
        
        // Set the poster image URL (relative to /public)
        posterImageUrl = `/uploads/${filename}`
      } catch (error) {
        console.error("Error uploading poster image:", error)
      }
    }

    // Create the event in the database
    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        content,
        status: status || "UPCOMING",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        venue,
        posterImage: posterImageUrl,
        posterCredit,
        published,
        categoryId,
        speakers: {
          create: speakerIds.map(({ id, order, role }) => ({
            speakerId: id,
            order,
            role
          }))
        },
        tags: {
          create: tagIds.map(tagId => ({
            tagId
          }))
        }
      },
      include: {
        category: true,
        speakers: {
          include: {
            speaker: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("Failed to create event:", error)
    return NextResponse.json(
      { error: "Failed to create event", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 