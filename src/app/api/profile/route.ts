import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-auth"
import sqlite from "@/lib/sqlite"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const profile = await sqlite.get(`SELECT * FROM profile({
      where: {
        email: {
          equals: session.user.email,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        photoUrl: true,
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      email: profile.email,
      name: `${profile.firstName} ${profile.lastName}`.trim(),
      image: profile.photoUrl,
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
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
    const existingProfile = await sqlite.get(`SELECT * FROM profile({
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
    const profile = await sqlite.run(`UPDATE profile SET({
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