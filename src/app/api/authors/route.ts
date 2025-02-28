import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
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
          { firstName: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { lastName: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
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
    console.log("[Authors API] Starting profile creation...")
    const session = await getServerSession()

    if (!session?.user) {
      console.log("[Authors API] Unauthorized - no session")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log("[Authors API] Processing request data...")
    let firstName: string
    let lastName: string
    let email: string
    let phoneNumber: string | null = null
    let organization: string | null = null
    let bio: string | null = null
    let category: UserCategory
    let photo: File | null = null

    const contentType = request.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      // Handle JSON data
      const body = await request.json()
      firstName = body.firstName
      lastName = body.lastName
      email = body.email
      phoneNumber = body.phoneNumber || null
      organization = body.organization || null
      bio = body.bio || null
      category = body.category as UserCategory
    } else {
      // Handle form data
      const formData = await request.formData()
      firstName = formData.get("firstName") as string
      lastName = formData.get("lastName") as string
      email = formData.get("email") as string
      phoneNumber = formData.get("phoneNumber") as string || null
      organization = formData.get("organization") as string || null
      bio = formData.get("bio") as string || null
      category = formData.get("category") as UserCategory
      photo = formData.get("photo") as File | null
    }

    if (!firstName || !lastName || !email || !category) {
      console.log("[Authors API] Missing required fields")
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    console.log("[Authors API] Request data:", {
      firstName,
      lastName,
      email,
      phoneNumber,
      organization,
      bio,
      category,
      hasPhoto: !!photo
    })

    let photoUrl: string | null = null

    if (photo) {
      console.log("[Authors API] Processing photo...")
      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
      const filename = `${uniqueSuffix}-${photo.name}`
      const uploadDir = join(cwd(), "public", "uploads")
      const filepath = join(uploadDir, filename)

      await writeFile(filepath, buffer)
      photoUrl = `/uploads/${filename}`
      console.log("[Authors API] Photo saved:", photoUrl)
    }

    // Check if email is already in use
    console.log("[Authors API] Checking for existing profile...")
    const existingProfile = await prisma.profile.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive"
        }
      }
    })

    if (existingProfile) {
      console.log("[Authors API] Profile already exists")
      return NextResponse.json(
        { error: "A profile with this email already exists" },
        { status: 400 }
      )
    }

    console.log("[Authors API] Creating profile...")
    const profile = await prisma.profile.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        organization,
        bio,
        category,
        photoUrl,
      },
    })

    console.log("[Authors API] Profile created successfully:", profile)
    return NextResponse.json(profile)
  } catch (error) {
    console.error("[Authors API] Error creating profile:", error)
    if (error instanceof Error) {
      console.error("[Authors API] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
    }
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    )
  }
} 