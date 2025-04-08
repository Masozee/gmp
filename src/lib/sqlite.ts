import { Database } from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

// Always use in-memory database on Vercel
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel ? ':memory:' : './src/db.sqlite';

// For singleton pattern
let db: Database | null = null;

interface RunResult {
  lastInsertRowid: number;
  changes: number;
}

// Create a Promise-based wrapper around sqlite3
function createConnection(): Promise<Database> {
  return new Promise((resolve, reject) => {
    try {
      const database = new Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
          return;
        }
        
        // Enable foreign keys
        database.run('PRAGMA foreign_keys = ON', (pragmaErr) => {
          if (pragmaErr) {
            console.error('Error setting PRAGMA:', pragmaErr);
            reject(pragmaErr);
            return;
          }
          resolve(database);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

const sqlite = {
  // Get database connection (singleton pattern)
  async getConnection(): Promise<Database> {
    if (!db) {
      db = await createConnection();
      
      // Initialize in-memory database if on Vercel
      if (isVercel) {
        console.log('Running in Vercel environment, using in-memory database');
        // Setup tables here or call setupDatabase
      }
    }
    return db;
  },
  
  // Run a query that doesn't return data
  async run(sql: string, params: any[] = []): Promise<RunResult> {
    return new Promise(async (resolve, reject) => {
      const connection = await this.getConnection();
      connection.run(sql, params, function(this: { lastID: number, changes: number }, err) {
        if (err) {
          console.error('SQL Error in run:', sql, 'Params:', JSON.stringify(params), 'Error:', err);
          reject(err);
          return;
        }
        resolve({
          lastInsertRowid: this.lastID,
          changes: this.changes
        });
      });
    });
  },
  
  // Get a single row from a query
  async get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise(async (resolve, reject) => {
      const connection = await this.getConnection();
      connection.get(sql, params, (err, row) => {
        if (err) {
          console.error('SQL Error in get:', sql, 'Params:', JSON.stringify(params), 'Error:', err);
          reject(err);
          return;
        }
        resolve(row as T | undefined);
      });
    });
  },
  
  // Get all rows from a query
  async all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise(async (resolve, reject) => {
      const connection = await this.getConnection();
      connection.all(sql, params, (err, rows) => {
        if (err) {
          console.error('SQL Error in all:', sql, 'Params:', JSON.stringify(params), 'Error:', err);
          reject(err);
          return;
        }
        resolve(rows as T[]);
      });
    });
  },
  
  // Execute a query and process rows one at a time
  async each<T = any>(
    sql: string, 
    params: any[] = [], 
    callback: (row: T) => void
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const connection = await this.getConnection();
      let count = 0;
      
      connection.each(sql, params, 
        // Row callback
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          callback(row as T);
          count++;
        },
        // Completion callback
        (err, totalRows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(count);
        }
      );
    });
  },
  
  // Execute a transaction
  async transaction<T>(callback: () => Promise<T> | T): Promise<T> {
    const connection = await this.getConnection();
    
    return new Promise(async (resolve, reject) => {
      connection.run('BEGIN TRANSACTION', async (beginErr) => {
        if (beginErr) {
          reject(beginErr);
          return;
        }
        
        try {
          const result = await Promise.resolve(callback());
          
          connection.run('COMMIT', (commitErr) => {
            if (commitErr) {
              connection.run('ROLLBACK', () => {
                reject(commitErr);
              });
              return;
            }
            resolve(result);
          });
        } catch (error) {
          connection.run('ROLLBACK', (rollbackErr) => {
            if (rollbackErr) {
              console.error('Failed to roll back transaction:', rollbackErr);
            }
            reject(error);
          });
        }
      });
    });
  },
  
  // Close the database connection
  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!db) {
        resolve();
        return;
      }
      
      db.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        db = null;
        resolve();
      });
    });
  },
  
  // Utility for pagination
  async paginate(page: number, limit: number): Promise<{ offset: number, limit: number }> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;
    
    return { offset, limit: validLimit };
  },
  
  // Generate a unique ID
  generateId(): string {
    return randomUUID();
  },
  
  // Setup database tables and schema
  async setupDatabase(): Promise<void> {
    const connection = await this.getConnection();
    
    // Define all your tables here
    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        emailVerified DATETIME,
        image TEXT,
        role TEXT,
        password TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )`,
      
      // Categories table
      `CREATE TABLE IF NOT EXISTS event_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )`,
      
      // Events table
      `CREATE TABLE IF NOT EXISTS events (
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
      )`
    ];
    
    for (const tableSql of tables) {
      await this.run(tableSql);
    }
    
    // Create indices
    const indices = [
      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
      `CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug)`,
      `CREATE INDEX IF NOT EXISTS idx_events_category ON events(categoryId)`
    ];
    
    for (const indexSql of indices) {
      await this.run(indexSql);
    }
    
    // Check for and create admin user if needed
    const adminExists = await this.get(
      "SELECT id FROM users WHERE email = ? AND role = ?",
      ["admin@example.com", "ADMIN"]
    );
    
    if (!adminExists) {
      console.log('Creating admin user...');
      
      const now = new Date().toISOString();
      const userId = this.generateId();
      
      // Create admin user
      await this.run(
        "INSERT INTO users (id, name, email, role, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, "Admin User", "admin@example.com", "ADMIN", "$2a$10$8r0aGeQoqQioRh8LQgB5Y.BwqR6EUQ2oe5YHBnwKDJ0K0UZnuoiC.", now, now]
      );
      
      console.log('Admin user created with default password (admin123)');
    }
  }
};

export default sqlite; 