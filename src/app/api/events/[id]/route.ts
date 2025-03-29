import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await db.event.findUnique({
      where: { id: params.id },
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
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if event exists
    const existingEvent = await db.event.findUnique({
      where: { id: params.id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Generate slug from title if title has changed
    let slug = existingEvent.slug;
    if (body.title !== existingEvent.title) {
      slug = body.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
      
      // Check if new slug already exists for another event
      const slugExists = await db.event.findFirst({
        where: {
          slug,
          id: { not: params.id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "An event with this title already exists" },
          { status: 400 }
        );
      }
    }

    // Update the event
    const updatedEvent = await db.event.update({
      where: { id: params.id },
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
      },
      include: {
        category: true,
      },
    });

    // Update tags if provided
    if (body.tags && Array.isArray(body.tags)) {
      // Remove existing tags
      await db.tagsOnEvents.deleteMany({
        where: { eventId: params.id },
      });

      // Add new tags
      if (body.tags.length > 0) {
        const tagConnections = body.tags.map((tagId: string) => ({
          tagId,
          eventId: params.id,
        }));

        await db.tagsOnEvents.createMany({
          data: tagConnections,
        });
      }
    }

    // Update speakers if provided
    if (body.speakers && Array.isArray(body.speakers)) {
      // Remove existing speakers
      await db.eventSpeaker.deleteMany({
        where: { eventId: params.id },
      });

      // Add new speakers
      if (body.speakers.length > 0) {
        const speakerConnections = body.speakers.map((speakerId: string, index: number) => ({
          speakerId: speakerId,
          eventId: params.id,
          order: index + 1,
        }));

        await db.eventSpeaker.createMany({
          data: speakerConnections,
        });
      }
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if event exists
    const existingEvent = await db.event.findUnique({
      where: { id: params.id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Delete the event
    await db.event.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
} 