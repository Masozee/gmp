import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import { cwd } from "process"

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

    const publication = await prisma.publication.findUnique({
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

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const content = formData.get("content") as string
    const status = formData.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED"
    const coverImage = formData.get("coverImage") as File | null
    const coverCredit = formData.get("coverCredit") as string

    // Get author IDs from form data
    const authorIds: string[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("authors[") && key.endsWith("]")) {
        authorIds.push(value as string)
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
    const publication = await prisma.publication.update({
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

    await prisma.publication.delete({
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