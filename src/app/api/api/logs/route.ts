import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()

    // Check if user is authenticated
    if (!session?.user) {
      console.log("[Logs API] Unauthorized - No session")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Only allow admins to access all logs, users can only see their own
    const isAdmin = session.user.role === "ADMIN"
    console.log("[Logs API] User role:", session.user.role)

    const searchParams = req.nextUrl.searchParams
    const severity = searchParams.get("severity")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const userId = isAdmin ? searchParams.get("userId") : session.user.id

    console.log("[Logs API] Fetching logs with params:", {
      severity,
      limit,
      offset,
      userId,
    })

    const logs = await prisma.errorLog.findMany({
      where: {
        ...(severity && { severity }),
        ...(userId && { userId }),
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })

    console.log("[Logs API] Found", logs.length, "logs")

    return NextResponse.json(logs)
  } catch (error) {
    console.error("[Logs API] Error fetching logs:", error)
    return NextResponse.json(
      { error: "Failed to fetch error logs" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    const body = await req.json()

    console.log("[Logs API] Creating log entry:", {
      userId: session?.user?.id,
      path: body.path,
      method: body.method,
      severity: body.severity,
    })

    const errorLog = await prisma.errorLog.create({
      data: {
        userId: session?.user?.id,
        path: body.path,
        method: body.method,
        message: body.message,
        stack: body.stack,
        severity: body.severity || "ERROR",
        metadata: body.metadata || {},
      },
    })

    console.log("[Logs API] Created log entry:", errorLog.id)

    return NextResponse.json(errorLog)
  } catch (error) {
    console.error("[Logs API] Error creating log:", error)
    return NextResponse.json(
      { error: "Failed to create error log" },
      { status: 500 }
    )
  }
} 