import sqlite from "@/lib/sqlite";

interface Speaker {
  id: string;
  firstName: string;
  lastName: string;
  organization: string;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  published: number;
  createdAt: string;
  updatedAt: string;
}

async function setupDatabase() {
  console.log("Setting up database...");
  
  // Initialize database tables
  try {
    await sqlite.setupDatabase();
    
    // Add test data
    // Add a test speaker if none exists
    const speakers = await sqlite.all<Speaker>(`SELECT * FROM speakers LIMIT 1`);
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
    const events = await sqlite.all<Event>(`SELECT * FROM events LIMIT 1`);
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

    // Create admin user if doesn't exist
    const adminExists = await sqlite.get(
      "SELECT id FROM users WHERE email = ? AND role = ?",
      ["admin@example.com", "ADMIN"]
    );
    
    if (!adminExists) {
      console.log('Creating admin user...');
      
      const now = new Date().toISOString();
      const userId = sqlite.generateId();
      
      // Create admin user
      await sqlite.run(
        "INSERT INTO users (id, name, email, role, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, "Admin User", "admin@example.com", "ADMIN", "$2a$10$8r0aGeQoqQioRh8LQgB5Y.BwqR6EUQ2oe5YHBnwKDJ0K0UZnuoiC.", now, now]
      );
      
      console.log('Admin user created with default password (admin123)');
    }

  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    // Close database connection after all operations are complete
    await sqlite.close();
    console.log("Database connection closed");
  }
}

setupDatabase(); 