import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { createServerClient } from '@supabase/ssr';

// Create a Hono instance
const app = new Hono().basePath('/api/admin/create');

// Create admin endpoint - protected by admin auth check
app.post('/', async (c) => {
  // Check auth - this should be more secure in production
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  // Create a Supabase client - for server-side API only
  // Don't need cookie handling since this is a direct API call
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // For server-side API calls, we don't need cookie handling
      cookies: {
        get: () => undefined,
        set: () => {},
        remove: () => {},
      },
    }
  );
  
  try {
    // Get request body
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }
    
    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
      },
    });
    
    if (error) {
      return c.json({ error: error.message }, 500);
    }
    
    return c.json({ data });
  } catch (err) {
    console.error('Error creating admin:', err);
    return c.json({ error: 'An error occurred' }, 500);
  }
});

export const POST = handle(app); 