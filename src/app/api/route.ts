import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { initializeDatabase, db } from '@/lib/db';
import { users } from '@/lib/db/schema';

// Initialize database on startup
initializeDatabase();

// Create a Hono instance
const app = new Hono().basePath('/api');

// Health check endpoint
app.get('/', (c) => {
  return c.json({
    status: 'ok',
    message: 'API is running',
  });
});

// User API endpoints
app.get('/users', async (c) => {
  try {
    const allUsers = await db.select().from(users);
    return c.json({ data: allUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Export the handle function
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app); 