import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function serverTest() {
  console.log("Testing Supabase with server client...");
  
  // Get the Supabase URL and Service Key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Using anon key for this test
  
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Key. Please check your .env.local file.");
    return;
  }
  
  // Create a Supabase client with the service key
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Check each table from the export script
    const tables = ['tasks', 'subtasks', 'notes', 'users', 'profiles'];
    
    for (const table of tables) {
      console.log(`\n--- Testing ${table} table ---`);
      
      // Try to select data
      console.log(`Step 1: Querying ${table} table...`);
      const { data, error: queryError } = await supabase
        .from(table)
        .select('*')
        .limit(5);
      
      if (queryError) {
        console.error(`Error querying ${table}:`, queryError);
      } else {
        console.log(`${table} data:`, data);
        
        // If we can read from the table, try to insert
        console.log(`\nStep 2: Attempting to insert into ${table}...`);
        
        // Create a test record based on the table
        let testRecord;
        switch (table) {
          case 'tasks':
            testRecord = {
              title: `Test Task ${Date.now()}`,
              status: 'TODO'
            };
            break;
          case 'subtasks':
            if (data.length > 0) {
              testRecord = {
                title: `Test Subtask ${Date.now()}`,
                completed: false,
                task_id: data[0].task_id || data[0].id // Get a valid task ID from existing records
              };
            } else {
              console.log(`Skipping insert - no ${table} records found to reference`);
              continue;
            }
            break;
          case 'notes':
            if (data.length > 0) {
              testRecord = {
                content: `Test Note ${Date.now()}`,
                task_id: data[0].task_id || data[0].id // Get a valid task ID from existing records
              };
            } else {
              console.log(`Skipping insert - no ${table} records found to reference`);
              continue;
            }
            break;
          case 'users':
            testRecord = {
              email: `test-${Date.now()}@example.com`,
              name: `Test User ${Date.now()}`
            };
            break;
          case 'profiles':
            if (data.length > 0) {
              testRecord = {
                user_id: data[0].user_id || data[0].id,
                username: `testuser-${Date.now()}`
              };
            } else {
              console.log(`Skipping insert - no ${table} records found to reference`);
              continue;
            }
            break;
          default:
            console.log(`Skipping insert for ${table} - no schema defined`);
            continue;
        }
        
        const { data: insertResult, error: insertError } = await supabase
          .from(table)
          .insert(testRecord)
          .select();
        
        if (insertError) {
          console.error(`Error inserting into ${table}:`, insertError);
        } else {
          console.log(`Successfully inserted into ${table}:`, insertResult);
          
          // Clean up - delete the record we just inserted
          if (insertResult && insertResult.length > 0) {
            const insertedId = insertResult[0].id;
            const { error: deleteError } = await supabase
              .from(table)
              .delete()
              .eq('id', insertedId);
            
            if (deleteError) {
              console.error(`Error deleting from ${table}:`, deleteError);
            } else {
              console.log(`Successfully deleted test record from ${table}`);
            }
          }
        }
      }
    }
    
    console.log("\nTest complete! Checked all tables.");
    
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

serverTest(); 