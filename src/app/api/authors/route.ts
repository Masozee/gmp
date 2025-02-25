import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/server-auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import { cwd } from "process"
import { Prisma, UserCategory } from "@prisma/client"

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
    const search = searchParams.get("search")
    const categoryParam = searchParams.get("category")

    const where: Prisma.ProfileWhereInput = {
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(categoryParam && categoryParam !== "all" && {
        category: categoryParam as UserCategory,
      }),
    }

    const profiles = await prisma.profile.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(profiles)
  } catch (error) {
    console.error("Failed to fetch profiles:", error)
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
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
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phoneNumber = formData.get("phoneNumber") as string | null
    const organization = formData.get("organization") as string | null
    const bio = formData.get("bio") as string | null
    const category = formData.get("category") as UserCategory
    const photo = formData.get("photo") as File | null

    let photoUrl: string | null = null

    if (photo) {
      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
      const filename = `${uniqueSuffix}-${photo.name}`
      const uploadDir = join(cwd(), "public", "uploads")
      const filepath = join(uploadDir, filename)

      await writeFile(filepath, buffer)
      photoUrl = `/uploads/${filename}`
    }

    // Check if email is already in use
    const existingProfile = await prisma.profile.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive"
        }
      }
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: "A profile with this email already exists" },
        { status: 400 }
      )
    }

    const profile = await prisma.profile.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber: phoneNumber || null,
        organization: organization || null,
        bio: bio || null,
        category,
        photoUrl,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Failed to create profile:", error)
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    )
  }
} 