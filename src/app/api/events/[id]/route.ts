import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"
import { writeFile, unlink } from "fs/promises"
import { join } from "path"
import { cwd } from "process"
import { access, mkdir } from "fs/promises"
import { constants } from "fs"
import slugify from "slugify"

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

    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      )
    }

    const event = await sqlite.get(`SELECT * FROM event WHERE({
      where: { id },
      include: {
        category: true,
        speakers: {
          include: {
            speaker: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        presentations: {
          include: {
            speaker: true
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Failed to fetch event:", error)
    return NextResponse.json(
      { error: "Failed to fetch event", details: error instanceof Error ? error.message : String(error) },
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

    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      )
    }

    // Check if the event exists
    const existingEvent = await sqlite.get(`SELECT * FROM event WHERE({
      where: { id },
      include: {
        speakers: true,
        tags: true
      }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    // Handle both JSON and FormData requests
    let formData: FormData | null = null;
    let jsonData: any = null;
    
    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      formData = await request.formData();
    } else {
      try {
        jsonData = await request.json();
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid request format" },
          { status: 400 }
        );
      }
    }

    // Extract data from either formData or jsonData
    const title = formData ? formData.get("title") as string : jsonData.title;
    const description = formData ? formData.get("description") as string : jsonData.description;
    const content = formData ? formData.get("content") as string : jsonData.content;
    const status = formData ? formData.get("status") as string : jsonData.status;
    const posterImage = formData ? formData.get("posterImage") as File | null : null;
    const posterCredit = formData ? formData.get("posterCredit") as string : jsonData.posterCredit;
    const startDate = formData ? formData.get("startDate") as string : jsonData.startDate;
    const endDate = formData ? formData.get("endDate") as string : jsonData.endDate;
    const location = formData ? formData.get("location") as string : jsonData.location;
    const venue = formData ? formData.get("venue") as string : jsonData.venue;
    const categoryId = formData ? formData.get("categoryId") as string : jsonData.categoryId;
    const published = formData 
      ? formData.get("published") === "true" 
      : jsonData.published !== undefined ? jsonData.published : existingEvent.published;
    const presentations = formData 
      ? JSON.parse(formData.get("presentations") as string || "[]") 
      : jsonData.presentations || [];

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      )
    }

    if (!startDate) {
      return NextResponse.json(
        { error: "Start date is required" },
        { status: 400 }
      )
    }

    if (!endDate) {
      return NextResponse.json(
        { error: "End date is required" },
        { status: 400 }
      )
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      title,
      description,
      status: status || existingEvent.status,
      published,
      updatedAt: new Date()
    }

    // Only update these fields if they are provided
    if (content) updateData.content = content;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (location !== undefined) updateData.location = location;
    if (venue !== undefined) updateData.venue = venue;
    if (categoryId) updateData.categoryId = categoryId;
    if (posterCredit !== undefined) updateData.posterCredit = posterCredit;

    // Handle presentations
    if (presentations && Array.isArray(presentations)) {
      updateData.presentations = {
        deleteMany: {},
        create: presentations.map((presentation: any) => ({
          title: presentation.title,
          abstract: presentation.abstract || null,
          slides: presentation.slides || null,
          videoUrl: presentation.videoUrl || null,
          duration: presentation.duration || null,
          startTime: presentation.startTime ? new Date(presentation.startTime) : null,
          endTime: presentation.endTime ? new Date(presentation.endTime) : null
        }))
      };
    }

    // Update slug if title changed
    if (title && title !== existingEvent.title) {
      let slug = slugify(title, { lower: true, strict: true });
      
      // Check if slug exists for another event
      const slugExists = await sqlite.get(`SELECT * FROM event({
        where: { 
          slug,
          id: { not: id }
        },
      });

      // If slug exists, append a unique timestamp
      if (slugExists) {
        slug = `${slug}-${Date.now()}`;
      }
      
      updateData.slug = slug;
    }

    // Handle poster image upload
    if (posterImage && posterImage instanceof File) {
      try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = join(cwd(), "public", "uploads");
        try {
          await access(uploadsDir, constants.F_OK);
        } catch (error) {
          await mkdir(uploadsDir, { recursive: true });
        }

        // Generate a unique filename for the poster image
        const filename = `${Date.now()}-${Math.floor(Math.random() * 1000000000)}-${posterImage.name}`;
        const filePath = join(uploadsDir, filename);
        
        // Write the file to disk
        const buffer = Buffer.from(await posterImage.arrayBuffer());
        await writeFile(filePath, buffer);
        
        // Set the poster image URL (relative to /public)
        updateData.posterImage = `/uploads/${filename}`;
      } catch (error) {
        console.error("Error uploading poster image:", error);
      }
    }

    // Update the event
    const updatedEvent = await sqlite.run(`UPDATE event SET({
      where: { id },
      data: updateData,
      include: {
        category: true,
        speakers: {
          include: {
            speaker: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        presentations: {
          include: {
            speaker: true
          }
        }
      }
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Failed to update event:", error);
    return NextResponse.json(
      { error: "Failed to update event", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
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

    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      )
    }

    // Check if the event exists
    const event = await sqlite.get(`SELECT * FROM event WHERE({
      where: { id }
    })

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    // Delete the event
    await sqlite.run(`DELETE FROM event WHERE({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete event:", error)
    return NextResponse.json(
      { error: "Failed to delete event", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 