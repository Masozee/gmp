import { createBrowserSupabaseClient } from "../src/lib/supabaseClient";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// You can replace these with your test user credentials
// For safe testing, you should use a test user account, not a production account
const TEST_EMAIL = "test@example.com";
const TEST_PASSWORD = "testpassword";

async function authTest() {
  console.log("Testing Supabase authentication and data insertion...");
  const supabase = createBrowserSupabaseClient();
  
  try {
    // Step 1: Try to sign in with provided credentials
    console.log(`Step 1: Attempting to sign in as ${TEST_EMAIL}...`);
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    
    if (authError) {
      console.error("Authentication error:", authError);
      console.log("\nSince authentication failed, let's try to create the test user...");
      
      // Try to sign up the test user if sign in failed
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });
      
      if (signUpError) {
        console.error("Sign up error:", signUpError);
        console.log("Both sign in and sign up failed. Please check your Supabase authentication setup.");
        return;
      } else {
        console.log("Sign up successful:", signUpData);
      }
    } else {
      console.log("Authentication successful:", authData);
    }
    
    // Step 2: Get the current user to verify authentication
    const { data: { user } } = await supabase.auth.getUser();
    console.log("\nCurrent user:", user);
    
    // Step 3: Try to insert a task with the authenticated user
    console.log("\nStep 3: Inserting a task as authenticated user...");
    const simpleTask = {
      title: `Auth Test Task ${Date.now()}`,
      status: "PENDING"
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from("tasks")
      .insert(simpleTask)
      .select();
    
    if (insertError) {
      console.error("Failed to insert task as authenticated user:", insertError);
    } else {
      console.log("Successfully inserted task:", insertResult);
      
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
    
    // Step 4: Sign out
    await supabase.auth.signOut();
    console.log("\nSigned out successfully");
    
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

authTest(); 