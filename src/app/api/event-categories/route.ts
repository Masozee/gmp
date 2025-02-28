import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"
import slugify from "slugify"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'name'
    const order = searchParams.get('order') || 'asc'

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const categories = await prisma.eventCategory.findMany({
      where,
      orderBy: {
        [sort]: order,
      },
      include: {
        _count: {
          select: {
            events: true
          }
        }
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Failed to fetch event categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch event categories" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const json = await request.json()
    const { name, description } = json

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    // Generate a unique slug based on the name
    let slug = slugify(name, { lower: true, strict: true })
    
    // Check if slug exists
    const existingCategory = await prisma.eventCategory.findUnique({
      where: { slug },
    })

    // If slug exists, append a unique timestamp
    if (existingCategory) {
      slug = `${slug}-${Date.now()}`
    }

    const category = await prisma.eventCategory.create({
      data: {
        name,
        slug,
        description,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Failed to create event category:", error)
    return NextResponse.json(
      { error: "Failed to create event category" },
      { status: 500 }
    )
  }
} 