import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Fetch categories with publication counts
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            publications: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Format the response
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      count: category._count.publications
    }))

    return NextResponse.json({ 
      success: true,
      data: formattedCategories
    })
  } catch (error) {
    console.error("Failed to fetch publication categories count:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch publication categories count" 
      },
      { status: 500 }
    )
  }
} 