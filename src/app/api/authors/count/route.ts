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

    const count = await sqlite.get(`SELECT COUNT(*) as count FROM profile()
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Failed to fetch profile count:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile count" },
      { status: 500 }
    )
  }
} 