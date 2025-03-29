import sqlite from './sqlite';

/**
 * Initialize the database with performance optimizations and indices
 */
export async function initDatabase(): Promise<void> {
  console.log('Initializing database with performance optimizations...');
  
  // Set up performance pragmas
  const pragmas = [
    // Use Write-Ahead Logging for better concurrency
    'PRAGMA journal_mode = WAL',
    
    // Reduce fsync calls for better write performance
    'PRAGMA synchronous = NORMAL',
    
    // Increase cache size for better read performance (10MB)
    'PRAGMA cache_size = 10000',
    
    // Store temp tables in memory for better performance
    'PRAGMA temp_store = MEMORY',
    
    // Enable foreign keys for data integrity
    'PRAGMA foreign_keys = ON',
    
    // Memory-mapped I/O for database file (up to 1GB)
    'PRAGMA mmap_size = 1073741824',
    
    // Set page size to 4KB (default for most file systems)
    'PRAGMA page_size = 4096',
  ];
  
  // Execute all pragmas
  const db = sqlite.getConnection();
  pragmas.forEach(pragma => {
    console.log(`Executing: ${pragma}`);
    db.pragma(pragma.replace('PRAGMA ', '').replace(' = ', '='));
  });
  
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

export default initDatabase; 