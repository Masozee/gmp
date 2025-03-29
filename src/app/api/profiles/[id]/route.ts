import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-auth"
import prisma from "@/lib/prisma"
import { writeFile, unlink } from "fs/promises"
import { join } from "path"
import { cwd } from "process"

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

    const profileId = params.id

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
          }
        }
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Failed to fetch profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
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

    const profile = await prisma.profile.findUnique({
      where: { id: params.id },
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phoneNumber = formData.get("phoneNumber") as string | null
    const organization = formData.get("organization") as string | null
    const bio = formData.get("bio") as string | null
    const category = formData.get("category") as "AUTHOR" | "BOARD" | "STAFF" | "RESEARCHER"
    const photo = formData.get("photo") as File | null

    let photoUrl = profile.photoUrl

    if (photo) {
      // Delete old photo if it exists
      if (profile.photoUrl) {
        const oldPhotoPath = join(cwd(), "public", profile.photoUrl.replace(/^\/uploads\//, ""))
        try {
          await unlink(oldPhotoPath)
        } catch (error) {
          console.error("Failed to delete old photo:", error)
        }
      }

      // Upload new photo
      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
      const filename = `${uniqueSuffix}-${photo.name}`
      const uploadDir = join(cwd(), "public", "uploads")
      const filepath = join(uploadDir, filename)

      await writeFile(filepath, buffer)
      photoUrl = `/uploads/${filename}`
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: params.id },
      data: {
        firstName,
        lastName,
        email,
        phoneNumber: phoneNumber || undefined,
        organization: organization || undefined,
        bio: bio || undefined,
        category,
        photoUrl,
      },
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error("Failed to update profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
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

    const profile = await prisma.profile.findUnique({
      where: { id: params.id },
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Delete photo if it exists
    if (profile.photoUrl) {
      const photoPath = join(cwd(), "public", profile.photoUrl.replace(/^\/uploads\//, ""))
      try {
        await unlink(photoPath)
      } catch (error) {
        console.error("Failed to delete photo:", error)
      }
    }

    await prisma.profile.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Profile deleted successfully" })
  } catch (error) {
    console.error("Failed to delete profile:", error)
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    )
  }
} 