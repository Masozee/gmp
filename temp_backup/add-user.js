/**
 * Script to add a new user to the database
 */

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Database path
const dbPath = './src/db.sqlite';

// Check if database exists
if (!fs.existsSync(dbPath)) {
  console.error(`Database file not found at ${path.resolve(dbPath)}`);
  console.log('Available files in directory:');
  const dir = path.dirname(dbPath);
  if (fs.existsSync(dir)) {
    console.log(fs.readdirSync(dir));
  } else {
    console.log(`Directory ${dir} does not exist`);
  }
  process.exit(1);
}

console.log(`Opening database at ${path.resolve(dbPath)}`);

// Open the database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');
});

// Enable verbose error messages
db.on('trace', (sql) => {
  console.log('SQL:', sql);
});

async function createUser() {
  try {
    // User details
    const user = {
      email: "dev@csis.or.id",
      password: "B6585esp__",
      name: "Nuroji Lukman Syah",
      role: "admin" // lowercase, based on the schema
    };

    console.log('Hashing password...');
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    console.log('Checking if user already exists...');
    
    // Check if user with this email already exists
    db.get('SELECT id FROM users WHERE email = ?', [user.email], (err, row) => {
      if (err) {
        console.error('Error checking existing user:', err.message);
        db.close();
        return;
      }
      
      if (row) {
        console.log(`User with email ${user.email} already exists with ID: ${row.id}`);
        console.log('Updating user information...');
        
        // Update the existing user
        db.run(
          `UPDATE users SET name = ?, password = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [user.name, hashedPassword, user.role, row.id],
          function(err) {
            if (err) {
              console.error('Error updating user:', err.message);
            } else {
              console.log(`User updated successfully! ID: ${row.id}`);
              console.log(`Name: ${user.name}`);
              console.log(`Email: ${user.email}`);
              console.log(`Role: ${user.role}`);
            }
            db.close();
          }
        );
      } else {
        console.log('Creating new user...');
        
        // Insert the new user
        db.run(
          `INSERT INTO users (email, password, name, role) 
           VALUES (?, ?, ?, ?)`,
          [
            user.email,
            hashedPassword,
            user.name,
            user.role
          ],
          function(err) {
            if (err) {
              console.error('Error creating user:', err.message);
            } else {
              console.log(`User created successfully! ID: ${this.lastID}`);
              console.log(`Name: ${user.name}`);
              console.log(`Email: ${user.email}`);
              console.log(`Role: ${user.role}`);
              console.log('Login credentials:');
              console.log(`Email: ${user.email}`);
              console.log(`Password: ${user.password}`);
            }
            db.close();
          }
        );
      }
    });
  } catch (error) {
    console.error('Failed to create user:', error);
    db.close();
  }
}

// Execute the function
createUser(); 