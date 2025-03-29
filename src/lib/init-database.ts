import sqlite from './sqlite';

/**
 * Initialize the database with performance optimizations and indices
 */
export async function initDatabase(): Promise<void> {
  console.log('Initializing database with performance optimizations...');
  
  const isServerless = process.env.VERCEL === '1';
  const db = sqlite.getConnection();
  
  // Set up performance pragmas (skip some in serverless/memory DB)
  const pragmas = [
    // Enable foreign keys for data integrity
    'PRAGMA foreign_keys = ON',
  ];
  
  // Add file-based optimizations only when not in serverless environment
  if (!isServerless) {
    pragmas.push(
      // Use Write-Ahead Logging for better concurrency
      'PRAGMA journal_mode = WAL',
      
      // Reduce fsync calls for better write performance
      'PRAGMA synchronous = NORMAL',
      
      // Increase cache size for better read performance (10MB)
      'PRAGMA cache_size = 10000',
      
      // Store temp tables in memory for better performance
      'PRAGMA temp_store = MEMORY',
      
      // Memory-mapped I/O for database file (up to 1GB)
      'PRAGMA mmap_size = 1073741824',
      
      // Set page size to 4KB (default for most file systems)
      'PRAGMA page_size = 4096'
    );
  }
  
  // Execute all pragmas
  pragmas.forEach(pragma => {
    console.log(`Executing: ${pragma}`);
    db.pragma(pragma.replace('PRAGMA ', '').replace(' = ', '='));
  });
  
  // In serverless environment, we need to create the tables
  if (isServerless) {
    await createTablesIfNeeded();
  }
  
  // Create indices for frequently queried columns
  const indices = [
    // Events table indices
    'CREATE INDEX IF NOT EXISTS idx_events_status ON events(status)',
    'CREATE INDEX IF NOT EXISTS idx_events_category_id ON events(categoryId)',
    'CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(startDate)',
    'CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug)',
    
    // Tags and categories indices
    'CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name)',
    'CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug)',
    'CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)',
    
    // Relational table indices
    'CREATE INDEX IF NOT EXISTS idx_event_speakers_event_id ON event_speakers(eventId)',
    'CREATE INDEX IF NOT EXISTS idx_event_speakers_speaker_id ON event_speakers(speakerId)',
    'CREATE INDEX IF NOT EXISTS idx_tags_on_events_event_id ON tags_on_events(eventId)',
    'CREATE INDEX IF NOT EXISTS idx_tags_on_events_tag_id ON tags_on_events(tagId)',
    
    // User and profile indices
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
    'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
    'CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(userId)',
    'CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email)',
    
    // Error logs indices
    'CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(createdAt)',
    'CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity)',
  ];
  
  // Execute all index creation statements
  try {
    sqlite.transaction(() => {
      indices.forEach(indexSQL => {
        console.log(`Creating index: ${indexSQL}`);
        db.exec(indexSQL);
      });
      
      console.log('All indices created successfully');
      return true;
    });
  } catch (error) {
    console.error('Error creating indices:', error);
  }
  
  console.log('Database initialization completed');
}

/**
 * Create database tables when needed (for serverless environment)
 */
async function createTablesIfNeeded(): Promise<void> {
  const isServerless = process.env.VERCEL === '1';
  
  if (!isServerless) {
    // Skip table creation in non-serverless environment
    return;
  }
  
  console.log('Creating database tables for serverless environment...');
  
  const db = sqlite.getConnection();
  
  // Define the table creation SQL statements
  const tableCreationStatements = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password TEXT,
      role TEXT DEFAULT 'USER',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )`,
    
    // Profiles table
    `CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      userId TEXT,
      email TEXT,
      name TEXT,
      bio TEXT,
      image TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`,
    
    // Categories table
    `CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )`,
    
    // Tags table
    `CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )`,
    
    // Events table
    `CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      content TEXT,
      location TEXT,
      venue TEXT,
      startDate TEXT,
      endDate TEXT,
      posterImage TEXT,
      posterCredit TEXT,
      status TEXT DEFAULT 'DRAFT',
      published INTEGER DEFAULT 0,
      categoryId TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (categoryId) REFERENCES event_categories(id)
    )`,
    
    // Event categories table
    `CREATE TABLE IF NOT EXISTS event_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )`,
    
    // Speakers table
    `CREATE TABLE IF NOT EXISTS speakers (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      organization TEXT,
      bio TEXT,
      photoUrl TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )`,
    
    // Event speakers junction table
    `CREATE TABLE IF NOT EXISTS event_speakers (
      id TEXT PRIMARY KEY,
      eventId TEXT NOT NULL,
      speakerId TEXT NOT NULL,
      role TEXT,
      order INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (speakerId) REFERENCES speakers(id) ON DELETE CASCADE
    )`,
    
    // Tags on events junction table
    `CREATE TABLE IF NOT EXISTS tags_on_events (
      id TEXT PRIMARY KEY,
      eventId TEXT NOT NULL,
      tagId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
    )`,
    
    // Error logs table
    `CREATE TABLE IF NOT EXISTS error_logs (
      id TEXT PRIMARY KEY,
      message TEXT NOT NULL,
      stack TEXT,
      path TEXT,
      method TEXT,
      userId TEXT,
      severity TEXT DEFAULT 'ERROR',
      metadata TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`
  ];
  
  // Execute all table creation statements
  try {
    sqlite.transaction(() => {
      tableCreationStatements.forEach(statement => {
        console.log(`Creating table: ${statement.split('\n')[0]}`);
        db.exec(statement);
      });
      
      console.log('All tables created successfully');
      return true;
    });
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

export default initDatabase; 