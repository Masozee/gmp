import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"
import { writeFile, unlink } from "fs/promises"
import { join } from "path"
import { cwd } from "process"

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

    const person = await prisma.profile.findUnique({
      where: { id: params.id },
    })

    if (!person) {
      return NextResponse.json(
        { error: "Person not found" },
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

    let photoUrl = person.photoUrl

    if (photo) {
      // Delete old photo if it exists
      if (person.photoUrl) {
        const oldPhotoPath = join(cwd(), "public", person.photoUrl.replace(/^\/uploads\//, ""))
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

    const updatedPerson = await prisma.profile.update({
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

    return NextResponse.json(updatedPerson)
  } catch (error) {
    console.error("Failed to update person:", error)
    return NextResponse.json(
      { error: "Failed to update person" },
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

    const person = await prisma.profile.findUnique({
      where: { id: params.id },
    })

    if (!person) {
      return NextResponse.json(
        { error: "Person not found" },
        { status: 404 }
      )
    }

    // Delete photo if it exists
    if (person.photoUrl) {
      const photoPath = join(cwd(), "public", person.photoUrl.replace(/^\/uploads\//, ""))
      try {
        await unlink(photoPath)
      } catch (error) {
        console.error("Failed to delete photo:", error)
      }
    }

    await prisma.profile.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete person:", error)
    return NextResponse.json(
      { error: "Failed to delete person" },
      { status: 500 }
    )
  }
} 