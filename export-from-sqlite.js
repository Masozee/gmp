const { v4: uuidv4 } = require('uuid');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Connect to SQLite database
const dbPath = path.join(__dirname, '../src/db/app.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Error connecting to SQLite database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// Export tasks
async function exportTasks() {
  return new Promise((resolve, reject) => {
    const tasks = [];
    
    db.all('SELECT * FROM tasks', [], (err, rows) => {
      if (err) {
        console.error('❌ Error fetching tasks:', err.message);
        return reject(err);
      }
      
      rows.forEach(row => {
        // Transform SQLite row to Supabase format
        const task = {
          id: uuidv4(), // Generate new UUID for Supabase
          title: row.title,
          description: row.description || null,
          status: row.status,
          priority: row.priority || null,
          due_date: row.due_date ? new Date(row.due_date).toISOString() : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          original_id: row.id // Store original ID for reference
        };
        
        tasks.push(task);
      });
      
      // Save to JSON file
      fs.writeFileSync(
        path.join(dataDir, 'tasks.json'), 
        JSON.stringify(tasks, null, 2)
      );
      
      console.log(`✅ Exported ${tasks.length} tasks to tasks.json`);
      resolve(tasks);
    });
  });
}

// Export subtasks
async function exportSubtasks(tasks) {
  return new Promise((resolve, reject) => {
    const subtasks = [];
    const taskIdMap = {};
    
    // Create mapping of original task IDs to new UUIDs
    tasks.forEach(task => {
      taskIdMap[task.original_id] = task.id;
    });
    
    db.all('SELECT * FROM subtasks', [], (err, rows) => {
      if (err) {
        console.error('❌ Error fetching subtasks:', err.message);
        return reject(err);
      }
      
      rows.forEach(row => {
        // Map the original task_id to the new UUID
        const newTaskId = taskIdMap[row.task_id];
        
        if (!newTaskId) {
          console.warn(`⚠️ No matching task found for subtask ${row.id} with task_id ${row.task_id}`);
          return;
        }
        
        // Transform SQLite row to Supabase format
        const subtask = {
          id: uuidv4(), // Generate new UUID for Supabase
          title: row.title,
          completed: row.completed === 1, // SQLite stores booleans as 0/1
          task_id: newTaskId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          original_id: row.id // Store original ID for reference
        };
        
        subtasks.push(subtask);
      });
      
      // Save to JSON file
      fs.writeFileSync(
        path.join(dataDir, 'subtasks.json'), 
        JSON.stringify(subtasks, null, 2)
      );
      
      console.log(`✅ Exported ${subtasks.length} subtasks to subtasks.json`);
      resolve(subtasks);
    });
  });
}

// Export notes
async function exportNotes(tasks) {
  return new Promise((resolve, reject) => {
    const notes = [];
    const taskIdMap = {};
    
    // Create mapping of original task IDs to new UUIDs
    tasks.forEach(task => {
      taskIdMap[task.original_id] = task.id;
    });
    
    db.all('SELECT * FROM notes', [], (err, rows) => {
      if (err) {
        console.error('❌ Error fetching notes:', err.message);
        return reject(err);
      }
      
      rows.forEach(row => {
        // Map the original task_id to the new UUID
        const newTaskId = taskIdMap[row.task_id];
        
        if (!newTaskId) {
          console.warn(`⚠️ No matching task found for note ${row.id} with task_id ${row.task_id}`);
          return;
        }
        
        // Transform SQLite row to Supabase format
        const note = {
          id: uuidv4(), // Generate new UUID for Supabase
          content: row.content,
          task_id: newTaskId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          original_id: row.id // Store original ID for reference
        };
        
        notes.push(note);
      });
      
      // Save to JSON file
      fs.writeFileSync(
        path.join(dataDir, 'notes.json'), 
        JSON.stringify(notes, null, 2)
      );
      
      console.log(`✅ Exported ${notes.length} notes to notes.json`);
      resolve(notes);
    });
  });
}

// Main export function
async function main() {
  console.log('🚀 Starting SQLite data export...');
  
  try {
    // Export data in the correct order to maintain relationships
    const tasks = await exportTasks();
    await exportSubtasks(tasks);
    await exportNotes(tasks);
    
    console.log('\n🎉 Export completed! Data files saved to:');
    console.log(`  - ${path.join(dataDir, 'tasks.json')}`);
    console.log(`  - ${path.join(dataDir, 'subtasks.json')}`);
    console.log(`  - ${path.join(dataDir, 'notes.json')}`);
    console.log('\nNow you can run the import scripts to populate Supabase:');
    console.log('1. First run: node create-tables.js');
    console.log('2. Then run: node import-tasks.js');
    console.log('3. Then run: node import-subtasks.js');
    console.log('4. Finally run: node import-notes.js');
  } catch (error) {
    console.error('❌ Export failed:', error.message);
  } finally {
    // Close database connection
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
      } else {
        console.log('✅ Database connection closed');
      }
    });
  }
}

// Run the export
main(); 