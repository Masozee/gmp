/**
 * Database Check Script
 * 
 * This script checks the current state of the SQLite database.
 */

const Database = require('better-sqlite3');
const db = new Database('./db/app.db');

// Check tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
console.log('Tables in database:');
tables.forEach(table => console.log(`- ${table.name}`));

// Check admin user
const admin = db.prepare("SELECT * FROM users WHERE email = 'admin@example.com'").get();
console.log('\nAdmin user:', admin ? 'Exists' : 'Does not exist');
if (admin) {
  console.log(`- ID: ${admin.id}`);
  console.log(`- Name: ${admin.name}`);
  console.log(`- Role: ${admin.role}`);
}

// Check example category
const category = db.prepare("SELECT * FROM event_categories WHERE slug = 'example-category'").get();
console.log('\nExample category:', category ? 'Exists' : 'Does not exist');
if (category) {
  console.log(`- ID: ${category.id}`);
  console.log(`- Name: ${category.name}`);
  console.log(`- Description: ${category.description}`);
}

db.close(); 