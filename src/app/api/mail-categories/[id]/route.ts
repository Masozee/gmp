import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await db.mailCategory.findUnique({
      where: {
        id: params.id,
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
    console.error("Error fetching category:", error)
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
    const body = await request.json()
    
    // Check if category exists
    const existingCategory = await db.mailCategory.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Check if code is being changed and if it's already in use
    if (body.code && body.code !== existingCategory.code) {
      const codeExists = await db.mailCategory.findUnique({
        where: {
          code: body.code,
        },
      })

      if (codeExists) {
        return NextResponse.json(
          { error: "A category with this code already exists" },
          { status: 400 }
        )
      }
    }

    // Update category
    const updatedCategory = await db.mailCategory.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name,
        code: body.code,
        description: body.description,
      },
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Error updating category:", error)
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
    // Check if category exists
    const category = await db.mailCategory.findUnique({
      where: {
        id: params.id,
      },
      include: {
        mails: {
          take: 1, // We only need to know if there are any mails
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Check if category has mails
    if (category.mails.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with associated mails" },
        { status: 400 }
      )
    }

    // Delete category
    await db.mailCategory.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json(
      { message: "Category deleted successfully" }
    )
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
} 