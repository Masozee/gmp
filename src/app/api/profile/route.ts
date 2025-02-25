import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (!session.user.email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      )
    }

    // Fetch the user's profile
    const profile = await prisma.profile.findFirst({
      where: {
        email: {
          equals: session.user.email,
          mode: "insensitive",
        },
      },
    })

    // Return profile data or default values
    return NextResponse.json({
      email: session.user.email,
      name: profile ? `${profile.firstName} ${profile.lastName}` : null,
      image: profile?.photoUrl || null,
    })
  } catch (error) {
    console.error("Failed to fetch profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
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

    if (!session.user.email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { firstName, lastName, photoUrl } = body

    // First find the profile
    const existingProfile = await prisma.profile.findFirst({
      where: {
        email: {
          equals: session.user.email,
          mode: "insensitive",
        },
      },
    })

    if (!existingProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Update profile data
    const profile = await prisma.profile.update({
      where: {
        id: existingProfile.id,
      },
      data: {
        firstName,
        lastName,
        photoUrl,
      },
    })

    return NextResponse.json({
      email: session.user.email,
      name: `${profile.firstName} ${profile.lastName}`,
      image: profile.photoUrl,
    })
  } catch (error) {
    console.error("Failed to update profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
} 