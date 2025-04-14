// Database initialization script
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Path to the database file
const dbPath = path.join(__dirname, 'db.sqlite');

// Ensure the database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create/open the database
const db = new sqlite3.Database(dbPath);

console.log('Database initialization started');

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create error_logs table
db.run(`
  CREATE TABLE IF NOT EXISTS error_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Check if admin user exists
db.get('SELECT id FROM users WHERE email = ?', ['admin@example.com'], (err, row) => {
  if (err) {
    console.error('Error checking for admin user:', err);
    closeDb();
    return;
  }

  // If admin doesn't exist, create one
  if (!row) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('admin123', salt);

    db.run(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      ['admin@example.com', hashedPassword, 'Admin User', 'admin'],
      function (err) {
        if (err) {
          console.error('Error creating admin user:', err);
        } else {
          console.log('Admin user created successfully with ID:', this.lastID);
        }
        closeDb();
      }
    );
  } else {
    console.log('Admin user already exists');
    closeDb();
  }
});

// Function to close the database
function closeDb() {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
      process.exit(1);
    } else {
      console.log('Database connection closed');
      console.log('Database initialization completed');
      process.exit(0);
    }
  });
} 