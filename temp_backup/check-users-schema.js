/**
 * Script to check the schema of the users table
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = './src/db.sqlite';
console.log(`Opening database at ${path.resolve(dbPath)}`);

// Open the database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');
});

// Get the table schema
db.all("PRAGMA table_info(users)", (err, rows) => {
  if (err) {
    console.error('Error getting table schema:', err.message);
    db.close();
    process.exit(1);
  }
  
  console.log('Users table schema:');
  console.table(rows);
  
  // Now let's check a sample row
  db.get("SELECT * FROM users LIMIT 1", (err, row) => {
    if (err) {
      console.error('Error getting sample row:', err.message);
    } else if (row) {
      console.log('Sample user:');
      console.log(row);
    } else {
      console.log('No users found in the table.');
    }
    
    db.close();
  });
}); 