import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    // Get the query parameter
    const url = new URL(request.url)
    const query = url.searchParams.get('query')
    
    let result
    
    if (query) {
      // Execute the custom query
      result = await db.$queryRawUnsafe(query)
    } else {
      // Default test query
      result = await db.$queryRaw`SELECT 1 as test`
    }
    
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      result
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 