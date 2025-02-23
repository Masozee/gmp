import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()

    // Only allow admins to access logs
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Only administrators can access logs" },
        { status: 403 }
      )
    }

    const searchParams = req.nextUrl.searchParams
    const severity = searchParams.get("severity")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const userId = searchParams.get("userId") || undefined

    const logs = await prisma.$transaction(async (tx) => {
      return await tx.$queryRaw`
        SELECT 
          e.id,
          e.path,
          e.method,
          e.message,
          e.severity,
          e.created_at as "createdAt",
          e.user_id as "userId",
          u.email as "userEmail"
        FROM error_logs e
        LEFT JOIN users u ON e.user_id = u.id
        WHERE (${severity}::text IS NULL OR e.severity::text = ${severity}::text)
          AND (${userId}::text IS NULL OR e.user_id = ${userId}::text)
        ORDER BY e.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching logs:", error)
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

    const errorLog = await prisma.errorLog.create({
      data: {
        userId: session?.user?.id,
        path: body.path,
        method: body.method,
        message: body.message,
        stack: body.stack,
        severity: body.severity || ErrorSeverity.ERROR,
        metadata: body.metadata || {},
      },
    })

    return NextResponse.json(errorLog)
  } catch (error) {
    console.error("Error creating log:", error)
    return NextResponse.json(
      { error: "Failed to create error log" },
      { status: 500 }
    )
  }
} 