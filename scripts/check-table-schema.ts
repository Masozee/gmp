import { createBrowserSupabaseClient } from "../src/lib/supabaseClient";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkTableSchema() {
  console.log("Checking Supabase table schema...");
  const supabase = createBrowserSupabaseClient();
  
  // Get list of tables
  console.log("Fetching list of tables...");
  const { data: tables, error: tableError } = await supabase
    .from('pg_tables')
    .select('schemaname, tablename')
    .eq('schemaname', 'public')
    .order('tablename');
  
  if (tableError) {
    console.error("Error fetching tables:", tableError);
  } else {
    console.log("Available tables:", tables);
  }
  
  // Check column information for tasks table
  console.log("\nFetching column information for tasks table...");
  const { data: columns, error: columnError } = await supabase
    .rpc('get_table_info', { table_name: 'tasks' });
  
  if (columnError) {
    console.error("Error fetching column information:", columnError);
    // Try alternative approach
    console.log("\nTrying alternative approach...");
    
    // Query information_schema for column details
    const { data: infoColumns, error: infoError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'tasks')
      .eq('table_schema', 'public');
    
    if (infoError) {
      console.error("Error fetching from information_schema:", infoError);
    } else {
      console.log("Tasks table columns:", infoColumns);
    }
  } else {
    console.log("Tasks table columns:", columns);
  }
}

checkTableSchema(); 