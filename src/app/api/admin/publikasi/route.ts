import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { createClient } from '@supabase/supabase-js';

const app = new Hono().basePath('/api/admin/publikasi');

// Use direct Supabase client with service role key to bypass RLS
const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey);
};

// List publications
app.get('/', async (c) => {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('publicationdate', { ascending: false });

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ data });
});

// Create publication
app.post('/', async (c) => {
  const supabase = getSupabaseAdmin();

  const body = await c.req.json();
  // Validate required fields
  const requiredFields = ['title', 'slug', 'abstract', 'content', 'publicationdate', 'coverimage', 'published', 'categoryid'];
  for (const field of requiredFields) {
    if (!body[field]) {
      return c.json({ error: `Missing required field: ${field}` }, 400);
    }
  }

  const { data, error } = await supabase
    .from('publications')
    .insert([{ ...body }])
    .select();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ data });
});

// Add delete endpoint
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('publications')
    .delete()
    .eq('id', id);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ success: true });
});

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app); 