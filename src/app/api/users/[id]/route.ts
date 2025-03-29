import { NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { email, firstName, lastName } = body

    const user = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: params.id },
        data: {
          email,
          profile: {
            update: {
              firstName,
              lastName,
            },
          },
        },
        include: {
          profile: true,
        },
      })

      return user
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Failed to update user:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await sqlite.run(`UPDATE user SET({
      where: { id: params.id },
      data: {
        status: "ARCHIVED",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to archive user:", error)
    return NextResponse.json(
      { error: "Failed to archive user" },
      { status: 500 }
    )
  }
} 