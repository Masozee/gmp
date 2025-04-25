

// Flag to track initialization
let isInitialized = false;

/**
 * Initialize the database with performance optimizations and indices
 */
export async function initDatabase(): Promise<void> {
  // Skip if already initialized
  if (isInitialized) {
    return;
  }
  
  console.log('Initializing SQLite database...');
  
  try {
    // Create tables if they don't exist
    createTables();
    
    // Create indices for better performance
    createIndices();
    
    isInitialized = true;
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

function createTables() {
  // Users table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      emailVerified DATETIME,
      image TEXT,
      role TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);

  // Categories table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS event_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);

  // Tags table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);

  // Events table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      content TEXT,
      location TEXT NOT NULL,
      venue TEXT,
      startDate DATETIME NOT NULL,
      endDate DATETIME NOT NULL,
      posterImage TEXT,
      posterCredit TEXT,
      status TEXT NOT NULL,
      published INTEGER NOT NULL DEFAULT 0,
      categoryId TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      FOREIGN KEY (categoryId) REFERENCES event_categories(id)
    )
  `);

  // Speakers table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS speakers (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      title TEXT,
      bio TEXT,
      organization TEXT,
      photoUrl TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);

  // Event speakers pivot table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS event_speakers (
      id TEXT PRIMARY KEY,
      eventId TEXT NOT NULL,
      speakerId TEXT NOT NULL,
      displayOrder INTEGER NOT NULL,
      role TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      FOREIGN KEY (eventId) REFERENCES events(id),
      FOREIGN KEY (speakerId) REFERENCES speakers(id),
      UNIQUE(eventId, speakerId)
    )
  `);

  // Tags on events pivot table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS tags_on_events (
      eventId TEXT NOT NULL,
      tagId TEXT NOT NULL,
      createdAt DATETIME NOT NULL,
      PRIMARY KEY (eventId, tagId),
      FOREIGN KEY (eventId) REFERENCES events(id),
      FOREIGN KEY (tagId) REFERENCES tags(id)
    )
  `);

  // Publications table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS publications (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      abstract TEXT NOT NULL,
      content TEXT,
      publicationDate DATETIME NOT NULL,
      coverImage TEXT,
      imageCredit TEXT,
      published INTEGER NOT NULL DEFAULT 0,
      categoryId TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      FOREIGN KEY (categoryId) REFERENCES event_categories(id)
    )
  `);

  // Authors table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS authors (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phoneNumber TEXT,
      organization TEXT,
      bio TEXT,
      category TEXT NOT NULL,
      photoUrl TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);

  // Authors on publications pivot table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS authors_on_publications (
      id TEXT PRIMARY KEY,
      publicationId TEXT NOT NULL,
      authorId TEXT NOT NULL,
      displayOrder INTEGER NOT NULL,
      role TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      FOREIGN KEY (publicationId) REFERENCES publications(id),
      FOREIGN KEY (authorId) REFERENCES authors(id),
      UNIQUE(publicationId, authorId)
    )
  `);

  // Tags on publications pivot table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS tags_on_publications (
      publicationId TEXT NOT NULL,
      tagId TEXT NOT NULL,
      createdAt DATETIME NOT NULL,
      PRIMARY KEY (publicationId, tagId),
      FOREIGN KEY (publicationId) REFERENCES publications(id),
      FOREIGN KEY (tagId) REFERENCES tags(id)
    )
  `);
}

function createIndices() {
  // Users indices
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  
  // Categories indices
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_categories_slug ON event_categories(slug)`);
  
  // Events indices
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug)`);
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_events_category ON events(categoryId)`);
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_events_status ON events(status)`);
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_events_published ON events(published)`);
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_events_date ON events(startDate, endDate)`);
  
  // Publications indices
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_publications_slug ON publications(slug)`);
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_publications_category ON publications(categoryId)`);
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_publications_published ON publications(published)`);
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_publications_date ON publications(publicationDate)`);
  
  // Event speakers indices
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_event_speakers_event ON event_speakers(eventId)`);
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_event_speakers_speaker ON event_speakers(speakerId)`);
  
  // Authors on publications indices
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_authors_publications_pub ON authors_on_publications(publicationId)`);
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_authors_publications_author ON authors_on_publications(authorId)`);
  
  // Authors indices
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_authors_email ON authors(email)`);
  sqlite.run(`CREATE INDEX IF NOT EXISTS idx_authors_category ON authors(category)`);
}

// Initialize database on import
initDatabase().catch(console.error);

export default initDatabase; 