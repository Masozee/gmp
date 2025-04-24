import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt-server"
import type { Task } from "../route"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id
    
    // Get task from database (only non-deleted tasks)
    const task = await sqlite.get<Task>(
      "SELECT * FROM tasks WHERE id = ? AND deleted = 0",
      [taskId]
    )
    
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }
    
    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({
      error: "Failed to fetch task",
      details: String(error)
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id
    
    // Get the token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    
    // Check if user is authenticated
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Verify token
    let user: { id: string | number; email: string; role: string } | null = null;
    try {
      const decoded = await verifyToken(token)
      user = decoded as { id: string | number; email: string; role: string };
    } catch (error) {
      console.error("verifyToken error:", error);
      return NextResponse.json({ error: "Invalid token", details: String(error) }, { status: 401 })
    }

    const userId = user?.id ? String(user.id) : null;
    
    // Get the existing task
    const existingTask = await sqlite.get<Task>(
      "SELECT * FROM tasks WHERE id = ?",
      [taskId]
    )
    
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }
    
    // IMPORTANT: Only the delegator (A) can edit the task
    if (existingTask.delegatedBy !== userId) {
      return NextResponse.json({ 
        error: "Only the task delegator can edit this task" 
      }, { status: 403 })
    }
    
    // Parse request body
    let body: any;
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }
    
    // Create updated task object
    const now = new Date().toISOString()
    const updatedTask: Partial<Task> = {
      title: body.title || existingTask.title,
      description: body.description !== undefined ? body.description : existingTask.description,
      status: body.status || existingTask.status,
      priority: body.priority || existingTask.priority,
      dueDate: body.dueDate !== undefined ? body.dueDate : existingTask.dueDate,
      assignedTo: body.assignedTo !== undefined ? body.assignedTo : existingTask.assignedTo,
      tags: body.tags !== undefined ? body.tags : existingTask.tags,
      // Preserve review fields
      reviewStatus: body.reviewStatus || existingTask.reviewStatus,
      reviewComment: body.reviewComment !== undefined ? body.reviewComment : existingTask.reviewComment,
      agentId: body.agentId !== undefined ? body.agentId : existingTask.agentId,
      // Update time
      updatedAt: now
    }
    
    // Special handling for task completion
    if (body.status === "COMPLETED" && existingTask.status !== "COMPLETED") {
      updatedTask.completedDate = now
    } else if (body.status !== "COMPLETED" && existingTask.status === "COMPLETED") {
      updatedTask.completedDate = null
    }

    // Handle review date when review status changes
    if (body.reviewStatus && body.reviewStatus !== existingTask.reviewStatus) {
      updatedTask.reviewDate = now
    }
    
    // Handle shared files if provided
    if (body.sharedFiles) {
      try {
        const filesArray = Array.isArray(body.sharedFiles) ? body.sharedFiles : JSON.parse(body.sharedFiles)
        updatedTask.sharedFiles = JSON.stringify(filesArray)
      } catch (error) {
        console.error("Error parsing shared files:", error)
      }
    }
    
    // Build update query
    const updateFields = Object.keys(updatedTask)
      .filter(key => key !== 'id')
      .map(key => `${key} = ?`)
      .join(", ")
    
    const updateValues = Object.keys(updatedTask)
      .filter(key => key !== 'id')
      .map(key => (updatedTask as any)[key])
    
    // Update the task
    await sqlite.run(
      `UPDATE tasks SET ${updateFields} WHERE id = ?`,
      [...updateValues, taskId]
    )
    
    // Get the updated task
    const task = await sqlite.get<Task>(
      "SELECT * FROM tasks WHERE id = ?",
      [taskId]
    )
    
    return NextResponse.json({
      message: "Task updated successfully",
      task
    })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({
      error: "Failed to update task",
      details: String(error)
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id
    
    // Get the token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    
    // Check if user is authenticated
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Verify token
    let user: { id: string | number; email: string; role: string } | null = null;
    try {
      const decoded = await verifyToken(token)
      user = decoded as { id: string | number; email: string; role: string };
    } catch (error) {
      console.error("verifyToken error:", error);
      return NextResponse.json({ error: "Invalid token", details: String(error) }, { status: 401 })
    }

    const userId = user?.id ? String(user.id) : null;
    
    // Check if the task exists
    const task = await sqlite.get<Task>(
      "SELECT * FROM tasks WHERE id = ?",
      [taskId]
    )
    
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }
    
    // IMPORTANT: Only the delegator (A) can delete the task
    if (task.delegatedBy !== userId) {
      return NextResponse.json({ 
        error: "Only the task delegator can delete this task" 
      }, { status: 403 })
    }
    
    // Soft delete the task by setting the deleted flag
    const now = new Date().toISOString();
    await sqlite.run(
      "UPDATE tasks SET deleted = 1, updatedAt = ? WHERE id = ?", 
      [now, taskId]
    )
    
    return NextResponse.json({
      message: "Task deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({
      error: "Failed to delete task",
      details: String(error)
    }, { status: 500 })
  }
} 