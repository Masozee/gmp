import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mail = await db.mail.findUnique({
      where: {
        id: params.id,
      },
      include: {
        category: true,
      },
    })

    if (!mail) {
      return NextResponse.json(
        { error: "Mail not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(mail)
  } catch (error) {
    console.error("Error fetching mail:", error)
    return NextResponse.json(
      { error: "Failed to fetch mail" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Check if mail exists
    const existingMail = await db.mail.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingMail) {
      return NextResponse.json(
        { error: "Mail not found" },
        { status: 404 }
      )
    }

    // Update mail
    const updatedMail = await db.mail.update({
      where: {
        id: params.id,
      },
      data: {
        subject: body.subject,
        description: body.description,
        content: body.content,
        type: body.type,
        status: body.status,
        date: body.date ? new Date(body.date) : undefined,
        referenceNumber: body.referenceNumber,
        sender: body.sender,
        recipient: body.recipient,
        categoryId: body.categoryId,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(updatedMail)
  } catch (error) {
    console.error("Error updating mail:", error)
    return NextResponse.json(
      { error: "Failed to update mail" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if mail exists
    const existingMail = await db.mail.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingMail) {
      return NextResponse.json(
        { error: "Mail not found" },
        { status: 404 }
      )
    }

    // Delete mail
    await db.mail.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json(
      { message: "Mail deleted successfully" }
    )
  } catch (error) {
    console.error("Error deleting mail:", error)
    return NextResponse.json(
      { error: "Failed to delete mail" },
      { status: 500 }
    )
  }
} 