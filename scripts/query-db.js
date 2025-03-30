// Script to query the SQLite database and show its contents
// Run with: node scripts/query-db.js

const sqlite3 = require('better-sqlite3');
const path = require('path');

// Connect to the SQLite database
const dbPath = path.join(__dirname, '../prisma/dev.db');
const db = sqlite3(dbPath);

console.log(`Connected to SQLite database at ${dbPath}`);

// Function to query and display table contents
function displayTableContents(tableName) {
  try {
    // Check if table exists
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name=?
    `).get(tableName);
    
    if (!tableExists) {
      console.log(`Table ${tableName} does not exist.`);
      return;
    }
    
    // Get row count
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get().count;
    console.log(`\n=== ${tableName} (${count} rows) ===`);
    
    if (count === 0) {
      console.log('  No data');
      return;
    }
    
    // Get columns for pretty printing
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
    const columnNames = columns.map(col => col.name);
    
    // Get all rows
    const rows = db.prepare(`SELECT * FROM ${tableName} LIMIT 10`).all();
    
    // Display rows
    rows.forEach((row, index) => {
      console.log(`\n  Row ${index + 1}:`);
      columnNames.forEach(col => {
        // Only show non-null values and truncate long text
        if (row[col] !== null) {
          let value = row[col];
          if (typeof value === 'string' && value.length > 100) {
            value = value.substring(0, 100) + '...';
          }
          console.log(`    ${col}: ${value}`);
        }
      });
    });
    
    if (count > 10) {
      console.log(`\n  ... and ${count - 10} more rows`);
    }
    
  } catch (error) {
    console.error(`Error querying table ${tableName}:`, error);
  }
}

// Function to check relationships
function checkRelationship(table1, table2, foreignKey) {
  try {
    const query = `
      SELECT COUNT(*) as count
      FROM ${table1} t1
      JOIN ${table2} t2 ON t1.${foreignKey} = t2.id
    `;
    
    const result = db.prepare(query).get();
    console.log(`\nRelationship check: ${table1}.${foreignKey} -> ${table2}.id`);
    console.log(`  ${result.count} related records found`);
  } catch (error) {
    console.error(`Error checking relationship ${table1}.${foreignKey} -> ${table2}.id:`, error);
  }
}

// Main function to display database contents
function displayDatabase() {
  try {
    // List of tables to check
    const tables = [
      'users',
      'profiles',
      'categories',
      'EventCategory',
      'Event',
      'Speaker',
      'EventSpeaker',
      'Publication'
    ];
    
    // Display contents of each table
    tables.forEach(displayTableContents);
    
    // Check relationships
    console.log('\n\n=== Relationship Checks ===');
    checkRelationship('Event', 'EventCategory', 'categoryId');
    checkRelationship('Publication', 'categories', 'categoryId');
    checkRelationship('profiles', 'users', 'userId');
    
  } catch (error) {
    console.error('Error displaying database:', error);
  } finally {
    db.close();
  }
}

// Run the display function
displayDatabase(); 