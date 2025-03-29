import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import sqlite from "@/lib/sqlite"
import { writeFile, unlink } from "fs/promises"
import { join } from "path"
import { cwd } from "process"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const profile = await sqlite.get(`SELECT * FROM profile WHERE({
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

    const updatedProfile = await sqlite.run(`UPDATE profile SET({
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
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const profile = await sqlite.get(`SELECT * FROM profile WHERE({
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

    await sqlite.run(`DELETE FROM profile WHERE({
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