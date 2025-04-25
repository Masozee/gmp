import { Database } from 'sqlite3';
import { randomUUID } from 'crypto';

// Always use in-memory database on Vercel
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel ? ':memory:' : './src/db/app.db';

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
  async run(sql: string, params: unknown[] = []): Promise<RunResult> {
    return new Promise(async (resolve, reject) => {
      const connection = await this.getConnection();
      connection.run(sql, params, function(this: { lastID: number, changes: number }, err: Error | null) {
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
  async get<T = unknown>(sql: string, params: unknown[] = []): Promise<T | undefined> {
    return new Promise(async (resolve, reject) => {
      const connection = await this.getConnection();
      connection.get(sql, params, (err: Error | null, row: unknown) => {
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
  async all<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    return new Promise(async (resolve, reject) => {
      const connection = await this.getConnection();
      connection.all(sql, params, (err: Error | null, rows: unknown) => {
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
  async each<T = unknown>(
    sql: string, 
    params: unknown[] = [], 
    callback: (row: T) => void
  ): Promise<number> {
    const connection = await this.getConnection();
    return new Promise((resolve, reject) => {
      let count = 0;
      
      connection.each(sql, params, 
        // Row callback
        (err: Error | null, row: unknown) => {
          if (err) {
            reject(err);
            return;
          }
          callback(row as T);
          count++;
        },
        // Completion callback
        (err: Error | null) => {
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
      connection.run('BEGIN TRANSACTION', async (beginErr: Error | null) => {
        if (beginErr) {
          reject(beginErr);
          return;
        }
        
        try {
          const result = await Promise.resolve(callback());
          
          connection.run('COMMIT', (commitErr: Error | null) => {
            if (commitErr) {
              connection.run('ROLLBACK', () => {
                reject(commitErr);
              });
              return;
            }
            resolve(result);
          });
        } catch (error) {
          connection.run('ROLLBACK', (rollbackErr: Error | null) => {
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
    try {
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
        
        // Tasks table
        `CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT NOT NULL,
          priority TEXT NOT NULL,
          dueDate DATETIME,
          completedDate DATETIME,
          assignedTo TEXT,
          delegatedBy TEXT,
          reviewStatus TEXT DEFAULT 'PENDING',
          reviewComment TEXT,
          reviewDate DATETIME,
          createdBy TEXT,
          agentId TEXT,
          tags TEXT,
          sharedFiles TEXT,
          deleted INTEGER DEFAULT 0,
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
        )`,
        
        // Speakers table
        `CREATE TABLE IF NOT EXISTS speakers (
          id TEXT PRIMARY KEY,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          organization TEXT,
          bio TEXT,
          profileImage TEXT,
          email TEXT,
          website TEXT,
          socialMedia TEXT,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL
        )`,
        
        // Presentation table
        `CREATE TABLE IF NOT EXISTS presentation (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          abstract TEXT,
          speakerId TEXT NOT NULL,
          eventId TEXT NOT NULL,
          duration INTEGER, 
          startTime DATETIME,
          endTime DATETIME,
          slidesUrl TEXT,
          videoUrl TEXT,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          FOREIGN KEY (speakerId) REFERENCES speakers(id),
          FOREIGN KEY (eventId) REFERENCES events(id)
        )`
      ];
      
      // Execute each table creation query
      for (const query of tables) {
        await this.run(query);
      }
      
      // Create indexes after tables are created
      const indexes = [
        // Add your indexes here
        `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
        `CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`,
        `CREATE INDEX IF NOT EXISTS idx_tasks_assignedTo ON tasks(assignedTo)`,
        `CREATE INDEX IF NOT EXISTS idx_tasks_deleted ON tasks(deleted)`,
        `CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug)`,
        `CREATE INDEX IF NOT EXISTS idx_events_category ON events(categoryId)`,
        `CREATE INDEX IF NOT EXISTS idx_presentation_speaker ON presentation(speakerId)`,
        `CREATE INDEX IF NOT EXISTS idx_presentation_event ON presentation(eventId)`
      ];
      
      // Create each index
      for (const indexQuery of indexes) {
        await this.run(indexQuery);
      }
      
      console.log('Database setup completed successfully');
    } catch (error) {
      console.error('Error setting up database:', error);
      throw error;
    }
  }
};

export default sqlite; 