/**
 * This script verifies that the migration from SQLite to Supabase was successful
 * by comparing record counts between the two databases.
 * Run with: node verify-migration.js
 */
require('dotenv').config();

// Get Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in environment variables.');
  console.error('Please add SUPABASE_URL and SUPABASE_SERVICE_KEY to your .env file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Connect to SQLite database
const dbPath = path.join(__dirname, '../src/db/app.db');

// Table names to verify
const tables = ['tasks', 'subtasks', 'notes'];

// Check if SQLite database exists
if (!fs.existsSync(dbPath)) {
  console.error(`❌ SQLite database not found at ${dbPath}`);
  console.error('Skipping SQLite verification');
  verifyCounts(null);
} else {
  console.log('✅ SQLite database found');
  
  // Connect to SQLite database
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('❌ Error connecting to SQLite database:', err.message);
      verifyCounts(null);
      return;
    }
    console.log('✅ Connected to SQLite database');
    verifyCounts(db);
  });
} 