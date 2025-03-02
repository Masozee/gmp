import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const count = await prisma.profile.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Failed to fetch profile count:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile count" },
      { status: 500 }
    )
  }
} 