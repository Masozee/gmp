import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import * as contentSchema from './content-schema';

// Create LibSQL client with support for both local and cloud (Turso)
// Use environment variable or default to local file
const client = createClient({
  url: process.env.DATABASE_URL || 'file:./database.sqlite',
  authToken: process.env.DATABASE_AUTH_TOKEN, // For Turso cloud hosting
});

// Combine all schemas
const allSchemas = { ...schema, ...contentSchema };

export const db = drizzle(client, { schema: allSchemas });

// Simple database initialization without migrations
export function initializeDatabase() {
  console.log('Database client initialized');
}

// Re-export everything from schemas
export * from './schema';
export * from './content-schema'; 