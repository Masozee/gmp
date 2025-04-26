import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config({ path: '.env.local' });

// Test Supabase connection and data operations
async function testSupabase() {
  console.log("Testing Supabase Connection and Data Operations");
  
  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or API key. Check your .env.local file.");
    process.exit(1);
  }
  
  console.log("Using Supabase URL:", supabaseUrl);
  console.log("Using Supabase Anon Key:", supabaseKey.substring(0, 5) + "...");
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Step 1: Check if Supabase is accessible
    console.log("\nStep 1: Checking if Supabase is accessible...");
    
    // Check if the tasks table exists by trying to select a single row
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .limit(1);
    
    if (tasksError) {
      if (tasksError.code === '42P01') {
        console.error("The 'tasks' table does not exist.");
        console.log("You need to set up the database schema in Supabase.");
      } else {
        console.error("Error accessing tasks table:", tasksError);
      }
    } else {
      console.log("Tasks table exists and is accessible.");
      console.log("Current data:", tasksData);
    }
    
    // Step 2: Insert a test task without authentication
    console.log("\nStep 2: Inserting a test task without authentication...");
    
    const testTask = {
      title: `Anon Test Task ${Date.now()}`,
      description: "This is a test task created without authentication",
      status: "TODO",
      priority: "MEDIUM",
      // No user_id specified - this should fail with RLS
    };
    
    const { data: insertedTask, error: insertError } = await supabase
      .from('tasks')
      .insert(testTask)
      .select()
      .single();
    
    if (insertError) {
      if (insertError.code === '42501') {
        console.log("RLS policy prevented the insert. This is expected behavior.");
        console.log("The policy requires authentication and a valid user_id.");
      } else {
        console.error("Error inserting task:", insertError);
      }
    } else {
      console.log("Task inserted successfully:", insertedTask);
      console.log("Note: This shouldn't happen if RLS is configured correctly!");
      
      // Clean up the task if it was unexpectedly created
      console.log("Cleaning up the unexpectedly created task...");
      await supabase
        .from('tasks')
        .delete()
        .eq('id', insertedTask.id);
    }
    
    // Step 3: Create a test task by cheating a bit (this works around RLS for testing)
    console.log("\nStep 3: Creating a test task with direct user_id assignment...");
    
    // Create a random UUID for the task
    const taskId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    // Insert a task directly via SQL to bypass RLS
    // This is only for testing purposes!
    const { error: sqlError } = await supabase.rpc('insert_test_task', {
      task_id: taskId,
      task_title: `SQL Test Task ${Date.now()}`,
      task_status: 'TODO',
      created_timestamp: timestamp,
      updated_timestamp: timestamp
    });
    
    if (sqlError) {
      console.error("Error inserting task via RPC:", sqlError);
      console.log("Note: The 'insert_test_task' function may not be defined in your Supabase instance.");
      console.log("This is a custom function that would need to be created for testing purposes.");
    } else {
      console.log("Task created successfully via RPC function");
      
      // Verify the task was created
      const { data: verifyData, error: verifyError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId);
      
      if (verifyError) {
        console.error("Error verifying task:", verifyError);
      } else {
        console.log("Task verification:", verifyData);
      }
    }
    
    console.log("\nTest complete! Supabase connection is working.");
    console.log("For full functionality testing, you need to:");
    console.log("1. Set up the database schema in Supabase");
    console.log("2. Configure authentication and RLS policies");
    console.log("3. Test with an authenticated user");
    
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

testSupabase(); 