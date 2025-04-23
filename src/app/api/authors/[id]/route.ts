import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
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

    // Get the author by ID
    const author = await sqlite.get(
      "SELECT * FROM authors WHERE id = ?",
      [params.id]
    )

    if (!author) {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(author)
  } catch (error) {
    console.error("Failed to fetch author:", error)
    return NextResponse.json(
      { error: "Failed to fetch author" },
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

    // For FormData requests
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await request.formData()
      
      // Get form values
      const firstName = formData.get("firstName") as string
      const lastName = formData.get("lastName") as string
      const email = formData.get("email") as string
      const phoneNumber = formData.get("phoneNumber") as string || null
      const organization = formData.get("organization") as string || null
      const bio = formData.get("bio") as string || null
      const category = formData.get("category") as string
      
      // Validate required fields
      if (!firstName || !lastName || !email || !category) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        )
      }
      
      const now = new Date().toISOString()
      
      // Update the author
      await sqlite.run(`
        UPDATE authors 
        SET 
          firstName = ?, 
          lastName = ?, 
          email = ?, 
          phoneNumber = ?, 
          organization = ?, 
          bio = ?, 
          category = ?,
          updatedAt = ?
        WHERE id = ?
      `, [
        firstName,
        lastName,
        email,
        phoneNumber,
        organization,
        bio,
        category,
        now,
        params.id
      ])
      
      // Get the updated author
      const author = await sqlite.get(
        "SELECT * FROM authors WHERE id = ?",
        [params.id]
      )
      
      return NextResponse.json(author)
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
      
      const now = new Date().toISOString()
      
      // Prepare update query and values
      const updates = []
      const values = []
      
      // Add fields to update
      if (firstName) {
        updates.push("firstName = ?")
        values.push(firstName)
      }
      
      if (lastName) {
        updates.push("lastName = ?")
        values.push(lastName)
      }
      
      if (email) {
        updates.push("email = ?")
        values.push(email)
      }
      
      if (phoneNumber !== undefined) {
        updates.push("phoneNumber = ?")
        values.push(phoneNumber)
      }
      
      if (organization !== undefined) {
        updates.push("organization = ?")
        values.push(organization)
      }
      
      if (bio !== undefined) {
        updates.push("bio = ?")
        values.push(bio)
      }
      
      if (category) {
        updates.push("category = ?")
        values.push(category)
      }
      
      if (photoUrl) {
        updates.push("photoUrl = ?")
        values.push(photoUrl)
      }
      
      updates.push("updatedAt = ?")
      values.push(now)
      
      // Add ID at the end
      values.push(params.id)
      
      // Update the author
      await sqlite.run(`
        UPDATE authors 
        SET ${updates.join(", ")}
        WHERE id = ?
      `, values)
      
      // Get the updated author
      const author = await sqlite.get(
        "SELECT * FROM authors WHERE id = ?",
        [params.id]
      )
      
      return NextResponse.json(author)
    }
  } catch (error) {
    console.error("Failed to update author:", error)
    return NextResponse.json(
      { error: "Failed to update author" },
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

    // Check if author exists
    const author = await sqlite.get(
      "SELECT id FROM authors WHERE id = ?",
      [params.id]
    )

    if (!author) {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404 }
      )
    }

    // Delete the author
    await sqlite.run(
      "DELETE FROM authors WHERE id = ?",
      [params.id]
    )

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete author:", error)
    return NextResponse.json(
      { error: "Failed to delete author" },
      { status: 500 }
    )
  }
} 