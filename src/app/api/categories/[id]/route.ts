import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const category = await sqlite.get(`SELECT * FROM category WHERE({
      where: { id: params.id },
      include: {
        publications: {
          include: {
            publication: {
              include: {
                authors: {
                  include: {
                    profile: {
                      select: {
                        firstName: true,
                        lastName: true,
                        photoUrl: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            publications: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Failed to fetch category:", error)
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const category = await sqlite.run(`UPDATE category SET({
      where: { id: params.id },
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
    console.error("Failed to update category:", error)
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await sqlite.run(`DELETE FROM category WHERE({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
} 