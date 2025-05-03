import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { supabase } from '@/app/lib/supabase';

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
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ data });
});

// Export the handle function
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app); 