import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"

export async function GET(request: NextRequest) {
  try {
    // Temporarily disable auth check for development
    // const session = await getServerSession()
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   )
    // }

    const searchParams = new URL(request.url).searchParams
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "name"
    const order = searchParams.get("order") || "asc"

    const categories = await sqlite.all(`SELECT * FROM category({
      where: {
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        _count: {
          select: {
            publications: true,
          },
        },
      },
      orderBy: {
        [sort]: order,
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    const category = await sqlite.run(`INSERT INTO category({
      data: {
        name,
        slug,
        description,
      },
      include: {
        _count: {
          select: {
            publications: true,
          },
        },
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Failed to create category:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
} 