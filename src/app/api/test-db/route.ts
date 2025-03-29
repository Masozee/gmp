import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { Prisma } from "@prisma/client"

// Helper function to handle BigInt serialization
const serializeData = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }
  
  if (typeof data === 'bigint') {
    return data.toString();
  }
  
  if (Array.isArray(data)) {
    return data.map(serializeData);
  }
  
  if (typeof data === 'object') {
    return Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = serializeData(value);
      return acc;
    }, {} as Record<string, any>);
  }
  
  return data;
};

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
    
    // Serialize the result to handle BigInt
    const serializedResult = serializeData(result);
    
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      result: serializedResult
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