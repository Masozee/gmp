import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function addVisitorTrackingTable() {
  console.log('Adding visitor tracking table...');
  
  try {
    // Create the visitor_tracking table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS visitor_tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content_type TEXT NOT NULL,
        content_id TEXT NOT NULL,
        content_title TEXT NOT NULL,
        action_type TEXT NOT NULL,
        user_agent TEXT,
        ip_address TEXT,
        referrer TEXT,
        session_id TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await db.run(sql`
      CREATE INDEX IF NOT EXISTS idx_visitor_tracking_content 
      ON visitor_tracking(content_type, content_id)
    `);

    await db.run(sql`
      CREATE INDEX IF NOT EXISTS idx_visitor_tracking_action 
      ON visitor_tracking(action_type)
    `);

    await db.run(sql`
      CREATE INDEX IF NOT EXISTS idx_visitor_tracking_date 
      ON visitor_tracking(created_at)
    `);

    await db.run(sql`
      CREATE INDEX IF NOT EXISTS idx_visitor_tracking_session 
      ON visitor_tracking(session_id)
    `);

    console.log('✅ Visitor tracking table and indexes created successfully!');
  } catch (error) {
    console.error('❌ Error creating visitor tracking table:', error);
    throw error;
  }
}

// Run the migration
if (require.main === module) {
  addVisitorTrackingTable()
    .then(() => {
      console.log('Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { addVisitorTrackingTable }; 