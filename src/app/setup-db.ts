import sqlite from "@/lib/sqlite";

async function setupDatabase() {
  console.log("Setting up database...");
  
  // Initialize database tables
  sqlite.setupDatabase();
  
  // Add test data
  try {
    // Add a test speaker if none exists
    const speakers = await sqlite.all(`SELECT * FROM speakers LIMIT 1`);
    let speakerId: string;
    
    if (speakers.length === 0) {
      console.log("Adding test speaker...");
      speakerId = sqlite.generateId();
      await sqlite.run(`
        INSERT INTO speakers (id, firstName, lastName, organization, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        speakerId,
        "Jane",
        "Doe",
        "Test Organization",
        new Date().toISOString(),
        new Date().toISOString(),
      ]);
      
      console.log("Created speaker with ID:", speakerId);
    } else {
      speakerId = speakers[0].id;
      console.log("Using existing speaker with ID:", speakerId);
    }
    
    // Add a test event if none exists
    const events = await sqlite.all(`SELECT * FROM events LIMIT 1`);
    let eventId: string;
    
    if (events.length === 0) {
      console.log("Adding test event...");
      eventId = sqlite.generateId();
      
      await sqlite.run(`
        INSERT INTO events (id, title, slug, description, location, startDate, endDate, status, published, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        eventId,
        "Test Conference",
        "test-conference",
        "A test conference",
        "Virtual",
        new Date().toISOString(),
        new Date(Date.now() + 86400000).toISOString(), // 1 day later
        "PUBLISHED",
        1,
        new Date().toISOString(),
        new Date().toISOString(),
      ]);
      
      console.log("Created event with ID:", eventId);
    } else {
      eventId = events[0].id;
      console.log("Using existing event with ID:", eventId);
    }
    
    // Add a test presentation if none exists
    const presentations = await sqlite.all(`SELECT * FROM presentation LIMIT 1`);
    
    if (presentations.length === 0) {
      console.log("Adding test presentation...");
      const now = new Date().toISOString();
      
      await sqlite.run(`
        INSERT INTO presentation (title, abstract, speakerId, eventId, duration, startTime, endTime, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        "Introduction to AI Ethics",
        "A comprehensive overview of ethical considerations in AI development",
        speakerId,
        eventId,
        60, // 60 minutes
        new Date(Date.now() + 3600000).toISOString(), // 1 hour later
        new Date(Date.now() + 7200000).toISOString(), // 2 hours later
        now,
        now,
      ]);
      
      console.log("Test presentation added successfully");
    } else {
      console.log("Using existing presentation");
    }
    
    console.log("Database setup complete");
  } catch (error) {
    console.error("Error setting up test data:", error);
  } finally {
    // Close database connection
    sqlite.close();
  }
}

setupDatabase(); 