import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"
import { writeFile, unlink } from "fs/promises"
import { join } from "path"
import { cwd } from "process"
import { mkdir, access } from "fs/promises"
import { constants } from "fs"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const speaker = await prisma.speaker.findUnique({
      where: { id: params.id },
      include: {
        events: {
          include: {
            event: true
          },
          orderBy: {
            event: {
              startDate: 'desc'
            }
          }
        },
        presentations: {
          orderBy: {
            startTime: 'desc'
          }
        },
        _count: {
          select: {
            events: true,
            presentations: true
          }
        }
      }
    })

    if (!speaker) {
      return NextResponse.json(
        { error: "Speaker not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(speaker)
  } catch (error) {
    console.error("Failed to fetch speaker:", error)
    return NextResponse.json(
      { error: "Failed to fetch speaker" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if the speaker exists
    const existingSpeaker = await prisma.speaker.findUnique({
      where: { id: params.id },
    })

    if (!existingSpeaker) {
      return NextResponse.json(
        { error: "Speaker not found" },
        { status: 404 }
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

    // If email is being changed, check if it's already in use
    if (email && email !== existingSpeaker.email) {
      const emailExists = await prisma.speaker.findFirst({
        where: { 
          email,
          id: { not: params.id }
        },
      })

      if (emailExists) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        )
      }
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
        
        // Delete old photo if exists
        if (existingSpeaker.photoUrl && existingSpeaker.photoUrl.startsWith('/uploads/')) {
          try {
            const oldFilePath = join(cwd(), "public", existingSpeaker.photoUrl)
            await unlink(oldFilePath)
          } catch (error) {
            console.error("Error deleting old photo:", error)
          }
        }
      } catch (error) {
        console.error("Error uploading photo:", error)
      }
    }

    // Update the speaker in the database
    const updateData: any = {
      updatedAt: new Date(),
    }
    
    if (firstName) updateData.firstName = firstName
    if (lastName) updateData.lastName = lastName
    if (email) updateData.email = email
    if (organization !== undefined) updateData.organization = organization
    if (position !== undefined) updateData.position = position
    if (bio !== undefined) updateData.bio = bio
    if (photoUrl) updateData.photoUrl = photoUrl

    const speaker = await prisma.speaker.update({
      where: { id: params.id },
      data: updateData,
      include: {
        _count: {
          select: {
            events: true,
            presentations: true
          }
        }
      }
    })

    return NextResponse.json(speaker)
  } catch (error) {
    console.error("Failed to update speaker:", error)
    return NextResponse.json(
      { error: "Failed to update speaker" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if the speaker exists
    const existingSpeaker = await prisma.speaker.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            events: true,
            presentations: true
          }
        }
      }
    })

    if (!existingSpeaker) {
      return NextResponse.json(
        { error: "Speaker not found" },
        { status: 404 }
      )
    }

    // Check if there are events or presentations linked to this speaker
    if (existingSpeaker._count.events > 0 || existingSpeaker._count.presentations > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete speaker with associated events or presentations",
          eventsCount: existingSpeaker._count.events,
          presentationsCount: existingSpeaker._count.presentations
        },
        { status: 400 }
      )
    }

    // Delete the speaker
    await prisma.speaker.delete({
      where: { id: params.id },
    })

    // Delete photo if exists
    if (existingSpeaker.photoUrl && existingSpeaker.photoUrl.startsWith('/uploads/')) {
      try {
        const filePath = join(cwd(), "public", existingSpeaker.photoUrl)
        await unlink(filePath)
      } catch (error) {
        console.error("Error deleting photo:", error)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete speaker:", error)
    return NextResponse.json(
      { error: "Failed to delete speaker" },
      { status: 500 }
    )
  }
} 