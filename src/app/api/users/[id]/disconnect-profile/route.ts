import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-auth"
import prisma from "@/lib/prisma"

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

    // If user doesn't have a profile, return error
    if (!user.profile) {
      return NextResponse.json(
        { error: "User doesn't have a profile" },
        { status: 400 }
      )
    }

    // Disconnect profile from user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          disconnect: true
        }
      },
      include: { profile: true }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Failed to disconnect profile:", error)
    return NextResponse.json(
      { error: "Failed to disconnect profile" },
      { status: 500 }
    )
  }
} 