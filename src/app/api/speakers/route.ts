import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "firstName"
    const order = searchParams.get("order") || "asc"

    const speakers = await db.speaker.findMany({
      where: {
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: {
        [sort]: order,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        organization: true,
        position: true,
        bio: true,
        photoUrl: true,
      },
    })

    // Transform the data to include a name field for the frontend
    const transformedSpeakers = speakers.map(speaker => ({
      ...speaker,
      name: `${speaker.firstName} ${speaker.lastName}`
    }));

    return NextResponse.json(transformedSpeakers)
  } catch (error) {
    console.error("Failed to fetch speakers:", error)
    return NextResponse.json(
      { error: "Failed to fetch speakers" },
      { status: 500 }
    )
  }
} 