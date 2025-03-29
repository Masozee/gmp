import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import { cwd } from "process"

// UserCategory enum
export enum UserCategory {
  ACADEMIC = 'ACADEMIC',
  PRACTITIONER = 'PRACTITIONER',
  STUDENT = 'STUDENT',
  OTHER = 'OTHER',
}



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

    const where = {
      ...(search && {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { email: { contains: search } },
        ],
      }),
      ...(categoryParam && categoryParam !== "all" && {
        category: categoryParam as UserCategory,
      }),
    }

    const people = await sqlite.all(`SELECT * FROM profile({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(people)
  } catch (error) {
    console.error("Failed to fetch people:", error)
    return NextResponse.json(
      { error: "Failed to fetch people" },
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

    let photoUrl: string | undefined

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

    // Check if user already has a profile
    const existingProfile = await sqlite.get(`SELECT * FROM profile WHERE({
      where: { userId: session.user.id },
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: "User already has a profile" },
        { status: 400 }
      )
    }

    const person = await sqlite.run(`INSERT INTO profile({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber: phoneNumber || null,
        organization: organization || null,
        bio: bio || null,
        category,
        photoUrl: photoUrl || null,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    })

    return NextResponse.json(person)
  } catch (error) {
    console.error("Failed to create person:", error)
    return NextResponse.json(
      { error: "Failed to create person" },
      { status: 500 }
    )
  }
} 