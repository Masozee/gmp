
import { randomUUID } from 'crypto';

// Flag to track if DB was initialized
let isInitialized = false;

/**
 * Initialize the in-memory database on Vercel
 * This ensures that all tables and initial data are set up
 */
export async function initializeVercelDatabase() {
  // Prevent multiple initializations
  if (isInitialized) {
    return;
  }
  
  // Check if we're on Vercel
  const isVercel = process.env.VERCEL === '1';
  if (!isVercel) {
    // Don't initialize if not on Vercel
    return;
  }
  
  console.log('Initializing in-memory database for Vercel deployment...');
  
  try {
    // Create basic tables
    await createTables();
    
    // Add initial data
    await addInitialData();
    
    isInitialized = true;
    console.log('Vercel database initialization complete');
  } catch (error) {
    console.error('Error initializing Vercel database:', error);
  }
}

async function createTables() {
  // Users table
  await sqlite.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      emailVerified DATETIME,
      image TEXT,
      role TEXT,
      password TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);
  
  // Events table
  await sqlite.run(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      content TEXT,
      location TEXT NOT NULL,
      venue TEXT,
      startDate DATETIME NOT NULL,
      endDate DATETIME NOT NULL,
      posterImage TEXT,
      posterCredit TEXT,
      status TEXT NOT NULL,
      published INTEGER NOT NULL DEFAULT 0,
      categoryId TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);
  
  // Categories table
  await sqlite.run(`
    CREATE TABLE IF NOT EXISTS event_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);
  
  // Create indices
  await sqlite.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  await sqlite.run(`CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug)`);
}

async function addInitialData() {
  // Add admin user if needed
  const adminExists = await sqlite.get(
    "SELECT id FROM users WHERE email = ? AND role = ?",
    ["admin@example.com", "ADMIN"]
  );
  
  if (!adminExists) {
    console.log('Creating admin user for Vercel deployment...');
    
    const now = new Date().toISOString();
    const userId = randomUUID();
    
    // Add admin user with hashed password for "admin123"
    // This is pre-hashed for "admin123"
    const hashedPassword = "$2a$10$8r0aGeQoqQioRh8LQgB5Y.BwqR6EUQ2oe5YHBnwKDJ0K0UZnuoiC.";
    
    await sqlite.run(
      "INSERT INTO users (id, name, email, role, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [userId, "Admin User", "admin@example.com", "ADMIN", hashedPassword, now, now]
    );
  }
  
  // Add example category if needed
  const categoryExists = await sqlite.get(
    "SELECT id FROM event_categories WHERE slug = ?",
    ["example-category"]
  );
  
  if (!categoryExists) {
    console.log('Creating example category for Vercel deployment...');
    
    const now = new Date().toISOString();
    const categoryId = randomUUID();
    
    await sqlite.run(
      "INSERT INTO event_categories (id, name, slug, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [
        categoryId,
        "Example Category",
        "example-category",
        "This is an example category created during initialization",
        now,
        now
      ]
    );
    
    // Add a sample event
    const eventId = randomUUID();
    await sqlite.run(`
      INSERT INTO events (id, title, slug, description, location, startDate, endDate, status, published, categoryId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      eventId,
      "Sample Vercel Event",
      "sample-vercel-event",
      "This is a sample event for Vercel deployments",
      "Online",
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(), // 1 day later
      "PUBLISHED",
      1,
      categoryId,
      now,
      now,
    ]);
  }
}

// Auto-initialize on import
initializeVercelDatabase(); 