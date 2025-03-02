import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"
import slugify from "slugify"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "name"
    const order = searchParams.get("order") || "asc"

    const tags = await db.tag.findMany({
      where: {
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: {
        [sort]: order,
      },
    })

    return NextResponse.json(tags)
  } catch (error) {
    console.error("Failed to fetch tags:", error)
    return NextResponse.json(
      { error: "Failed to fetch tags" },
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

    const body = await request.json()
    const { name } = body

    // Generate slug from name
    const slug = slugify(name, { lower: true, strict: true })

    // Check if tag already exists
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: "insensitive" } },
          { slug: { equals: slug, mode: "insensitive" } },
        ],
      },
    })

    if (existingTag) {
      return NextResponse.json(
        { error: "Tag already exists" },
        { status: 400 }
      )
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
      },
    })

    return NextResponse.json(tag)
  } catch (error) {
    console.error("Failed to create tag:", error)
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    )
  }
} 