import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    
    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
      ]
    }
    
    // Get categories
    const categories = await db.mailCategory.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    })
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching mail categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch mail categories" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.code) {
      return NextResponse.json(
        { error: "Name and code are required" },
        { status: 400 }
      )
    }
    
    // Check if code already exists
    const existingCategory = await db.mailCategory.findUnique({
      where: {
        code: body.code,
      },
    })
    
    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this code already exists" },
        { status: 400 }
      )
    }
    
    // Create category
    const category = await db.mailCategory.create({
      data: {
        name: body.name,
        code: body.code,
        description: body.description || null,
      },
    })
    
    return NextResponse.json(category)
  } catch (error) {
    console.error("Error creating mail category:", error)
    return NextResponse.json(
      { error: "Failed to create mail category" },
      { status: 500 }
    )
  }
} 