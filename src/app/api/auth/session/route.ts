import { NextRequest, NextResponse } from "next/server"
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

    return NextResponse.json({
      user: session.user,
    })
  } catch (error) {
    console.error("Failed to get session:", error)
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    )
  }
} 