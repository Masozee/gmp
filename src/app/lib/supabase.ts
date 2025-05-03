import { createClient } from '@supabase/supabase-js';

// Environment variables are automatically prefixed with NEXT_PUBLIC_ to make them available in the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseKey); 