import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-auth"
import { prisma } from "@/lib/prisma"
import { UserCategory } from "@prisma/client"

export async function POST(
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

    const userId = params.id
    const body = await request.json()
    const { profileId, createProfile } = body

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // If user already has a profile, return error
    if (user.profile) {
      return NextResponse.json(
        { error: "User already has a profile", profile: user.profile },
        { status: 400 }
      )
    }

    let updatedUser

    if (profileId) {
      // Connect to existing profile
      const profile = await prisma.profile.findUnique({
        where: { id: profileId }
      })

      if (!profile) {
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        )
      }

      // Check if profile is already connected to another user
      if (profile.userId) {
        return NextResponse.json(
          { error: "Profile is already connected to another user" },
          { status: 400 }
        )
      }

      // Connect profile to user
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          profile: {
            connect: { id: profileId }
          }
        },
        include: { profile: true }
      })
    } else if (createProfile) {
      // Create new profile for user
      const { firstName, lastName, email, phoneNumber, organization, bio, category } = createProfile

      // Validate required fields
      if (!firstName || !lastName || !email || !category) {
        return NextResponse.json(
          { error: "Missing required profile fields" },
          { status: 400 }
        )
      }

      // Check if email is already used in another profile
      const existingProfile = await prisma.profile.findUnique({
        where: { email }
      })

      if (existingProfile) {
        return NextResponse.json(
          { error: "Email is already used in another profile" },
          { status: 400 }
        )
      }

      // Create new profile and connect to user
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          profile: {
            create: {
              firstName,
              lastName,
              email,
              phoneNumber,
              organization,
              bio,
              category: category as UserCategory
            }
          }
        },
        include: { profile: true }
      })
    } else {
      return NextResponse.json(
        { error: "Either profileId or createProfile must be provided" },
        { status: 400 }
      )
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Failed to connect profile:", error)
    return NextResponse.json(
      { error: "Failed to connect profile" },
      { status: 500 }
    )
  }
} 