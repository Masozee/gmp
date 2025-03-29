import { NextRequest, NextResponse } from "next/server";
;
import sqlite from "@/lib/sqlite";

// EventStatus enum
export enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}


// Define types for the speakers and tags
interface EventSpeaker {
  id: string;
  firstName: string;
  lastName: string;
  organization: string | null;
  photoUrl: string | null;
  order: number;
  role: string | null;
}

interface EventTag {
  id: string;
  name: string;
  slug: string;
}

export interface EventWithRelations {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  location: string;
  venue: string | null;
  startDate: string;
  endDate: string;
  posterImage: string | null;
  posterCredit: string | null;
  status: string;
  published: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
  speakers: EventSpeaker[];
  tags: EventTag[];
}

// Event without relations for database operations
interface EventRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  location: string;
  venue: string | null;
  startDate: string;
  endDate: string;
  posterImage: string | null;
  posterCredit: string | null;
  status: string;
  published: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category_id: string;
  category_name: string;
}

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

    const { offset, limit: validLimit } = sqlite.paginate(page, limit);
    
    // Build the where clause based on filters
    let whereClause = "WHERE 1=1";
    const params: any[] = [];
    
    if (status) {
      whereClause += " AND e.status = ?";
      params.push(status);
    }
    
    if (categoryId) {
      whereClause += " AND e.categoryId = ?";
      params.push(categoryId);
    }

    if (search) {
      whereClause += " AND (e.title LIKE ? OR e.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM events e ${whereClause}`;
    const countResult = sqlite.get<{ total: number }>(countQuery, params);
    
    const total = countResult?.total || 0;

    // Build the ORDER BY clause
    let orderByClause = "ORDER BY ";
    
    // Validate sort field to prevent SQL injection
    const validSortColumns = ["title", "startDate", "createdAt", "updatedAt", "status"];
    const validOrderValues = ["asc", "desc"];
    
    const sortField = validSortColumns.includes(sort) ? sort : "createdAt";
    const orderDirection = validOrderValues.includes(order.toLowerCase()) ? order.toLowerCase() : "desc";
    
    orderByClause += `e.${sortField} ${orderDirection}`;

    // Get events with pagination
    const eventsQuery = `
      SELECT 
        e.id, e.title, e.slug, e.description, e.content, e.location, e.venue,
        e.startDate, e.endDate, e.posterImage, e.posterCredit, e.status,
        e.published, e.categoryId, e.createdAt, e.updatedAt,
        c.id as category_id, c.name as category_name
      FROM events e
      LEFT JOIN event_categories c ON e.categoryId = c.id
      ${whereClause}
      ${orderByClause}
      LIMIT ? OFFSET ?
    `;
    
    const events = sqlite.all<EventRecord>(eventsQuery, [...params, validLimit, offset]);

    // Prepare statements for related data to improve performance
    const speakersStmt = sqlite.prepareStatement(`
      SELECT 
        s.id, s.firstName, s.lastName, s.organization, s.photoUrl,
        es.order, es.role
      FROM event_speakers es
      JOIN speakers s ON es.speakerId = s.id
      WHERE es.eventId = ?
      ORDER BY es.order ASC
    `);
    
    const tagsStmt = sqlite.prepareStatement(`
      SELECT t.id, t.name, t.slug
      FROM tags_on_events te
      JOIN tags t ON te.tagId = t.id
      WHERE te.eventId = ?
    `);

    // Fetch related data for each event
    const eventsWithRelations = events.map((event) => {
      // Get speakers for this event using better-sqlite3
      const speakers = speakersStmt.all(event.id) as EventSpeaker[];
      
      // Get tags for this event using better-sqlite3
      const tags = tagsStmt.all(event.id) as EventTag[];
      
      // Map to the expected format
      return {
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        content: event.content,
        location: event.location,
        venue: event.venue,
        startDate: event.startDate,
        endDate: event.endDate,
        posterImage: event.posterImage,
        posterCredit: event.posterCredit,
        status: event.status,
        published: event.published,
        categoryId: event.categoryId,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        category: {
          id: event.category_id,
          name: event.category_name
        },
        speakers,
        tags
      } as EventWithRelations;
    });

    return NextResponse.json({
      events: eventsWithRelations,
      pagination: {
        total,
        page,
        limit: validLimit,
        totalPages: Math.ceil(total / validLimit),
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
    const existingEvent = sqlite.get(
      "SELECT id FROM events WHERE slug = ?",
      [slug]
    );

    if (existingEvent) {
      return NextResponse.json(
        { error: "An event with this title already exists" },
        { status: 400 }
      );
    }

    // Use transaction to ensure all operations succeed or fail together
    return sqlite.transaction(() => {
      // Insert the event
      const now = new Date().toISOString();
      
      // Prepare insert statement for event
      const insertEventStmt = sqlite.prepareStatement(`
        INSERT INTO events (
          title, slug, description, content, location, venue, 
          startDate, endDate, status, categoryId, posterImage, 
          published, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = insertEventStmt.run(
        body.title,
        slug,
        body.description,
        body.content || "",
        body.location,
        body.venue || null,
        new Date(body.startDate).toISOString(),
        new Date(body.endDate).toISOString(),
        body.status || "UPCOMING",
        body.categoryId,
        body.imageUrl || null,
        1, // published = true
        now,
        now
      );

      const eventId = result.lastInsertRowid;

      // Add tags if provided
      if (body.tags && Array.isArray(body.tags) && body.tags.length > 0) {
        const insertTagStmt = sqlite.prepareStatement(
          "INSERT INTO tags_on_events (eventId, tagId, createdAt) VALUES (?, ?, ?)"
        );
        
        for (const tagId of body.tags) {
          insertTagStmt.run(eventId, tagId, now);
        }
      }

      // Add speakers if provided
      if (body.speakers && Array.isArray(body.speakers) && body.speakers.length > 0) {
        const insertSpeakerStmt = sqlite.prepareStatement(`
          INSERT INTO event_speakers (
            eventId, speakerId, order, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?)
        `);
        
        for (let i = 0; i < body.speakers.length; i++) {
          const speakerId = body.speakers[i];
          insertSpeakerStmt.run(eventId, speakerId, i + 1, now, now);
        }
      }

      // Get the created event with its ID
      const event = sqlite.get(
        "SELECT * FROM events WHERE id = ?",
        [eventId]
      );

      return NextResponse.json(event, { status: 201 });
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
} 