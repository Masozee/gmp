import { createBrowserSupabaseClient } from "../src/lib/supabaseClient";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testSupabaseConnection() {
  console.log("Testing Supabase connection...");
  
  // Log environment variables (partial values for security)
  console.log("Using Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Using Supabase Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
    `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...` : 'Not available');
  
  const supabase = createBrowserSupabaseClient();
  
  // Test connection by retrieving data
  console.log("Step 1: Testing connection by retrieving data...");
  const { data: initialData, error: initialError } = await supabase
    .from("tasks")
    .select("*")
    .limit(5);
  
  if (initialError) {
    console.error("Supabase connection error:", initialError);
    process.exit(1);
  } else {
    console.log("Supabase connection successful. Retrieved data:", initialData);
  }
  
  // Generate a unique test task
  const testId = `test-${Date.now()}`;
  const testTask = {
    id: testId,
    title: `Test Task ${testId}`,
    description: "This is a test task created to verify Supabase integration",
    status: "TODO",
    priority: "MEDIUM",
    due_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Insert test data
  console.log("\nStep 2: Inserting test data...");
  const { data: insertResult, error: insertError } = await supabase
    .from("tasks")
    .insert(testTask)
    .select();
  
  if (insertError) {
    console.error("Failed to insert test data:", insertError);
    process.exit(1);
  } else {
    console.log("Successfully inserted test data:", insertResult);
  }
  
  // Retrieve the inserted data
  console.log("\nStep 3: Retrieving the inserted data to verify...");
  const { data: verifyData, error: verifyError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", testId)
    .single();
  
  if (verifyError) {
    console.error("Failed to retrieve inserted data:", verifyError);
    process.exit(1);
  } else {
    console.log("Successfully retrieved inserted data:", verifyData);
    console.log("\nVerification results:");
    console.log("- Data insertion successful:", !!verifyData);
    console.log("- Data matches what was inserted:", verifyData.title === testTask.title);
  }
  
  // Clean up test data
  console.log("\nStep 4: Cleaning up test data...");
  const { error: deleteError } = await supabase
    .from("tasks")
    .delete()
    .eq("id", testId);
  
  if (deleteError) {
    console.error("Failed to clean up test data:", deleteError);
  } else {
    console.log("Successfully cleaned up test data");
  }
  
  console.log("\nTest complete! Supabase connection is working correctly.");
  process.exit(0);
}

testSupabaseConnection(); 