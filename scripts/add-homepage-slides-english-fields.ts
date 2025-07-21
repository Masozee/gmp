import { initializeDatabase, db } from '../src/lib/db/index';

async function addEnglishFieldsToHomepageSlides() {
  try {
    console.log('Adding English fields to homepage_slides table...');
    
    // Add English fields to homepage_slides table
    await db.run(`
      ALTER TABLE homepage_slides ADD COLUMN title_en TEXT;
    `);
    
    await db.run(`
      ALTER TABLE homepage_slides ADD COLUMN subtitle_en TEXT;
    `);
    
    await db.run(`
      ALTER TABLE homepage_slides ADD COLUMN description_en TEXT;
    `);
    
    await db.run(`
      ALTER TABLE homepage_slides ADD COLUMN button_text_en TEXT;
    `);
    
    await db.run(`
      ALTER TABLE homepage_slides ADD COLUMN button_link_en TEXT;
    `);

    console.log('✅ Successfully added English fields to homepage_slides table');
    
    // Verify the changes
    const result = await db.run(`
      PRAGMA table_info(homepage_slides);
    `);
    
    console.log('Table structure after migration:', result);
    
  } catch (error) {
    console.error('❌ Error adding English fields:', error);
    throw error;
  }
}

// Run the migration
initializeDatabase();
addEnglishFieldsToHomepageSlides()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });