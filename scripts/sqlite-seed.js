// SQLite seed script
// Run with: node scripts/sqlite-seed.js

const sqlite3 = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Connect to the SQLite database
const dbPath = path.join(__dirname, '../db/app.db');
const db = sqlite3(dbPath);

console.log(`Connected to SQLite database at ${dbPath}`);

// Make sure the database transaction is atomic
db.pragma('foreign_keys = ON');

// Function to seed the database
function seedDatabase() {
  try {
    // Start a transaction
    db.exec('BEGIN TRANSACTION');

    // Create default event category if it doesn't exist
    const existingCategory = db.prepare('SELECT * FROM EventCategory WHERE slug = ?').get('general');
    
    let categoryId;
    if (!existingCategory) {
      const insertCategory = db.prepare(`
        INSERT INTO EventCategory (name, slug, description, createdAt, updatedAt)
        VALUES (?, ?, ?, datetime('now'), datetime('now'))
      `);
      
      const result = insertCategory.run('General', 'general', 'General events category');
      categoryId = result.lastInsertRowid;
      
      console.log('Created default event category: General');
    } else {
      categoryId = existingCategory.id;
      console.log('Default category already exists, using existing one');
    }

    // Check if there are any events
    const eventCount = db.prepare('SELECT COUNT(*) as count FROM Event').get().count;
    
    if (eventCount === 0) {
      // Create a test event
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 2);
      
      const insertEvent = db.prepare(`
        INSERT INTO Event (
          title, slug, description, content, status, startDate, endDate, 
          published, categoryId, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `);
      
      const result = insertEvent.run(
        'Test Event',
        'test-event',
        'This is a test event',
        'Test event content',
        'UPCOMING',
        startDate.toISOString(),
        endDate.toISOString(),
        1, // SQLite boolean (1 for true)
        categoryId
      );
      
      console.log('Created test event: Test Event');
    } else {
      console.log('Skipping test event creation - events already exist');
    }

    // Seed categories
    const categories = [
      {
        name: 'Research Papers',
        slug: 'research-papers',
        description: 'Academic research papers and studies',
      },
      {
        name: 'Policy Briefs',
        slug: 'policy-briefs',
        description: 'Policy analysis and recommendations',
      },
      {
        name: 'Reports',
        slug: 'reports',
        description: 'Detailed reports and analyses',
      },
      {
        name: 'Articles',
        slug: 'articles',
        description: 'News articles and opinion pieces',
      },
    ];

    for (const category of categories) {
      const existingCat = db.prepare('SELECT * FROM categories WHERE slug = ?').get(category.slug);
      
      if (!existingCat) {
        const insertCat = db.prepare(`
          INSERT INTO categories (name, slug, description, createdAt, updatedAt)
          VALUES (?, ?, ?, datetime('now'), datetime('now'))
        `);
        
        insertCat.run(category.name, category.slug, category.description);
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Category ${category.name} already exists, skipping`);
      }
    }

    // Seed users if none exist
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    
    if (userCount === 0) {
      // Admin user
      const insertUser = db.prepare(`
        INSERT INTO users (
          name, email, password, role, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
      `);
      
      // In a real app you'd hash the password, but for demo purposes we'll use plain text
      insertUser.run(
        'Admin User',
        'admin@example.com',
        'password123', // In production, this should be hashed
        'ADMIN'
      );
      
      // Regular user
      insertUser.run(
        'Test User',
        'user@example.com',
        'password123', // In production, this should be hashed
        'USER'
      );
      
      console.log('Created test users');
    } else {
      console.log('Skipping user creation - users already exist');
    }

    // Seed publications if none exist
    const pubCount = db.prepare('SELECT COUNT(*) as count FROM Publication').get().count;
    
    if (pubCount === 0) {
      // Get category IDs
      const researchCat = db.prepare('SELECT id FROM categories WHERE slug = ?').get('research-papers');
      const articlesCat = db.prepare('SELECT id FROM categories WHERE slug = ?').get('articles');
      
      if (researchCat && articlesCat) {
        const insertPub = db.prepare(`
          INSERT INTO Publication (
            title, slug, abstract, content, status, publishedDate,
            categoryId, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `);
        
        // Sample publication 1
        insertPub.run(
          'Understanding Indonesian Electoral Systems',
          'understanding-indonesian-electoral-systems',
          'A comprehensive guide to how elections work in Indonesia.',
          '<p>Full content of the research paper goes here...</p>',
          'PUBLISHED',
          new Date('2023-05-15').toISOString(),
          researchCat.id
        );
        
        // Sample publication 2
        insertPub.run(
          'Youth Participation in Politics',
          'youth-participation-in-politics',
          'How young Indonesians can make a difference in the political landscape.',
          '<p>Content about youth participation in politics...</p>',
          'PUBLISHED',
          new Date('2023-06-22').toISOString(),
          articlesCat.id
        );
        
        console.log('Created sample publications');
      }
    } else {
      console.log('Skipping publication creation - publications already exist');
    }

    // Commit the transaction
    db.exec('COMMIT');
    console.log('Database seed completed successfully');
    
  } catch (error) {
    // Rollback the transaction on error
    db.exec('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    // Close the database connection
    db.close();
  }
}

// Run the seed function
seedDatabase(); 