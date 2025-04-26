import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Check if Supabase environment variables are set
console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set');
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
  `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...` : 
  'Not set'
);
console.log("SUPABASE_SERVICE_KEY:", 
  process.env.SUPABASE_SERVICE_KEY ? 
  `${process.env.SUPABASE_SERVICE_KEY.substring(0, 5)}...` : 
  'Not set'
); 