// This file re-exports Supabase client creators for server and client environments.
// Usage:
//   import { createServerSupabaseClient, createBrowserSupabaseClient } from "@/lib/supabaseClient";
//
//   // In a server component or API route:
//   const supabase = createServerSupabaseClient(cookies());
//
//   // In a client component:
//   const supabase = createBrowserSupabaseClient();

export { createClient as createServerSupabaseClient } from "../../utils/supabase/server";
export { createClient as createBrowserSupabaseClient } from "../../utils/supabase/client";
