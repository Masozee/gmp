import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Get the database file location from environment variable
const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './prisma/dev.db';

let db: Database.Database | null = null;

// Get sqlite connection
export function getConnection(): Database.Database {
  if (!db) {
    // Ensure the database file exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new Database(dbPath, { verbose: process.env.NODE_ENV === 'development' ? console.log : undefined });
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Optimize performance
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    db.pragma('cache_size = 10000');
    db.pragma('temp_store = MEMORY');
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
export async function transaction<T>(
  callback: () => Promise<T> | T
): Promise<T> {
  const connection = getConnection();
  
  try {
    connection.exec('BEGIN TRANSACTION');
    const result = await callback();
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

// Setup function to ensure necessary tables and indices exist
export async function setupDatabase(): Promise<void> {
  // This function can be expanded for database migrations if needed
  console.log('SQLite database setup completed');
}

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
  setupDatabase
};

export default sqlite; 