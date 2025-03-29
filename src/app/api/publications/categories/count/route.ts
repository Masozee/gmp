import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
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

    const categories = await prisma.publication.groupBy({
      by: ['category'],
      _count: {
        _all: true
      },
      orderBy: {
        _count: {
          _all: 'desc'
        }
      }
    })

    const formattedCategories = categories.map(category => ({
      name: category.category,
      count: category._count._all
    }))

    return NextResponse.json({ categories: formattedCategories })
  } catch (error) {
    console.error("Failed to fetch publication categories count:", error)
    return NextResponse.json(
      { error: "Failed to fetch publication categories count" },
      { status: 500 }
    )
  }
} 