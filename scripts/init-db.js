// Initialize the SQLite database
// Run with: node scripts/init-db.js

// Use native SQLite to ensure we can initialize an empty database
const sqlite3 = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Connect to the SQLite database
const dbPath = path.join(__dirname, '../prisma/dev.db');

// Delete existing database if it's empty or recreate from scratch
if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  if (stats.size === 0) {
    console.log(`Removing empty database file at ${dbPath}`);
    fs.unlinkSync(dbPath);
  } else {
    console.log(`Database file already exists at ${dbPath} and is not empty`);
    process.exit(0);
  }
}

console.log(`Creating new database at ${dbPath}`);
const db = sqlite3(dbPath);

console.log(`Connected to SQLite database at ${dbPath}`);

// Make sure the database transaction is atomic
db.pragma('foreign_keys = ON');

try {
  // Begin transaction
  db.exec('BEGIN TRANSACTION');

  // Create tables based on schema from init-database.ts
  const schemaStatements = [
    // Users table
    `CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password TEXT,
      role TEXT DEFAULT 'USER',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Profiles table
    `CREATE TABLE profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      email TEXT,
      name TEXT,
      bio TEXT,
      image TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`,
    
    // Categories table
    `CREATE TABLE categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Tags table
    `CREATE TABLE tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Event categories table
    `CREATE TABLE EventCategory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Events table
    `CREATE TABLE Event (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      content TEXT,
      location TEXT,
      venue TEXT,
      startDate DATETIME,
      endDate DATETIME,
      posterImage TEXT,
      posterCredit TEXT,
      status TEXT DEFAULT 'DRAFT',
      published INTEGER DEFAULT 0,
      categoryId INTEGER,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES EventCategory(id)
    )`,
    
    // Speakers table
    `CREATE TABLE Speaker (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      organization TEXT,
      bio TEXT,
      photoUrl TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Event speakers junction table
    `CREATE TABLE EventSpeaker (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventId INTEGER NOT NULL,
      speakerId INTEGER NOT NULL,
      role TEXT,
      displayOrder INTEGER DEFAULT 0,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (eventId) REFERENCES Event(id) ON DELETE CASCADE,
      FOREIGN KEY (speakerId) REFERENCES Speaker(id) ON DELETE CASCADE
    )`,
    
    // Publications table
    `CREATE TABLE Publication (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      abstract TEXT,
      content TEXT,
      status TEXT DEFAULT 'DRAFT',
      publishedDate DATETIME,
      coverImage TEXT,
      categoryId INTEGER,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES categories(id)
    )`,
    
    // Tags on events junction table
    `CREATE TABLE tags_on_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventId INTEGER NOT NULL,
      tagId INTEGER NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (eventId) REFERENCES Event(id) ON DELETE CASCADE,
      FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
    )`,
    
    // Error logs table
    `CREATE TABLE error_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      stack TEXT,
      path TEXT,
      method TEXT,
      userId INTEGER,
      severity TEXT DEFAULT 'ERROR',
      metadata TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`
  ];

  // Execute all table creation statements
  schemaStatements.forEach(statement => {
    console.log(`Creating table: ${statement.split('\n')[0]}`);
    db.exec(statement);
  });

  // Create indices for frequently queried columns
  const indices = [
    // Events table indices
    'CREATE INDEX IF NOT EXISTS idx_events_status ON Event(status)',
    'CREATE INDEX IF NOT EXISTS idx_events_category_id ON Event(categoryId)',
    'CREATE INDEX IF NOT EXISTS idx_events_start_date ON Event(startDate)',
    'CREATE INDEX IF NOT EXISTS idx_events_slug ON Event(slug)',
    
    // Tags and categories indices
    'CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name)',
    'CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug)',
    'CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)',
    
    // Relational table indices
    'CREATE INDEX IF NOT EXISTS idx_event_speakers_event_id ON EventSpeaker(eventId)',
    'CREATE INDEX IF NOT EXISTS idx_event_speakers_speaker_id ON EventSpeaker(speakerId)',
    'CREATE INDEX IF NOT EXISTS idx_tags_on_events_event_id ON tags_on_events(eventId)',
    'CREATE INDEX IF NOT EXISTS idx_tags_on_events_tag_id ON tags_on_events(tagId)',
    
    // User and profile indices
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
    'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
    'CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(userId)',
    'CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email)',
    
    // Publications indices
    'CREATE INDEX IF NOT EXISTS idx_publications_slug ON Publication(slug)',
    'CREATE INDEX IF NOT EXISTS idx_publications_status ON Publication(status)',
    'CREATE INDEX IF NOT EXISTS idx_publications_category_id ON Publication(categoryId)',
    
    // Error logs indices
    'CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(createdAt)',
    'CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity)',
  ];
  
  // Execute all index creation statements
  indices.forEach(indexSQL => {
    console.log(`Creating index: ${indexSQL}`);
    db.exec(indexSQL);
  });

  // Commit the transaction
  db.exec('COMMIT');
  console.log('Database initialization completed successfully');
} catch (error) {
  db.exec('ROLLBACK');
  console.error('Error initializing database:', error);
  process.exit(1);
} finally {
  // Close the database connection
  db.close();
} 