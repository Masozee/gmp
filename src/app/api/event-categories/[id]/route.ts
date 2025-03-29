import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"
import slugify from "slugify"

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

    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      )
    }

    const category = await sqlite.get(`SELECT * FROM eventCategory WHERE({
      where: { id },
      include: {
        _count: {
          select: {
            events: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Failed to fetch event category:", error)
    return NextResponse.json(
      { error: "Failed to fetch event category" },
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

    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
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

    // Check if category exists
    const existingCategory = await sqlite.get(`SELECT * FROM eventCategory WHERE({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // If name changed, update the slug too
    let updateData: any = {
      name,
      description,
    }

    if (name !== existingCategory.name) {
      let slug = slugify(name, { lower: true, strict: true })
      
      // Check if slug exists for another category
      const slugExists = await sqlite.get(`SELECT * FROM eventCategory({
        where: { 
          slug,
          id: { not: id }
        },
      })

      // If slug exists for another category, append a unique timestamp
      if (slugExists) {
        slug = `${slug}-${Date.now()}`
      }

      updateData.slug = slug
    }

    const updatedCategory = await sqlite.run(`UPDATE eventCategory SET({
      where: { id },
      data: updateData
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Failed to update event category:", error)
    return NextResponse.json(
      { error: "Failed to update event category" },
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

    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      )
    }

    // Check if category exists
    const category = await sqlite.get(`SELECT * FROM eventCategory WHERE({
      where: { id },
      include: {
        events: true
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Check if category has events
    if (category.events.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with associated events" },
        { status: 400 }
      )
    }

    await sqlite.run(`DELETE FROM eventCategory WHERE({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete event category:", error)
    return NextResponse.json(
      { error: "Failed to delete event category" },
      { status: 500 }
    )
  }
} 