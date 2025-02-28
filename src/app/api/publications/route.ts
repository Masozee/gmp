import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"
import slugify from "slugify"
import { writeFile } from "fs/promises"
import { join } from "path"
import { cwd } from "process"
import { Prisma, PublicationStatus } from "@prisma/client"
import { createId } from "@paralleldrive/cuid2"

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

    const where: Prisma.PublicationWhereInput = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      ]
    }

    if (status) {
      where.status = status as PublicationStatus
    }

    if (category) {
      where.categories = {
        some: {
          category: {
            id: category
          }
        }
      }
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
        categories: {
          include: {
            category: true,
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

    console.log("Session user:", session.user)
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const content = formData.get("content") as string
    const coverImage = formData.get("coverImage") as File | null
    const coverCredit = formData.get("coverCredit") as string | null
    const files = formData.getAll("files") as File[]
    
    console.log("Form data:", {
      title,
      description,
      content,
      coverCredit,
      hasFiles: files.length > 0
    })

    // Validate required fields
    if (!title || !description || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

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

    console.log("Author IDs:", authorIds)
    console.log("Category IDs:", categoryIds)

    // Get the user's profile
    let profile = await prisma.profile.findFirst({
      where: {
        email: {
          equals: session.user.email,
          mode: "insensitive",
        },
      },
    })

    console.log("Found profile:", profile)

    // If profile doesn't exist, create one automatically
    if (!profile) {
      console.log("Creating new profile for user")
      profile = await prisma.profile.create({
        data: {
          email: session.user.email,
          firstName: session.user.email.split('@')[0],
          lastName: '',
          category: 'AUTHOR',
        },
      })
      console.log("Created profile:", profile)
    }

    // Add the current user as an author if not already included
    if (!authorIds.includes(profile.id)) {
      authorIds.push(profile.id)
    }

    console.log("Final author IDs:", authorIds)

    // Remove duplicate author IDs
    const uniqueAuthorIds = [...new Set(authorIds)]

    // Generate a unique slug from the title
    const baseSlug = slugify(title, { lower: true, strict: true })
    let slug = baseSlug
    let counter = 1

    // Keep checking until we find a unique slug
    const existingPublication = await prisma.$queryRaw`
      SELECT slug FROM publications WHERE slug = ${slug}
    `

    while ((existingPublication as any[])[0]) {
      slug = `${baseSlug}-${counter}`
      counter++
      const nextPublication = await prisma.$queryRaw`
        SELECT slug FROM publications WHERE slug = ${slug}
      `
      if (!(nextPublication as any[])[0]) {
        break
      }
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

    const publicationData = {
      title,
      slug,
      description,
      content,
      status: "DRAFT" as const,
      ...(coverImageUrl && { coverImage: coverImageUrl }),
      ...(coverCredit && { coverCredit }),
      authors: {
        create: uniqueAuthorIds.map((authorId, index) => ({
          order: index + 1,
          profile: {
            connect: { id: authorId }
          }
        }))
      },
      ...(categoryIds.length > 0 && {
        categories: {
          create: categoryIds.map((categoryId) => ({
            assignedAt: new Date(),
            category: {
              connect: { id: categoryId }
            }
          }))
        }
      }),
      ...(fileUploads.length > 0 && {
        files: {
          create: fileUploads
        }
      })
    }

    console.log("Publication data:", publicationData)

    const publication = await prisma.$queryRaw`
      INSERT INTO publications (
        id,
        title,
        slug,
        description,
        content,
        status,
        "coverImage",
        "coverCredit",
        "createdAt",
        "updatedAt"
      ) VALUES (
        ${createId()},
        ${title},
        ${slug},
        ${description},
        ${content},
        'DRAFT'::"PublicationStatus",
        ${coverImageUrl || null},
        ${coverCredit || null},
        NOW(),
        NOW()
      ) RETURNING *;
    `

    // Add authors if provided
    if (uniqueAuthorIds.length > 0) {
      await prisma.$transaction(
        uniqueAuthorIds.map((authorId, index) =>
          prisma.publicationAuthor.create({
            data: {
              order: index + 1,
              publication: { connect: { id: (publication as any)[0].id } },
              profile: { connect: { id: authorId } },
            },
          })
        )
      )
    }

    // Add categories if provided
    if (categoryIds.length > 0) {
      await prisma.$transaction(
        categoryIds.map((categoryId) =>
          prisma.categoriesOnPublications.create({
            data: {
              publication: { connect: { id: (publication as any)[0].id } },
              category: { connect: { id: categoryId } },
              assignedAt: new Date(),
            },
          })
        )
      )
    }

    // Add files if provided
    if (fileUploads.length > 0) {
      await prisma.publicationFile.createMany({
        data: fileUploads.map((file) => ({
          ...file,
          publicationId: (publication as any)[0].id,
        })),
      })
    }

    // Fetch the complete publication with all relations
    const completePublication = await prisma.$queryRaw`
      SELECT
        p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pa.id,
              'order', pa.order,
              'profile', json_build_object(
                'firstName', pr.\"firstName\",
                'lastName', pr.\"lastName\",
                'photoUrl', pr.\"photoUrl\"
              )
            )
          ) FILTER (WHERE pa.id IS NOT NULL),
          '[]'
        ) as authors,
        COALESCE(
          json_agg(
            json_build_object(
              'category', json_build_object(
                'id', c.id,
                'name', c.name,
                'slug', c.slug
              )
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'
        ) as categories,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pf.id,
              'name', pf.name,
              'url', pf.url,
              'size', pf.size,
              'type', pf.type
            )
          ) FILTER (WHERE pf.id IS NOT NULL),
          '[]'
        ) as files
      FROM publications p
      LEFT JOIN \"publication_authors\" pa ON p.id = pa.\"publicationId\"
      LEFT JOIN profiles pr ON pa.\"profileId\" = pr.id
      LEFT JOIN \"CategoriesOnPublications\" cp ON p.id = cp.\"publicationId\"
      LEFT JOIN \"Category\" c ON cp.\"categoryId\" = c.id
      LEFT JOIN \"PublicationFile\" pf ON p.id = pf.\"publicationId\"
      WHERE p.id = ${(publication as any)[0].id}
      GROUP BY p.id;
    `

    return NextResponse.json((completePublication as any[])[0])
  } catch (error) {
    console.error("Failed to create publication:", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error code:", error.code)
      console.error("Prisma error message:", error.message)
      console.error("Prisma error meta:", error.meta)
      return NextResponse.json(
        { error: `Failed to create publication: ${error.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create publication" },
      { status: 500 }
    )
  }
} 