import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
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

    const body = await request.json()
    const { firstName, lastName, email, phoneNumber, organization, bio, category } = body

    // Check if email is already in use by another profile
    const existingProfile = await prisma.profile.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive"
        },
        NOT: {
          id: params.id
        }
      }
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: "A profile with this email already exists" },
        { status: 400 }
      )
    }

    const profile = await prisma.profile.update({
      where: { id: params.id },
      data: {
        firstName,
        lastName,
        email,
        phoneNumber: phoneNumber || null,
        organization: organization || null,
        bio: bio || null,
        category,
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

    await prisma.profile.delete({
      where: { id: params.id },
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