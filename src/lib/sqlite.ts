import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

// Always use in-memory database on Vercel
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel ? ':memory:' : './prisma/dev.db';

let db: Database.Database | null = null;

// Get sqlite connection
export function getConnection(): Database.Database {
  if (!db) {
    if (!isVercel) {
      // Ensure the database directory exists for local development
      const dbDir = path.dirname(dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
    }

    try {
      // Create database connection - with reduced options for Vercel
      db = new Database(dbPath, { 
        verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
      });
      
      // Basic pragmas that work in both environments
      db.pragma('foreign_keys = ON');
      
      // Only apply optimizations in non-Vercel environments
      if (!isVercel) {
        db.pragma('journal_mode = WAL');
        db.pragma('synchronous = NORMAL');
        db.pragma('cache_size = 10000');
        db.pragma('temp_store = MEMORY');
      }
    } catch (error) {
      console.error('Error connecting to SQLite database:', error);
      // Fallback to in-memory if file-based connection fails
      db = new Database(':memory:');
      console.log('Falling back to in-memory SQLite database');
      db.pragma('foreign_keys = ON');
    }
  }
  
  return db;
}

interface RunResult {
  lastInsertRowid: number;
  changes: number;
}

// Execute a query that doesn't return data
export function run(sql: string, params: any[] = []): RunResult {
  try {
    const stmt = getConnection().prepare(sql);
    const result = stmt.run(...params);
    return {
      lastInsertRowid: result.lastInsertRowid as number,
      changes: result.changes,
    };
  } catch (error) {
    console.error('SQL Error in run:', sql, error);
    throw error;
  }
}

// Execute a query and get a single row
export function get<T = any>(sql: string, params: any[] = []): T | undefined {
  try {
    const stmt = getConnection().prepare(sql);
    return stmt.get(...params) as T | undefined;
  } catch (error) {
    console.error('SQL Error in get:', sql, error);
    throw error;
  }
}

// Execute a query and get all rows
export function all<T = any>(sql: string, params: any[] = []): T[] {
  try {
    const stmt = getConnection().prepare(sql);
    return stmt.all(...params) as T[];
  } catch (error) {
    console.error('SQL Error in all:', sql, error);
    throw error;
  }
}

// Execute a query and iterate over rows
export function each<T = any>(
  sql: string, 
  params: any[] = [], 
  callback: (row: T) => void
): number {
  try {
    const stmt = getConnection().prepare(sql);
    let count = 0;
    
    const iterator = stmt.iterate(...params);
    for (const row of iterator) {
      callback(row as T);
      count++;
    }
    
    return count;
  } catch (error) {
    console.error('SQL Error in each:', sql, error);
    throw error;
  }
}

// Execute multiple statements in a transaction
export function transaction<T>(
  callback: () => T
): T {
  const connection = getConnection();
  
  try {
    connection.exec('BEGIN TRANSACTION');
    const result = callback();
    connection.exec('COMMIT');
    return result;
  } catch (error) {
    connection.exec('ROLLBACK');
    throw error;
  }
}

// Close the database connection
export function close(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// Utility to help with pagination
export function paginate(page: number, limit: number): { offset: number, limit: number } {
  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, Math.min(100, limit));
  const offset = (validPage - 1) * validLimit;
  
  return { offset, limit: validLimit };
}

// Utility to create a prepared statement that can be reused for better performance
export function prepareStatement(sql: string): Database.Statement {
  return getConnection().prepare(sql);
}

// Generate a random UUID (utility function)
export function generateId(): string {
  return randomUUID();
}

// Initialize tables
function initTables() {
  try {
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

    // Tags table
    run(`
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
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

    // Speakers table
    run(`
      CREATE TABLE IF NOT EXISTS speakers (
        id TEXT PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        title TEXT,
        bio TEXT,
        organization TEXT,
        photoUrl TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);

    // Event speakers pivot table
    run(`
      CREATE TABLE IF NOT EXISTS event_speakers (
        id TEXT PRIMARY KEY,
        eventId TEXT NOT NULL,
        speakerId TEXT NOT NULL,
        displayOrder INTEGER NOT NULL,
        role TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (eventId) REFERENCES events(id),
        FOREIGN KEY (speakerId) REFERENCES speakers(id),
        UNIQUE(eventId, speakerId)
      )
    `);

    // Tags on events pivot table
    run(`
      CREATE TABLE IF NOT EXISTS tags_on_events (
        eventId TEXT NOT NULL,
        tagId TEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        PRIMARY KEY (eventId, tagId),
        FOREIGN KEY (eventId) REFERENCES events(id),
        FOREIGN KEY (tagId) REFERENCES tags(id)
      )
    `);

    // Publications table
    run(`
      CREATE TABLE IF NOT EXISTS publications (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        abstract TEXT NOT NULL,
        content TEXT,
        publicationDate DATETIME NOT NULL,
        coverImage TEXT,
        imageCredit TEXT,
        published INTEGER NOT NULL DEFAULT 0,
        categoryId TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (categoryId) REFERENCES event_categories(id)
      )
    `);

    // Authors table
    run(`
      CREATE TABLE IF NOT EXISTS authors (
        id TEXT PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        title TEXT,
        bio TEXT,
        organization TEXT,
        photoUrl TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);

    // Authors on publications pivot table
    run(`
      CREATE TABLE IF NOT EXISTS authors_on_publications (
        id TEXT PRIMARY KEY,
        publicationId TEXT NOT NULL,
        authorId TEXT NOT NULL,
        displayOrder INTEGER NOT NULL,
        role TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (publicationId) REFERENCES publications(id),
        FOREIGN KEY (authorId) REFERENCES authors(id),
        UNIQUE(publicationId, authorId)
      )
    `);

    // Tags on publications pivot table
    run(`
      CREATE TABLE IF NOT EXISTS tags_on_publications (
        publicationId TEXT NOT NULL,
        tagId TEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        PRIMARY KEY (publicationId, tagId),
        FOREIGN KEY (publicationId) REFERENCES publications(id),
        FOREIGN KEY (tagId) REFERENCES tags(id)
      )
    `);

    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing tables:', error);
  }
}

// Create indices for better performance
function createIndices() {
  try {
    // Users indices
    run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    
    // Categories indices
    run(`CREATE INDEX IF NOT EXISTS idx_categories_slug ON event_categories(slug)`);
    
    // Events indices
    run(`CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug)`);
    run(`CREATE INDEX IF NOT EXISTS idx_events_category ON events(categoryId)`);
    run(`CREATE INDEX IF NOT EXISTS idx_events_status ON events(status)`);
    run(`CREATE INDEX IF NOT EXISTS idx_events_published ON events(published)`);
    run(`CREATE INDEX IF NOT EXISTS idx_events_date ON events(startDate, endDate)`);
    
    // Publications indices
    run(`CREATE INDEX IF NOT EXISTS idx_publications_slug ON publications(slug)`);
    run(`CREATE INDEX IF NOT EXISTS idx_publications_category ON publications(categoryId)`);
    run(`CREATE INDEX IF NOT EXISTS idx_publications_published ON publications(published)`);
    run(`CREATE INDEX IF NOT EXISTS idx_publications_date ON publications(publicationDate)`);
    
    // Event speakers indices
    run(`CREATE INDEX IF NOT EXISTS idx_event_speakers_event ON event_speakers(eventId)`);
    run(`CREATE INDEX IF NOT EXISTS idx_event_speakers_speaker ON event_speakers(speakerId)`);
    
    // Authors on publications indices
    run(`CREATE INDEX IF NOT EXISTS idx_authors_publications_pub ON authors_on_publications(publicationId)`);
    run(`CREATE INDEX IF NOT EXISTS idx_authors_publications_author ON authors_on_publications(authorId)`);

    console.log('Database indices created');
  } catch (error) {
    console.error('Error creating indices:', error);
  }
}

// Setup function to ensure necessary tables and indices exist
export function setupDatabase(): void {
  // Initialize tables
  initTables();
  
  // Create indices
  createIndices();
  
  console.log('SQLite database setup completed');
}

// Run setup when the module is imported
setupDatabase();

// Export all functions as sqlite object
const sqlite = {
  getConnection,
  run,
  get,
  all,
  each,
  transaction,
  close,
  paginate,
  prepareStatement,
  setupDatabase,
  generateId
};

export default sqlite; 