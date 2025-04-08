import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

// Always use in-memory database on Vercel
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel ? ':memory:' : './src/db.sqlite';

// Set statement cache size - larger cache means better performance
const STATEMENT_CACHE_SIZE = 100;

// Connection pool (singleton)
let db: Database.Database | null = null;

// Statement cache for prepared statements
const stmtCache = new Map<string, Database.Statement>();

interface RunResult {
  lastInsertRowid: number;
  changes: number;
}

const sqlite = {
  // Get sqlite connection
  async getConnection(): Promise<Database.Database> {
    if (db) {
      return db;
    }
    
    // For connection retry logic
    let retries = 3;
    let lastError: Error | null = null;
    
    while (retries > 0) {
      try {
        // Check if running in Vercel
        if (isVercel) {
          // Create in-memory database for Vercel
          console.log('Running in Vercel environment, using in-memory database');
          db = Database(':memory:', { verbose: process.env.NODE_ENV !== 'production' ? console.log : undefined });
        } else {
          // Create file-based database for development/production
          db = Database(dbPath, { 
            verbose: process.env.NODE_ENV !== 'production' ? console.log : undefined,
            fileMustExist: false
          });
        }
        
        // Enable Write-Ahead Logging for better concurrency
        db.pragma('journal_mode = WAL');
        
        // Enable foreign keys for data integrity
        db.pragma('foreign_keys = ON');
        
        // Optimize DB for better performance
        db.pragma('cache_size = -64000'); // 64MB cache size
        
        return db;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Error connecting to database (retries left: ${retries}):`, error);
        retries--;
        
        // Wait for a short time before retrying
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }
    
    // If we get here, all retries failed
    throw new Error(`Failed to connect to database after multiple attempts: ${lastError?.message}`);
  },

  // Execute a query that doesn't return data, optimized with prepared statements
  async run(sql: string, params: any[] = []): Promise<RunResult> {
    try {
      // Use cached statement if available
      let stmt = stmtCache.get(sql);
      if (!stmt) {
        stmt = (await this.getConnection()).prepare(sql);
        
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
      console.error('SQL Error in run:', sql, 'Params:', JSON.stringify(params), 'Error:', error);
      // Add query context to the error
      if (error instanceof Error) {
        error.message = `SQL Error [${sql.slice(0, 100)}]: ${error.message}`;
      }
      throw error;
    }
  },

  // Execute a query and get a single row, optimized with prepared statements
  async get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    try {
      // Use cached statement if available
      let stmt = stmtCache.get(sql);
      if (!stmt) {
        stmt = (await this.getConnection()).prepare(sql);
        
        // Cache statement if we haven't exceeded cache size
        if (stmtCache.size < STATEMENT_CACHE_SIZE) {
          stmtCache.set(sql, stmt);
        }
      }
      
      return stmt.get(...params) as T | undefined;
    } catch (error) {
      console.error('SQL Error in get:', sql, 'Params:', JSON.stringify(params), 'Error:', error);
      // Add query context to the error
      if (error instanceof Error) {
        error.message = `SQL Error [${sql.slice(0, 100)}]: ${error.message}`;
      }
      throw error;
    }
  },

  // Execute a query and get all rows, optimized with prepared statements
  async all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      // Use cached statement if available
      let stmt = stmtCache.get(sql);
      if (!stmt) {
        stmt = (await this.getConnection()).prepare(sql);
        
        // Cache statement if we haven't exceeded cache size
        if (stmtCache.size < STATEMENT_CACHE_SIZE) {
          stmtCache.set(sql, stmt);
        }
      }
      
      return stmt.all(...params) as T[];
    } catch (error) {
      console.error('SQL Error in all:', sql, 'Params:', JSON.stringify(params), 'Error:', error);
      // Add query context to the error
      if (error instanceof Error) {
        error.message = `SQL Error [${sql.slice(0, 100)}]: ${error.message}`;
      }
      throw error;
    }
  },

  // Execute a query and iterate over rows, optimized for large datasets
  async each<T = any>(
    sql: string, 
    params: any[] = [], 
    callback: (row: T) => void
  ): Promise<number> {
    try {
      // Use cached statement if available
      let stmt = stmtCache.get(sql);
      if (!stmt) {
        stmt = (await this.getConnection()).prepare(sql);
        
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
  },

  // Execute multiple statements in a transaction with improved error handling
  async transaction<T>(
    callback: () => Promise<T> | T
  ): Promise<T> {
    const connection = await this.getConnection();
    
    try {
      connection.exec('BEGIN TRANSACTION');
      const result = await Promise.resolve(callback());
      connection.exec('COMMIT');
      return result;
    } catch (error) {
      try {
        connection.exec('ROLLBACK');
        console.error('Transaction rolled back due to error:', error);
      } catch (rollbackError) {
        console.error('Critical error: Failed to roll back transaction:', rollbackError);
        console.error('Original error:', error);
      }
      throw error;
    }
  },

  // Clear the statement cache
  async clearStatementCache(): Promise<void> {
    stmtCache.clear();
  },

  // Close the database connection and clear statement cache
  async close(): Promise<void> {
    await this.clearStatementCache();
    
    if (db) {
      db.close();
      db = null;
    }
  },

  // Utility to help with pagination
  async paginate(page: number, limit: number): Promise<{ offset: number, limit: number }> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;
    
    return { offset, limit: validLimit };
  },

  // Utility to create a prepared statement that can be reused for better performance
  async prepareStatement(sql: string): Promise<Database.Statement> {
    // Use cached statement if available
    let stmt = stmtCache.get(sql);
    if (!stmt) {
      stmt = (await this.getConnection()).prepare(sql);
      
      // Cache statement if we haven't exceeded cache size
      if (stmtCache.size < STATEMENT_CACHE_SIZE) {
        stmtCache.set(sql, stmt);
      }
    }
    
    return stmt;
  },

  // Generate a unique ID
  async generateId(): Promise<string> {
    return randomUUID();
  }
};

export default sqlite; 