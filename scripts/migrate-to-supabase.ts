import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or API key. Check your .env.local file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// SQLite database path
const dbPath = path.join(__dirname, '../src/db/app.db');

async function migrate() {
  console.log("Starting migration from SQLite to Supabase...");
  
  try {
    // Check if SQLite database exists
    if (!fs.existsSync(dbPath)) {
      console.error(`SQLite database not found at ${dbPath}`);
      process.exit(1);
    }
    
    // Open SQLite database
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    console.log("Connected to SQLite database");
    
    // Create test user in Supabase if it doesn't exist
    const testEmail = 'test@example.com';
    const testPassword = 'Test1234!';
    
    console.log(`Creating test user (${testEmail}) in Supabase if it doesn't exist...`);
    const { data: existingUser, error: lookupError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    
    let userId;
    
    if (lookupError && lookupError.message === 'Invalid login credentials') {
      // User doesn't exist, create it
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });
      
      if (signUpError) {
        console.error("Error creating test user:", signUpError);
        process.exit(1);
      }
      
      userId = signUpData.user?.id;
      console.log(`Created new test user with ID: ${userId}`);
    } else {
      userId = existingUser?.user?.id;
      console.log(`Using existing test user with ID: ${userId}`);
    }
    
    // Sign in with the test user to get a session
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    
    if (signInError) {
      console.error("Error signing in:", signInError);
      process.exit(1);
    }
    
    // Get tasks from SQLite
    console.log("\nMigrating tasks...");
    const tasks = await db.all("SELECT * FROM tasks");
    console.log(`Found ${tasks.length} tasks in SQLite`);
    
    // Map of SQLite IDs to Supabase UUIDs
    const taskIdMap = new Map();
    
    // Insert tasks into Supabase
    for (const task of tasks) {
      const newId = uuidv4();
      taskIdMap.set(task.id, newId);
      
      const { error } = await supabase
        .from('tasks')
        .insert({
          id: newId,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          due_date: task.due_date,
          created_at: new Date(task.createdAt || Date.now()).toISOString(),
          updated_at: new Date(task.updatedAt || Date.now()).toISOString(),
          user_id: userId
        });
      
      if (error) {
        console.error(`Error inserting task ${task.id}:`, error);
      }
    }
    
    console.log(`Migrated ${tasks.length} tasks to Supabase`);
    
    // Get subtasks from SQLite if the table exists
    try {
      console.log("\nMigrating subtasks...");
      const subtasks = await db.all("SELECT * FROM subtasks");
      console.log(`Found ${subtasks.length} subtasks in SQLite`);
      
      // Insert subtasks into Supabase
      for (const subtask of subtasks) {
        const supabaseTaskId = taskIdMap.get(subtask.task_id);
        
        if (!supabaseTaskId) {
          console.warn(`Skipping subtask ${subtask.id} - parent task not found`);
          continue;
        }
        
        const { error } = await supabase
          .from('subtasks')
          .insert({
            id: uuidv4(),
            title: subtask.title,
            completed: Boolean(subtask.completed),
            task_id: supabaseTaskId,
            created_at: new Date(subtask.createdAt || Date.now()).toISOString(),
            updated_at: new Date(subtask.updatedAt || Date.now()).toISOString()
          });
        
        if (error) {
          console.error(`Error inserting subtask ${subtask.id}:`, error);
        }
      }
      
      console.log(`Migrated ${subtasks.length} subtasks to Supabase`);
    } catch (error) {
      console.log("Subtasks table may not exist in SQLite, skipping");
    }
    
    // Get notes from SQLite if the table exists
    try {
      console.log("\nMigrating notes...");
      const notes = await db.all("SELECT * FROM notes");
      console.log(`Found ${notes.length} notes in SQLite`);
      
      // Insert notes into Supabase
      for (const note of notes) {
        const supabaseTaskId = taskIdMap.get(note.task_id);
        
        if (!supabaseTaskId) {
          console.warn(`Skipping note ${note.id} - parent task not found`);
          continue;
        }
        
        const { error } = await supabase
          .from('notes')
          .insert({
            id: uuidv4(),
            content: note.content,
            task_id: supabaseTaskId,
            created_at: new Date(note.createdAt || Date.now()).toISOString(),
            updated_at: new Date(note.updatedAt || Date.now()).toISOString()
          });
        
        if (error) {
          console.error(`Error inserting note ${note.id}:`, error);
        }
      }
      
      console.log(`Migrated ${notes.length} notes to Supabase`);
    } catch (error) {
      console.log("Notes table may not exist in SQLite, skipping");
    }
    
    console.log("\nMigration completed!");
    console.log("You can now run scripts/supabase-client-test.ts to verify the data");
    
  } catch (error) {
    console.error("Unexpected error during migration:", error);
  }
}

migrate(); 