import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config({ path: '.env.local' });

// Test authentication and data operations
async function testSupabase() {
  console.log("Testing Supabase Authentication and Data Operations");
  
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
  
  // Test user credentials - use a real email format
  const testEmail = 'tester123@example.com';
  const testPassword = 'Testing123!';
  
  try {
    // Step 1: Check if Supabase is accessible
    console.log("\nStep 1: Checking if Supabase API is accessible...");
    
    // Try to check if the tasks table exists
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('count(*)')
      .limit(1);
    
    if (tasksError) {
      console.error("Error accessing tasks table:", tasksError);
      console.log("\nYou need to run the SQL setup script in Supabase first.");
      console.log("The tables specified in scripts/setup-supabase.sql need to be created.");
    } else {
      console.log("Tasks table exists. Rows count:", tasksData);
    }
    
    // Step 2: Sign up a test user (will fail if user already exists)
    console.log(`\nStep 2: Signing up test user (${testEmail})...`);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (signUpError) {
      console.error("Error signing up:", signUpError);
      
      if (signUpError.message === 'Email rate limit exceeded') {
        console.log("This error can happen if there are too many sign-up attempts.");
        console.log("Try again with a different email address or wait a while.");
      } else if (signUpError.message === 'User already registered') {
        console.log("This user already exists. Proceeding to sign in...");
      }
    } else {
      console.log("Sign up successful!");
      if (signUpData.user) {
        console.log("User ID:", signUpData.user.id);
        console.log("Email confirmation status:", signUpData.user.email_confirmed_at ? "Confirmed" : "Not confirmed");
      }
      
      // Most Supabase projects require email verification by default
      console.log("\nNote: You may need to confirm your email address before you can sign in.");
      console.log("Check the Supabase Authentication settings to see if email confirmation is required.");
    }
    
    // Step 3: Try to sign in
    console.log(`\nStep 3: Attempting to sign in as ${testEmail}...`);
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    
    if (signInError) {
      console.error("Error signing in:", signInError);
      console.log("\nSince we couldn't sign in, we'll try to check the database structure");
      
      // Try to check if anonymous access is allowed for tasks
      const { data: anonTasksData, error: anonTasksError } = await supabase
        .from('tasks')
        .select('*')
        .limit(1);
      
      if (anonTasksError) {
        if (anonTasksError.code === '42501') {
          console.log("RLS policies are preventing anonymous access to tasks.");
          console.log("This is expected if RLS is configured correctly.");
        } else {
          console.error("Error accessing tasks:", anonTasksError);
        }
      } else {
        console.log("Anonymous access to tasks is allowed. Data:", anonTasksData);
      }
      
      process.exit(1);
    }
    
    console.log("Sign in successful!");
    console.log("User:", signInData.user?.email);
    console.log("Session expires at:", new Date(signInData.session?.expires_at! * 1000).toLocaleString());
    
    // Step 4: Create a test task
    console.log("\nStep 4: Creating a test task...");
    
    const testTask = {
      title: `Test Task ${Date.now()}`,
      description: "This is a test task created through the API",
      status: "TODO",
      priority: "MEDIUM",
      user_id: signInData.user?.id
    };
    
    const { data: insertedTask, error: insertError } = await supabase
      .from('tasks')
      .insert(testTask)
      .select()
      .single();
    
    if (insertError) {
      console.error("Error creating task:", insertError);
    } else {
      console.log("Task created successfully:", insertedTask);
      
      // Query all tasks for the current user
      console.log("\nQuerying all tasks for the current user...");
      const { data: userTasks, error: userTasksError } = await supabase
        .from('tasks')
        .select('*');
      
      if (userTasksError) {
        console.error("Error fetching user tasks:", userTasksError);
      } else {
        console.log(`Found ${userTasks.length} tasks for the current user:`, userTasks);
      }
      
      // Clean up - delete the task we just created
      console.log("\nCleaning up - deleting the test task...");
      
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', insertedTask.id);
      
      if (deleteError) {
        console.error("Error deleting task:", deleteError);
      } else {
        console.log("Task deleted successfully");
      }
    }
    
    // Sign out
    await supabase.auth.signOut();
    console.log("\nSigned out successfully");
    
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

testSupabase(); 