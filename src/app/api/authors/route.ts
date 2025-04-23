import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    
    // Calculate pagination
    const { offset, limit: validLimit } = await sqlite.paginate(page, limit)
    
    // Build query conditions
    const conditions = []
    const params: any[] = []
    
    if (search) {
      conditions.push("(firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR organization LIKE ?)")
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
    }
    
    if (category) {
      conditions.push("category = ?")
      params.push(category)
    }
    
    // Build the WHERE clause
    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(" AND ")}` 
      : ""
    
    // Get authors with pagination
    const authors = await sqlite.all(`
      SELECT * FROM authors
      ${whereClause}
      ORDER BY firstName ASC, lastName ASC
      LIMIT ? OFFSET ?
    `, [...params, validLimit, offset])
    
    return NextResponse.json(authors)
  } catch (error) {
    console.error("Failed to fetch authors:", error)
    return NextResponse.json(
      { error: "Failed to fetch authors" },
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

    // For FormData requests
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await request.formData()
      
      const firstName = formData.get("firstName") as string
      const lastName = formData.get("lastName") as string
      const email = formData.get("email") as string
      const phoneNumber = formData.get("phoneNumber") as string || null
      const organization = formData.get("organization") as string || null
      const bio = formData.get("bio") as string || null
      const category = formData.get("category") as string
      
      // Photo handling would go here in a real implementation
      // For now, we'll just use a placeholder URL
      const photoUrl = "/images/placeholders/author.jpg"
      
      // Validate required fields
      if (!firstName || !lastName || !email || !category) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        )
      }
      
      const id = sqlite.generateId()
      const now = new Date().toISOString()
      
      // Create the author
      await sqlite.run(`
        INSERT INTO authors (
          id, 
          firstName, 
          lastName, 
          email, 
          phoneNumber, 
          organization, 
          bio, 
          category,
          photoUrl,
          createdAt,
          updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id,
        firstName,
        lastName,
        email,
        phoneNumber,
        organization,
        bio,
        category,
        photoUrl,
        now,
        now
      ])
      
      // Get the created author
      const author = await sqlite.get(
        "SELECT * FROM authors WHERE id = ?",
        [id]
      )
      
      return NextResponse.json(author, { status: 201 })
    } else {
      // For JSON requests
      const { 
        firstName, 
        lastName, 
        email, 
        phoneNumber, 
        organization, 
        bio, 
        category, 
        photoUrl 
      } = await request.json()
      
      // Validate required fields
      if (!firstName || !lastName || !email || !category) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        )
      }
      
      const id = sqlite.generateId()
      const now = new Date().toISOString()
      
      // Create the author
      await sqlite.run(`
        INSERT INTO authors (
          id, 
          firstName, 
          lastName, 
          email, 
          phoneNumber, 
          organization, 
          bio, 
          category,
          photoUrl,
          createdAt,
          updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id,
        firstName,
        lastName,
        email,
        phoneNumber || null,
        organization || null,
        bio || null,
        category,
        photoUrl || "/images/placeholders/author.jpg",
        now,
        now
      ])
      
      // Get the created author
      const author = await sqlite.get(
        "SELECT * FROM authors WHERE id = ?",
        [id]
      )
      
      return NextResponse.json(author, { status: 201 })
    }
  } catch (error) {
    console.error("Failed to create author:", error)
    return NextResponse.json(
      { error: "Failed to create author" },
      { status: 500 }
    )
  }
}