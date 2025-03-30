/**
 * Database Initialization Script
 * 
 * This script initializes and optimizes the SQLite database.
 * It creates all necessary tables, adds indexes, and performs
 * database optimizations.
 */

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

// Database path
const dbPath = './db/app.db';

// Ensure the database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

console.log('Initializing database...');

// Connect to the database
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Function to execute SQL
function run(sql, params = []) {
  try {
    return db.prepare(sql).run(...params);
  } catch (error) {
    console.error('SQL Error:', sql, params, error);
    throw error;
  }
}

// Function to get a single row
function get(sql, params = []) {
  try {
    return db.prepare(sql).get(...params);
  } catch (error) {
    console.error('SQL Error:', sql, params, error);
    throw error;
  }
}

// Function to generate a random ID
function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Setup tables and indices
function setupDatabase() {
  // Users table
  run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      emailVerified DATETIME,
      image TEXT,
      role TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);

  // Categories table
  run(`
    CREATE TABLE IF NOT EXISTS event_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);

  // Events table
  run(`
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
      updatedAt DATETIME NOT NULL,
      FOREIGN KEY (categoryId) REFERENCES event_categories(id)
    )
  `);

  // Create basic indices
  run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  run(`CREATE INDEX IF NOT EXISTS idx_categories_slug ON event_categories(slug)`);
  run(`CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug)`);
  run(`CREATE INDEX IF NOT EXISTS idx_events_category ON events(categoryId)`);
}

// Run the database setup
setupDatabase();

// Add any initial data if needed (e.g. admin user)
try {
  // Check if admin user exists
  const adminExists = get(
    "SELECT id FROM users WHERE email = ? AND role = ?",
    ["admin@example.com", "ADMIN"]
  );

  if (!adminExists) {
    console.log('Creating admin user...');
    
    const now = new Date().toISOString();
    const userId = generateId();
    
    // Create admin user
    run(
      "INSERT INTO users (id, name, email, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, "Admin User", "admin@example.com", "ADMIN", now, now]
    );
    
    console.log('Admin user created successfully');
  }
  
  // Check if example category exists
  const categoryExists = get(
    "SELECT id FROM event_categories WHERE slug = ?",
    ["example-category"]
  );
  
  if (!categoryExists) {
    console.log('Creating example category...');
    
    const now = new Date().toISOString();
    const categoryId = generateId();
    
    run(
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
    
    console.log('Example category created successfully');
  }
} catch (error) {
  console.error('Error adding initial data:', error);
}

// Analyze the database to optimize query planning
try {
  console.log('Running ANALYZE to optimize query planning...');
  db.pragma('analyze');
} catch (error) {
  console.error('Error analyzing database:', error);
}

// Vacuum the database to optimize storage
try {
  console.log('Running VACUUM to optimize storage...');
  db.pragma('vacuum');
} catch (error) {
  console.error('Error vacuuming database:', error);
}

// Close the database connection
db.close();

console.log('Database initialization complete'); 