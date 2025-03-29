import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import { cwd } from "process"

// PublicationStatus enum
export enum PublicationStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}



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

    const publication = await sqlite.get(`SELECT * FROM publication WHERE({
      where: { id: params.id },
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
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        files: true,
      },
    })

    if (!publication) {
      return NextResponse.json(
        { error: "Publication not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(publication)
  } catch (error) {
    console.error("Failed to fetch publication:", error)
    return NextResponse.json(
      { error: "Failed to fetch publication" },
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

    // Check if the request is JSON
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      // Handle JSON request (for status updates)
      const json = await request.json();
      
      if (json.status) {
        // This is a status-only update
        const updatedPublication = await sqlite.run(`UPDATE publication SET({
          where: { id: params.id },
          data: {
            status: json.status as PublicationStatus,
          },
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
            categories: {
              include: {
                category: true,
              },
            },
            files: true,
          },
        });
        
        return NextResponse.json(updatedPublication);
      }
    }

    // Handle form data (for full publication updates)
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const content = formData.get("content") as string
    const status = formData.get("status") as PublicationStatus
    const coverImage = formData.get("coverImage") as File | null
    const coverCredit = formData.get("coverCredit") as string

    // Get author IDs from form data
    const authorIds: string[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("authors[") && key.endsWith("]")) {
        authorIds.push(value as string)
      }
    }

    // Get category IDs from form data
    const categoryIds: string[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("categories[") && key.endsWith("]")) {
        categoryIds.push(value as string)
      }
    }

    let coverImageUrl: string | undefined

    // Handle cover image upload if provided
    if (coverImage) {
      const bytes = await coverImage.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
      const filename = `${uniqueSuffix}-${coverImage.name}`
      const uploadDir = join(cwd(), "public", "uploads")
      const filepath = join(uploadDir, filename)

      await writeFile(filepath, buffer)
      coverImageUrl = `/uploads/${filename}`
    }

    // Update the publication
    const publication = await sqlite.run(`UPDATE publication SET({
      where: { id: params.id },
      data: {
        title,
        description,
        content,
        status,
        ...(coverImageUrl && { coverImage: coverImageUrl }),
        coverCredit,
        // Update authors if provided
        ...(authorIds.length > 0 && {
          authors: {
            deleteMany: {},
            create: authorIds.map((authorId, index) => ({
              order: index + 1,
              profileId: authorId,
            })),
          },
        }),
        // Update categories if provided
        ...(categoryIds.length > 0 && {
          categories: {
            deleteMany: {},
            create: categoryIds.map((categoryId) => ({
              assignedAt: new Date(),
              category: {
                connect: { id: categoryId },
              },
            })),
          },
        }),
      },
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
        categories: {
          include: {
            category: true,
          },
        },
        files: true,
      },
    })

    return NextResponse.json(publication)
  } catch (error) {
    console.error("Failed to update publication:", error)
    return NextResponse.json(
      { error: "Failed to update publication" },
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

    await sqlite.run(`DELETE FROM publication WHERE({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete publication:", error)
    return NextResponse.json(
      { error: "Failed to delete publication" },
      { status: 500 }
    )
  }
} 