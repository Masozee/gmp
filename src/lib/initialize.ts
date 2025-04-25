
import './db-init'; // Import Vercel database initializer

// Only initialize on server-side
if (typeof window === 'undefined') {
  // Only setup database if not in Vercel environment
  // as Vercel uses the memory database initialized in db-init.ts
  if (process.env.VERCEL !== '1') {
    sqlite.setupDatabase();
  }
}

export default sqlite;
