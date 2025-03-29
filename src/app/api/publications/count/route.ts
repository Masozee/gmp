import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
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

    const count = await sqlite.get(`SELECT COUNT(*) as count FROM publication()
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Failed to fetch publication count:", error)
    return NextResponse.json(
      { error: "Failed to fetch publication count" },
      { status: 500 }
    )
  }
} 