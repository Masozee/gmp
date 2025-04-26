import { createBrowserSupabaseClient } from "../src/lib/supabaseClient";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function simpleSuabaseTest() {
  console.log("Testing Supabase with a simple task...");
  const supabase = createBrowserSupabaseClient();
  
  // Step 1: Get an existing task to inspect its structure
  console.log("Step 1: Querying an existing task to understand the structure...");
  const { data: existingTasks, error: queryError } = await supabase
    .from("tasks")
    .select("*")
    .limit(1);
  
  if (queryError) {
    console.error("Error querying tasks:", queryError);
  } else {
    console.log("Existing task data:", existingTasks);
    
    // Step 2: Create a minimal task based on the structure observed
    console.log("\nStep 2: Creating a minimal test task...");
    
    // Create a simple task with minimal fields
    const simpleTask = {
      title: `Simple Test Task ${Date.now()}`,
      status: "PENDING"
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from("tasks")
      .insert(simpleTask)
      .select();
    
    if (insertError) {
      console.error("Failed to insert simple task:", insertError);
    } else {
      console.log("Successfully inserted simple task:", insertResult);
      
      // Clean up if successful
      if (insertResult && insertResult.length > 0) {
        const insertedId = insertResult[0].id;
        console.log(`\nCleaning up task with ID: ${insertedId}`);
        const { error: deleteError } = await supabase
          .from("tasks")
          .delete()
          .eq("id", insertedId);
        
        if (deleteError) {
          console.error("Failed to clean up test task:", deleteError);
        } else {
          console.log("Successfully cleaned up test task");
        }
      }
    }
  }
}

simpleSuabaseTest(); 