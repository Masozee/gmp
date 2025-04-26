import { createBrowserSupabaseClient } from "../src/lib/supabaseClient";

async function testSupabaseConnection() {
  const supabase = createBrowserSupabaseClient();

  // Try to select from a public table (e.g., profiles or users). Adjust the table name as needed.
  const { data, error } = await supabase.from("users").select("*").limit(1);

  if (error) {
    console.error("Supabase connection error:", error);
    process.exit(1);
  } else {
    console.log("Supabase connection successful. Sample data:", data);
    process.exit(0);
  }
}

testSupabaseConnection();
