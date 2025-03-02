import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { EventStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const status = searchParams.get("status") as EventStatus | null;
    const categoryId = searchParams.get("categoryId");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const skip = (page - 1) * limit;

    // Build the where clause based on filters
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get events with pagination
    const events = await db.event.findMany({
      where,
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        speakers: {
          include: {
            speaker: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        [sort]: order,
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const total = await db.event.count({ where });

    return NextResponse.json({
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ["title", "description", "location", "startDate", "endDate", "categoryId"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");

    // Check if slug already exists
    const existingEvent = await db.event.findUnique({
      where: { slug },
    });

    if (existingEvent) {
      return NextResponse.json(
        { error: "An event with this title already exists" },
        { status: 400 }
      );
    }

    // Create the event
    const event = await db.event.create({
      data: {
        title: body.title,
        slug,
        description: body.description,
        content: body.content || "",
        location: body.location,
        venue: body.venue || null,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        status: body.status || "UPCOMING",
        categoryId: body.categoryId,
        posterImage: body.imageUrl || null,
        published: true,
      },
    });

    // Add tags if provided
    if (body.tags && Array.isArray(body.tags) && body.tags.length > 0) {
      const tagConnections = body.tags.map((tagId: string) => ({
        tagId,
        eventId: event.id,
      }));

      await db.tagsOnEvents.createMany({
        data: tagConnections,
      });
    }

    // Add speakers if provided
    if (body.speakers && Array.isArray(body.speakers) && body.speakers.length > 0) {
      const speakerConnections = body.speakers.map((speakerId: string, index: number) => ({
        speakerId: speakerId,
        eventId: event.id,
        order: index + 1,
      }));

      await db.eventSpeaker.createMany({
        data: speakerConnections,
      });
    }

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
} 