import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { migrate } from 'drizzle-orm/libsql/migrator';

async function runMigrations() {
  console.log('Running database migrations...');
  
  try {
    // Create LibSQL client
    const client = createClient({
      url: process.env.DATABASE_URL || 'file:database.sqlite',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });

    const db = drizzle(client);
    
    // Run migrations
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Database migrations completed successfully');
    
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    process.exit(1);
  }
}

runMigrations(); 