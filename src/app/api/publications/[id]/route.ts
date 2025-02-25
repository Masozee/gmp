import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
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

    const body = await request.json()
    const {
      title,
      description,
      content,
      status,
      coverImage,
      coverCredit,
      authors,
      tags,
      images,
    } = body

    // Update the publication
    const publication = await prisma.publication.update({
      where: { id: params.id },
      data: {
        title,
        description,
        content,
        status,
        coverImage,
        coverCredit,
        // Update authors if provided
        ...(authors && {
          authors: {
            deleteMany: {},
            create: authors.map((author: any, index: number) => ({
              order: index + 1,
              profileId: author.profileId,
            })),
          },
        }),
        // Update tags if provided
        ...(tags && {
          tags: {
            deleteMany: {},
            create: tags.map((tagId: string) => ({
              tagId,
            })),
          },
        }),
        // Update images if provided
        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((image: any) => ({
              url: image.url,
              alt: image.alt,
              credit: image.credit,
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
        tags: {
          include: {
            tag: true,
          },
        },
        images: true,
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