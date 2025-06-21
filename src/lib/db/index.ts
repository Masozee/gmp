import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';
import * as contentSchema from './content-schema';
import path from 'path';

const sqlite = new Database(path.join(process.cwd(), 'database.sqlite'));

// Combine all schemas
const allSchemas = { ...schema, ...contentSchema };

export const db = drizzle(sqlite, { schema: allSchemas });

// Auto-migrate on startup
export function initializeDatabase() {
  try {
    migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Database migration failed:', error);
  }
}

export * from './schema';
export * from './content-schema'; 