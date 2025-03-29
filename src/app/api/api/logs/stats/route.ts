import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()

    // Check if user is authenticated
    if (!session?.user) {
      console.log("[Logs Stats API] Unauthorized - No session")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Only allow admins to access all logs, users can only see their own
    const isAdmin = session.user.role === "ADMIN"
    const userId = isAdmin ? undefined : session.user.id

    console.log("[Logs Stats API] Fetching stats for user:", session.user.email)

    // Get counts for each severity level
    const [total, critical, error, warning, info] = await Promise.all([
      prisma.errorLog.count({
        where: userId ? { userId } : undefined,
      }),
      prisma.errorLog.count({
        where: {
          severity: "CRITICAL",
          ...(userId && { userId }),
        },
      }),
      prisma.errorLog.count({
        where: {
          severity: "ERROR",
          ...(userId && { userId }),
        },
      }),
      prisma.errorLog.count({
        where: {
          severity: "WARNING",
          ...(userId && { userId }),
        },
      }),
      prisma.errorLog.count({
        where: {
          severity: "INFO",
          ...(userId && { userId }),
        },
      }),
    ])

    const stats = {
      total,
      critical,
      error,
      warning,
      info,
    }

    console.log("[Logs Stats API] Stats:", stats)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[Logs Stats API] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch log statistics" },
      { status: 500 }
    )
  }
} 