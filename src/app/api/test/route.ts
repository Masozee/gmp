import { NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"

export async function GET(request: Request) {
  try {
    console.log("[Test API] Testing database connection...")
    
    // Test query
    const result = sqlite.get("SELECT sqlite_version() as version")
    
    // Check if we should return specific table info
    const url = new URL(request.url);
    const checkParam = url.searchParams.get('check');
    
    if (checkParam === 'event_speakers') {
      // Return event_speakers table schema
      const eventSpeakersSchema = sqlite.all("PRAGMA table_info(event_speakers)");
      return NextResponse.json({
        success: true,
        message: "Event Speakers table schema",
        schema: eventSpeakersSchema
      });
    }
    
    // Test events query
    try {
      console.log("[Test API] Testing events query...")
      
      // Similar to the events GET handler but with more detailed error logging
      const eventsQuery = `
        SELECT 
          e.id, e.title, e.slug, e.description, e.content, e.location, e.venue,
          e.startDate, e.endDate, e.posterImage, e.posterCredit, e.status,
          e.published, e.categoryId, e.createdAt, e.updatedAt,
          c.id as category_id, c.name as category_name
        FROM events e
        LEFT JOIN event_categories c ON e.categoryId = c.id
        LIMIT 5
      `;
      
      const events = sqlite.all(eventsQuery);
      console.log("[Test API] Events query result:", events);
      
      return NextResponse.json({
        success: true,
        message: "API is working correctly",
        databaseVersion: result?.version || "unknown",
        eventsCount: events.length,
        firstEvent: events.length > 0 ? events[0] : null
      });
    } catch (eventsError) {
      console.error("[Test API] Error testing events query:", eventsError);
      
      // Try to get more information about the tables
      let tablesInfo;
      let eventsTableInfo;
      let categoriesTableInfo;
      
      try {
        tablesInfo = sqlite.all("SELECT name FROM sqlite_master WHERE type='table'");
      } catch (error) {
        tablesInfo = `Error getting tables: ${error instanceof Error ? error.message : String(error)}`;
      }
      
      try {
        eventsTableInfo = sqlite.all("PRAGMA table_info(events)");
      } catch (error) {
        eventsTableInfo = `Error getting events table info: ${error instanceof Error ? error.message : String(error)}`;
      }
      
      try {
        categoriesTableInfo = sqlite.all("PRAGMA table_info(event_categories)");
      } catch (error) {
        categoriesTableInfo = `Error getting categories table info: ${error instanceof Error ? error.message : String(error)}`;
      }
      
      return NextResponse.json({
        success: false,
        message: "Database is working but events query failed",
        databaseVersion: result?.version || "unknown",
        error: eventsError instanceof Error ? eventsError.message : String(eventsError),
        tablesInfo,
        eventsTableInfo,
        categoriesTableInfo
      });
    }
  } catch (error) {
    console.error("[Test API] Error testing API:", error)
    if (error instanceof Error) {
      console.error("[Test API] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
    }
    return NextResponse.json(
      { error: "Failed to test API", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// Add a PUT method to create test data
export async function PUT() {
  try {
    console.log("[Test API] Creating test data...")
    
    // Create a test category if it doesn't exist
    let categoryId = null;
    const existingCategory = sqlite.get(
      "SELECT id FROM event_categories WHERE name = ?", 
      ["Test Category"]
    );
    
    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const now = new Date().toISOString();
      categoryId = randomUUID();
      
      sqlite.run(
        "INSERT INTO event_categories (id, name, slug, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
        [categoryId, "Test Category", "test-category", "A test category for testing purposes", now, now]
      );
    }
    
    // Create a test event
    const eventId = randomUUID();
    const now = new Date().toISOString();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7); // One week from now
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 3); // 3 hours after start
    
    const eventResult = sqlite.run(
      `INSERT INTO events (
        id, title, slug, description, content, location, venue, 
        startDate, endDate, posterImage, posterCredit, status,
        published, categoryId, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        eventId,
        "Test Event",
        "test-event",
        "This is a test event description",
        "# Test Event\n\nThis is the content of the test event.",
        "Jakarta, Indonesia",
        "Test Venue",
        startDate.toISOString(),
        endDate.toISOString(),
        null, // posterImage
        null, // posterCredit
        "UPCOMING",
        1, // published
        categoryId,
        now,
        now
      ]
    );
    
    // Create test tag
    let tagId = null;
    const existingTag = sqlite.get("SELECT id FROM tags WHERE name = ?", ["test"]);
    
    if (existingTag) {
      tagId = existingTag.id;
    } else {
      tagId = randomUUID();
      sqlite.run(
        "INSERT INTO tags (id, name, slug, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
        [tagId, "test", "test", now, now]
      );
    }
    
    // Associate tag with event
    try {
      sqlite.run(
        "INSERT INTO tags_on_events (eventId, tagId, createdAt) VALUES (?, ?, ?)",
        [eventId, tagId, now]
      );
    } catch (error) {
      console.log("[Test API] Error associating tag with event (may already exist):", error);
    }
    
    return NextResponse.json({
      success: true,
      message: "Test data created successfully",
      categoryId,
      eventId,
      tagId
    });
  } catch (error) {
    console.error("[Test API] Error creating test data:", error);
    if (error instanceof Error) {
      console.error("[Test API] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      { 
        error: "Failed to create test data", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("[Test API] Starting user creation...")
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      console.log("[Test API] Missing email or password")
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    console.log("[Test API] Checking for existing user...")
    // Check if user already exists
    const existingUser = sqlite.get(
      "SELECT * FROM users WHERE email = ?",
      [email.toLowerCase()]
    )

    if (existingUser) {
      console.log("[Test API] User already exists")
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    console.log("[Test API] Hashing password...")
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const now = new Date().toISOString()
    const userId = randomUUID()

    console.log("[Test API] Creating user...")
    // Create user with ADMIN role using SQLite
    const result = sqlite.run(
      "INSERT INTO users (id, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, email.toLowerCase(), hashedPassword, 'ADMIN', now, now]
    )

    if (!result.changes) {
      throw new Error("Failed to create user")
    }

    // Fetch the created user
    const user = sqlite.get(
      "SELECT id, email FROM users WHERE email = ?",
      [email.toLowerCase()]
    )

    if (!user) {
      throw new Error("User was created but could not be retrieved")
    }

    console.log("[Test API] User created successfully:", user)
    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("[Test API] Error creating test user:", error)
    if (error instanceof Error) {
      console.error("[Test API] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
    }
    return NextResponse.json(
      { error: "Failed to create test user", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 