import { initializeDatabase, db } from '../src/lib/db';
import { partners } from '../src/lib/db/content-schema';
import partnersData from '../src/data/partners.json';

async function migratePartners() {
  console.log('Starting partners migration...');
  
  // Initialize database
  initializeDatabase();
  
  try {
    // Clear existing partners (optional - remove this if you want to keep existing data)
    // await db.delete(partners);
    // console.log('Cleared existing partners');

    // Insert partners from JSON
    console.log(`Migrating ${partnersData.partners.length} partners...`);
    
    for (const partner of partnersData.partners) {
      try {
        await db.insert(partners).values({
          order: partner.order,
          name: partner.name,
          logo: partner.logo,
          url: partner.url,
        }).onConflictDoNothing(); // Skip if already exists
        
        console.log(`✅ Migrated: ${partner.name}`);
      } catch (error) {
        console.log(`❌ Failed to migrate ${partner.name}:`, error);
      }
    }
    
    console.log('✅ Partners migration completed successfully!');
    
    // Verify migration
    const allPartners = await db.select().from(partners);
    console.log(`📊 Total partners in database: ${allPartners.length}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migratePartners(); 