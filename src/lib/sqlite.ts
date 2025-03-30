import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

// Always use in-memory database on Vercel
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel ? ':memory:' : './db/app.db';

// Set statement cache size - larger cache means better performance
const STATEMENT_CACHE_SIZE = 100;

// Connection pool (singleton)
let db: Database.Database | null = null;

// Statement cache for prepared statements
const stmtCache = new Map<string, Database.Statement>();

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
      // Create database connection - with optimized settings
      db = new Database(dbPath, { 
        verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
        fileMustExist: !isVercel, // Don't create a new file if it doesn't exist, except on Vercel
      });
      
      // Basic pragmas that work in both environments
      db.pragma('foreign_keys = ON');
      
      // Apply performance optimizations
      if (!isVercel) {
        // WAL mode significantly improves write performance
        db.pragma('journal_mode = WAL');
        // NORMAL sync mode improves performance while maintaining reasonable safety
        db.pragma('synchronous = NORMAL');
        // Increase cache size for better performance
        db.pragma('cache_size = 20000'); // 20MB cache (up from 10MB)
        // Store temp tables in memory for better performance
        db.pragma('temp_store = MEMORY');
        // Set busy timeout to avoid SQLITE_BUSY errors
        db.pragma('busy_timeout = 5000'); // 5 seconds
        // Set page size for better performance
        db.pragma('page_size = 8192'); // 8KB pages (often better than default 4KB)
        // Enable memory-mapped I/O for read-only operations
        db.pragma('mmap_size = 30000000'); // 30MB memory map
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

// Execute a query that doesn't return data, optimized with prepared statements
export function run(sql: string, params: any[] = []): RunResult {
  try {
    // Use cached statement if available
    let stmt = stmtCache.get(sql);
    if (!stmt) {
      stmt = getConnection().prepare(sql);
      
      // Cache statement if we haven't exceeded cache size
      if (stmtCache.size < STATEMENT_CACHE_SIZE) {
        stmtCache.set(sql, stmt);
      }
    }
    
    const result = stmt.run(...params);
    return {
      lastInsertRowid: result.lastInsertRowid as number,
      changes: result.changes,
    };
  } catch (error) {
    console.error('SQL Error in run:', sql, params, error);
    throw error;
  }
}

// Execute a query and get a single row, optimized with prepared statements
export function get<T = any>(sql: string, params: any[] = []): T | undefined {
  try {
    // Use cached statement if available
    let stmt = stmtCache.get(sql);
    if (!stmt) {
      stmt = getConnection().prepare(sql);
      
      // Cache statement if we haven't exceeded cache size
      if (stmtCache.size < STATEMENT_CACHE_SIZE) {
        stmtCache.set(sql, stmt);
      }
    }
    
    return stmt.get(...params) as T | undefined;
  } catch (error) {
    console.error('SQL Error in get:', sql, params, error);
    throw error;
  }
}

// Execute a query and get all rows, optimized with prepared statements
export function all<T = any>(sql: string, params: any[] = []): T[] {
  try {
    // Use cached statement if available
    let stmt = stmtCache.get(sql);
    if (!stmt) {
      stmt = getConnection().prepare(sql);
      
      // Cache statement if we haven't exceeded cache size
      if (stmtCache.size < STATEMENT_CACHE_SIZE) {
        stmtCache.set(sql, stmt);
      }
    }
    
    return stmt.all(...params) as T[];
  } catch (error) {
    console.error('SQL Error in all:', sql, params, error);
    throw error;
  }
}

// Execute a query and iterate over rows, optimized for large datasets
export function each<T = any>(
  sql: string, 
  params: any[] = [], 
  callback: (row: T) => void
): number {
  try {
    // Use cached statement if available
    let stmt = stmtCache.get(sql);
    if (!stmt) {
      stmt = getConnection().prepare(sql);
      
      // Cache statement if we haven't exceeded cache size
      if (stmtCache.size < STATEMENT_CACHE_SIZE) {
        stmtCache.set(sql, stmt);
      }
    }
    
    let count = 0;
    
    const iterator = stmt.iterate(...params);
    for (const row of iterator) {
      callback(row as T);
      count++;
    }
    
    return count;
  } catch (error) {
    console.error('SQL Error in each:', sql, params, error);
    throw error;
  }
}

// Execute multiple statements in a transaction with improved error handling
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
    try {
      connection.exec('ROLLBACK');
    } catch (rollbackError) {
      console.error('Error rolling back transaction:', rollbackError);
    }
    throw error;
  }
}

// Clear the statement cache
export function clearStatementCache(): void {
  stmtCache.clear();
}

// Close the database connection and clear statement cache
export function close(): void {
  clearStatementCache();
  
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
  // Use cached statement if available
  let stmt = stmtCache.get(sql);
  if (!stmt) {
    stmt = getConnection().prepare(sql);
    
    // Cache statement if we haven't exceeded cache size
    if (stmtCache.size < STATEMENT_CACHE_SIZE) {
      stmtCache.set(sql, stmt);
    }
  }
  
  return stmt;
}

// Generate a random UUID (utility function)
export function generateId(): string {
  return randomUUID();
}

// Initialize tables with optimized indices
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
        id TEXT PRIMARY KEY,
        eventId TEXT NOT NULL,
        tagId TEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        FOREIGN KEY (eventId) REFERENCES events(id),
        FOREIGN KEY (tagId) REFERENCES tags(id),
        UNIQUE(eventId, tagId)
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
        publicationDate DATETIME,
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

    // Categories on publications pivot table
    run(`
      CREATE TABLE IF NOT EXISTS categories_on_publications (
        id TEXT PRIMARY KEY,
        publicationId TEXT NOT NULL,
        categoryId TEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        FOREIGN KEY (publicationId) REFERENCES publications(id),
        FOREIGN KEY (categoryId) REFERENCES event_categories(id),
        UNIQUE(publicationId, categoryId)
      )
    `);

    // Tags on publications pivot table
    run(`
      CREATE TABLE IF NOT EXISTS tags_on_publications (
        id TEXT PRIMARY KEY,
        publicationId TEXT NOT NULL,
        tagId TEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        FOREIGN KEY (publicationId) REFERENCES publications(id),
        FOREIGN KEY (tagId) REFERENCES tags(id),
        UNIQUE(publicationId, tagId)
      )
    `);

    // Publication files table
    run(`
      CREATE TABLE IF NOT EXISTS publication_files (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        size INTEGER NOT NULL,
        type TEXT NOT NULL,
        publicationId TEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (publicationId) REFERENCES publications(id)
      )
    `);
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
}

// Create optimized indices for better query performance
function createIndices() {
  try {
    // Users indices
    run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    run('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
    
    // Events indices
    run('CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug)');
    run('CREATE INDEX IF NOT EXISTS idx_events_status ON events(status)');
    run('CREATE INDEX IF NOT EXISTS idx_events_published ON events(published)');
    run('CREATE INDEX IF NOT EXISTS idx_events_categoryId ON events(categoryId)');
    run('CREATE INDEX IF NOT EXISTS idx_events_startDate ON events(startDate)');
    run('CREATE INDEX IF NOT EXISTS idx_events_title ON events(title)');
    run('CREATE INDEX IF NOT EXISTS idx_events_createdAt ON events(createdAt)');
    
    // Categories indices
    run('CREATE INDEX IF NOT EXISTS idx_event_categories_slug ON event_categories(slug)');
    run('CREATE INDEX IF NOT EXISTS idx_event_categories_name ON event_categories(name)');
    
    // Publications indices
    run('CREATE INDEX IF NOT EXISTS idx_publications_slug ON publications(slug)');
    run('CREATE INDEX IF NOT EXISTS idx_publications_published ON publications(published)');
    run('CREATE INDEX IF NOT EXISTS idx_publications_categoryId ON publications(categoryId)');
    run('CREATE INDEX IF NOT EXISTS idx_publications_title ON publications(title)');
    run('CREATE INDEX IF NOT EXISTS idx_publications_createdAt ON publications(createdAt)');
    
    // Authors indices
    run('CREATE INDEX IF NOT EXISTS idx_authors_name ON authors(firstName, lastName)');
    
    // Pivot table indices
    run('CREATE INDEX IF NOT EXISTS idx_event_speakers_eventId ON event_speakers(eventId)');
    run('CREATE INDEX IF NOT EXISTS idx_event_speakers_speakerId ON event_speakers(speakerId)');
    run('CREATE INDEX IF NOT EXISTS idx_authors_publications_publicationId ON authors_on_publications(publicationId)');
    run('CREATE INDEX IF NOT EXISTS idx_authors_publications_authorId ON authors_on_publications(authorId)');
    run('CREATE INDEX IF NOT EXISTS idx_categories_publications_publicationId ON categories_on_publications(publicationId)');
    run('CREATE INDEX IF NOT EXISTS idx_tags_events_eventId ON tags_on_events(eventId)');
    run('CREATE INDEX IF NOT EXISTS idx_tags_publications_publicationId ON tags_on_publications(publicationId)');
    run('CREATE INDEX IF NOT EXISTS idx_publication_files_publicationId ON publication_files(publicationId)');
    
    // Composite indices for more efficient joins
    run('CREATE INDEX IF NOT EXISTS idx_events_combined ON events(status, published, categoryId)');
    run('CREATE INDEX IF NOT EXISTS idx_publications_combined ON publications(published, categoryId)');
  } catch (error) {
    console.error('Error creating database indices:', error);
    throw error;
  }
}

// Setup the database
export function setupDatabase(): void {
  // Initialize the database
  initTables();
  
  // Create indices for better performance
  createIndices();
  
  // Optimize the database
  try {
    if (!isVercel) {
      // Run ANALYZE to collect statistics that help the query planner
      run('ANALYZE');
      // Run vacuum to defragment the database
      getConnection().pragma('vacuum');
    }
  } catch (error) {
    console.error('Error optimizing database:', error);
  }
  
  console.log('Database setup complete');
}

// Add advanced query helpers for common patterns
export const queryBuilder = {
  // Count records with optional filters
  count: (table: string, where?: string, params?: any[]): number => {
    const whereClause = where ? ` WHERE ${where}` : '';
    const result = get<{ count: number }>(`SELECT COUNT(*) as count FROM ${table}${whereClause}`, params || []);
    return result?.count || 0;
  },
  
  // Insert a record and return the ID
  insert: (table: string, data: Record<string, any>): string | number => {
    const columns = Object.keys(data);
    const placeholders = columns.map(() => '?').join(', ');
    const values = columns.map(col => data[col]);
    
    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    const result = run(sql, values);
    
    return typeof data.id !== 'undefined' ? data.id : result.lastInsertRowid;
  },
  
  // Update a record
  update: (table: string, id: string | number, data: Record<string, any>): number => {
    const columns = Object.keys(data);
    const setClauses = columns.map(col => `${col} = ?`).join(', ');
    const values = [...columns.map(col => data[col]), id];
    
    const sql = `UPDATE ${table} SET ${setClauses} WHERE id = ?`;
    const result = run(sql, values);
    
    return result.changes;
  },
  
  // Delete a record
  delete: (table: string, id: string | number): number => {
    const sql = `DELETE FROM ${table} WHERE id = ?`;
    const result = run(sql, [id]);
    
    return result.changes;
  }
};

// Export default sqlite object with all methods
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
  generateId,
  setupDatabase,
  clearStatementCache,
  queryBuilder
};

export default sqlite; 