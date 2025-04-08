/**
 * Database Initialization Script
 * 
 * This script initializes and optimizes the SQLite database.
 * It creates all necessary tables, adds indexes, and performs
 * database optimizations.
 */

const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Database path
const dbPath = './src/db.sqlite';

// Ensure the database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

console.log('Initializing database...');

// Connect to the database
const db = new sqlite3.Database(dbPath);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Function to execute SQL
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        console.error('SQL Error:', sql, params, err);
        reject(err);
        return;
      }
      resolve({ lastInsertRowid: this.lastID, changes: this.changes });
    });
  });
}

// Function to get a single row
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('SQL Error:', sql, params, err);
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

// Function to generate a random ID
function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Setup tables and indices
async function setupDatabase() {
  try {
    // Users table
    await run(`
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

    // Categories table
    await run(`
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
    await run(`
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
    await run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_categories_slug ON event_categories(slug)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_events_category ON events(categoryId)`);
  } catch (err) {
    console.error('Error setting up database schema:', err);
    process.exit(1);
  }
}

// Run the database setup
setupDatabase().then(async () => {
  try {
    // Check if admin user exists
    const adminExists = await get(
      "SELECT id FROM users WHERE email = ? AND role = ?",
      ["admin@example.com", "ADMIN"]
    );

    if (!adminExists) {
      console.log('Creating admin user...');
      
      const now = new Date().toISOString();
      const userId = generateId();
      
      // Create admin user with a hashed password for "admin123"
      await run(
        "INSERT INTO users (id, name, email, role, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, "Admin User", "admin@example.com", "ADMIN", "$2a$10$8r0aGeQoqQioRh8LQgB5Y.BwqR6EUQ2oe5YHBnwKDJ0K0UZnuoiC.", now, now]
      );
      
      console.log('Admin user created successfully');
    }
    
    // Check if example category exists
    const categoryExists = await get(
      "SELECT id FROM event_categories WHERE slug = ?",
      ["example-category"]
    );
    
    if (!categoryExists) {
      console.log('Creating example category...');
      
      const now = new Date().toISOString();
      const categoryId = generateId();
      
      await run(
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
    
    // Analyze the database to optimize query planning
    try {
      console.log('Running ANALYZE to optimize query planning...');
      await run('ANALYZE');
    } catch (error) {
      console.error('Error analyzing database:', error);
    }

    // Vacuum the database to optimize storage
    try {
      console.log('Running VACUUM to optimize storage...');
      await run('VACUUM');
    } catch (error) {
      console.error('Error vacuuming database:', error);
    }

    // Close the database connection
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
        process.exit(1);
      }
      console.log('Database initialization complete');
    });
  } catch (error) {
    console.error('Error adding initial data:', error);
    db.close();
    process.exit(1);
  }
}); 