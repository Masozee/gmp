import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"
import { writeFile, unlink, mkdir } from "fs/promises"
import { join } from "path"
import { cwd } from "process"
import { existsSync } from "fs"

export async function GET(request: NextRequest) {
  try {
    // Extract id from path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    const profile = await prisma.profile.findUnique({
      where: { id },
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Failed to fetch author:", error)
    return NextResponse.json(
      { error: "Failed to fetch author" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Extract id from path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    const formData = await request.formData()
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phoneNumber = formData.get("phoneNumber") as string | null
    const organization = formData.get("organization") as string | null
    const bio = formData.get("bio") as string | null
    const category = formData.get("category") as "AUTHOR" | "BOARD" | "STAFF" | "RESEARCHER"
    const photo = formData.get("photo") as File | null

    // Check if email is already in use by another profile
    const existingProfile = await prisma.profile.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive"
        },
        NOT: {
          id
        }
      }
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: "A profile with this email already exists" },
        { status: 400 }
      )
    }

    let photoUrl = undefined

    // Handle photo upload if provided
    if (photo) {
      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create uploads directory if it doesn't exist
      const uploadDir = join(cwd(), "public", "uploads")
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }
      
      // Generate unique filename
      const uniqueFilename = `${Date.now()}-${photo.name.replace(/\s+/g, "-")}`;
      const imagePath = join(uploadDir, uniqueFilename)
      
      // Save the file
      await writeFile(imagePath, buffer)
      
      // Set the photoUrl to be saved in the database
      photoUrl = `/uploads/${uniqueFilename}`

      // Delete old photo if exists
      const currentProfile = await prisma.profile.findUnique({
        where: { id },
        select: { photoUrl: true }
      })

      if (currentProfile?.photoUrl) {
        try {
          const oldPhotoPath = join(cwd(), "public", currentProfile.photoUrl)
          await unlink(oldPhotoPath)
        } catch (error) {
          console.error("Failed to delete old photo:", error)
        }
      }
    }

    const profile = await prisma.profile.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phoneNumber: phoneNumber || null,
        organization: organization || null,
        bio: bio || null,
        category,
        ...(photoUrl && { photoUrl }),
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Failed to update profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Extract id from path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    await prisma.profile.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete profile:", error)
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    )
  }
} 