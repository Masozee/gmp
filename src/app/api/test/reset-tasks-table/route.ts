import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"

export async function GET(request: NextRequest) {
  try {
    // Drop the tasks table and recreate it with the correct schema
    await sqlite.transaction(async () => {
      // Check if tables exist before dropping
      const tasksTableExists = await sqlite.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'"
      );
      
      // Log current schema if table exists
      let currentSchema = null;
      if (tasksTableExists) {
        currentSchema = await sqlite.all("PRAGMA table_info(tasks)");
      }

      // Drop existing table (this will cascade delete related records)
      if (tasksTableExists) {
        await sqlite.run("DROP TABLE IF EXISTS tasks");
      }
      
      // Create tasks table with updated schema
      await sqlite.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT NOT NULL,
          priority TEXT NOT NULL,
          dueDate DATETIME,
          completedDate DATETIME,
          assignedTo TEXT,
          createdBy TEXT,
          agentId TEXT,
          tags TEXT,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          FOREIGN KEY (assignedTo) REFERENCES users(id),
          FOREIGN KEY (createdBy) REFERENCES users(id)
        )
      `);
      
      // Create indices
      await sqlite.run("CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)");
      await sqlite.run("CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)");
      await sqlite.run("CREATE INDEX IF NOT EXISTS idx_tasks_dueDate ON tasks(dueDate)");
      await sqlite.run("CREATE INDEX IF NOT EXISTS idx_tasks_assignedTo ON tasks(assignedTo)");
      await sqlite.run("CREATE INDEX IF NOT EXISTS idx_tasks_agentId ON tasks(agentId)");
      
      // Create sample data
      const now = new Date().toISOString();
      
      // Sample tasks
      const sampleTasks = [
        {
          id: sqlite.generateId(),
          title: "Research market trends",
          description: "Analyze current market trends for AI products and create a report",
          status: "IN_PROGRESS",
          priority: "HIGH",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          completedDate: null,
          assignedTo: null,
          createdBy: null,
          agentId: "agent-1",
          tags: "research,market,ai",
          createdAt: now,
          updatedAt: now
        },
        {
          id: sqlite.generateId(),
          title: "Update documentation",
          description: "Update the project documentation with latest features",
          status: "TODO",
          priority: "MEDIUM",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          completedDate: null,
          assignedTo: null,
          createdBy: null,
          agentId: "agent-2",
          tags: "documentation,update",
          createdAt: now,
          updatedAt: now
        },
        {
          id: sqlite.generateId(),
          title: "Fix login bug",
          description: "Address the login issue reported by users",
          status: "COMPLETED",
          priority: "CRITICAL",
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          completedDate: now,
          assignedTo: null,
          createdBy: null,
          agentId: "agent-1",
          tags: "bug,login,urgent",
          createdAt: now,
          updatedAt: now
        }
      ];
      
      for (const task of sampleTasks) {
        await sqlite.run(`
          INSERT INTO tasks (
            id, title, description, status, priority, dueDate, completedDate,
            assignedTo, createdBy, agentId, tags, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          task.id, task.title, task.description, task.status, task.priority,
          task.dueDate, task.completedDate, task.assignedTo, task.createdBy,
          task.agentId, task.tags, task.createdAt, task.updatedAt
        ]);
      }
    });
    
    // Get the tasks to confirm creation
    const tasks = await sqlite.all("SELECT * FROM tasks");
    const tableInfo = await sqlite.all("PRAGMA table_info(tasks)");
    
    return NextResponse.json({
      success: true,
      message: "Tasks table reinitialized successfully",
      schema: tableInfo,
      tasks: tasks
    });
  } catch (error) {
    console.error("Failed to reset tasks table:", error);
    return NextResponse.json({
      error: "Failed to reset tasks table",
      details: String(error)
    }, { status: 500 });
  }
} 