import { NextRequest, NextResponse } from "next/server";
import sqlite from "@/lib/sqlite";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt-server";
import type { Task } from "../route";

export async function POST(request: NextRequest) {
  try {
    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    // Check if user is authenticated
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Verify token
    let user: { id: string | number; email: string; role: string } | null = null;
    try {
      const decoded = await verifyToken(token);
      user = decoded as { id: string | number; email: string; role: string };
    } catch (error) {
      console.error("verifyToken error:", error);
      return NextResponse.json({ error: "Invalid token", details: String(error) }, { status: 401 });
    }

    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    // Required fields
    if (!body.taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    if (!body.fileUrl) {
      return NextResponse.json({ error: "File URL is required" }, { status: 400 });
    }

    const userId = user?.id ? String(user.id) : null;
    const now = new Date().toISOString();

    // Check if the user is related to the task (either A or B)
    const task = await sqlite.get<Task>(
      "SELECT * FROM tasks WHERE id = ?", 
      [body.taskId]
    );

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check if user is either delegator or assignee
    if (task.delegatedBy !== userId && task.assignedTo !== userId) {
      return NextResponse.json({ 
        error: "Only task delegator or assignee can share files for this task" 
      }, { status: 403 });
    }

    // Get existing files
    let files: string[] = [];
    if (task.sharedFiles) {
      try {
        files = JSON.parse(task.sharedFiles);
        if (!Array.isArray(files)) {
          files = [];
        }
      } catch (error) {
        console.error("Error parsing shared files:", error);
        files = [];
      }
    }

    // Add new file
    files.push(body.fileUrl);
    
    // Update the task
    await sqlite.run(
      `UPDATE tasks SET sharedFiles = ?, updatedAt = ? WHERE id = ?`,
      [JSON.stringify(files), now, body.taskId]
    );

    return NextResponse.json({
      message: "File shared successfully",
      files: files
    });

  } catch (error) {
    console.error("Error sharing file:", error);
    return NextResponse.json({
      error: "Failed to share file",
      details: String(error)
    }, { status: 500 });
  }
}
