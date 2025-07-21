#!/usr/bin/env bun

import { db } from '../src/lib/db';

async function addEnglishFieldsToPublications() {
  console.log('Adding English fields to publications table...');
  
  try {
    // Add the English columns to the publications table
    await db.run(`
      ALTER TABLE publications ADD COLUMN title_en TEXT;
    `);
    console.log('✓ Added title_en column');

    await db.run(`
      ALTER TABLE publications ADD COLUMN slug_en TEXT;
    `);
    console.log('✓ Added slug_en column');

    await db.run(`
      ALTER TABLE publications ADD COLUMN author_en TEXT;
    `);
    console.log('✓ Added author_en column');

    await db.run(`
      ALTER TABLE publications ADD COLUMN description_en TEXT;
    `);
    console.log('✓ Added description_en column');

    await db.run(`
      ALTER TABLE publications ADD COLUMN content_en TEXT;
    `);
    console.log('✓ Added content_en column');

    console.log('✅ Successfully added all English fields to publications table');
  } catch (error) {
    console.error('❌ Error adding English fields:', error);
    throw error;
  }
}

// Run the migration
addEnglishFieldsToPublications()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });