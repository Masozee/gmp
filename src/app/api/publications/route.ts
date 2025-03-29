import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"
import slugify from "slugify"
import { writeFile } from "fs/promises"
import { join } from "path"
import { cwd } from "process"

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
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'updatedAt'
    const order = searchParams.get('order') || 'desc'

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (category) {
      where.category = category
    }

    const publications = await prisma.publication.findMany({
      where,
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
      orderBy: {
        [sort]: order,
      },
    })

    return NextResponse.json({ publications })
  } catch (error) {
    console.error("Failed to fetch publications:", error)
    return NextResponse.json(
      { error: "Failed to fetch publications" },
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

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const content = formData.get("content") as string
    const status = formData.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED"
    const coverImage = formData.get("coverImage") as File | null
    const coverCredit = formData.get("coverCredit") as string
    const files = formData.getAll("files") as File[]
    
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

    if (authorIds.length === 0) {
      return NextResponse.json(
        { error: "At least one author is required" },
        { status: 400 }
      )
    }

    // Get the user's profile
    let profile = await prisma.profile.findUnique({
      where: { email: session.user.email },
    })

    // If profile doesn't exist, create one automatically
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          email: session.user.email,
          firstName: session.user.email.split('@')[0],
          lastName: '',
          category: 'AUTHOR',
        },
      })
    }

    // Generate a unique slug from the title
    const baseSlug = slugify(title, { lower: true, strict: true })
    let slug = baseSlug
    let counter = 1

    // Keep checking until we find a unique slug
    while (await prisma.publication.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    let coverImageUrl: string | undefined

    // Handle cover image upload
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

    // Handle file uploads
    const fileUploads = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        const filename = `${uniqueSuffix}-${file.name}`
        const uploadDir = join(cwd(), "public", "uploads")
        const filepath = join(uploadDir, filename)

        await writeFile(filepath, buffer)

        return {
          name: file.name,
          url: `/uploads/${filename}`,
          size: file.size,
          type: file.type,
        }
      })
    )

    const publication = await prisma.publication.create({
      data: {
        title,
        slug,
        description,
        content,
        status,
        coverImage: coverImageUrl,
        coverCredit,
        authors: {
          create: authorIds.map((authorId, index) => ({
            order: index + 1,
            profileId: authorId,
          })),
        },
        categories: {
          create: categoryIds.map((categoryId) => ({
            assignedAt: new Date(),
            category: {
              connect: { id: categoryId },
            },
          })),
        },
        files: {
          create: fileUploads,
        },
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
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        files: true,
      },
    })

    return NextResponse.json(publication)
  } catch (error) {
    console.error("Failed to create publication:", error)
    return NextResponse.json(
      { error: "Failed to create publication" },
      { status: 500 }
    )
  }
} 