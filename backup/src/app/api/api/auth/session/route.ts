import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        data: null,
        error: "Unauthorized"
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      data: { user: session.user },
      message: "Session retrieved successfully"
    }, { status: 200 })
  } catch (error) {
    console.error("Failed to get session:", error)
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to get session"
    }, { status: 500 })
  }
} 