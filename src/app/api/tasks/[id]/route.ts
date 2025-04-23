import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import { Task } from "../route"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id
    
    // Get the task by ID
    const task = await sqlite.get<Task>(
      "SELECT * FROM tasks WHERE id = ?",
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
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value
    
    // Check if user is authenticated
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Verify token
    let user
    try {
      user = verifyToken(token)
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    
    // Get the existing task
    const existingTask = await sqlite.get<Task>(
      "SELECT * FROM tasks WHERE id = ?",
      [taskId]
    )
    
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }
    
    // Parse request body
    const body = await request.json()
    
    // Create updated task object
    const now = new Date().toISOString()
    const updatedTask: Partial<Task> = {
      title: body.title || existingTask.title,
      description: body.description !== undefined ? body.description : existingTask.description,
      status: body.status || existingTask.status,
      priority: body.priority || existingTask.priority,
      dueDate: body.dueDate !== undefined ? body.dueDate : existingTask.dueDate,
      assignedTo: body.assignedTo !== undefined ? body.assignedTo : existingTask.assignedTo,
      agentId: body.agentId !== undefined ? body.agentId : existingTask.agentId,
      tags: body.tags !== undefined ? body.tags : existingTask.tags,
      updatedAt: now
    }
    
    // Special handling for task completion
    if (body.status === "COMPLETED" && existingTask.status !== "COMPLETED") {
      updatedTask.completedDate = now
    } else if (body.status !== "COMPLETED" && existingTask.status === "COMPLETED") {
      updatedTask.completedDate = null
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
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value
    
    // Check if user is authenticated
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Verify token
    let user
    try {
      user = verifyToken(token)
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    
    // Check if the task exists
    const task = await sqlite.get<Task>(
      "SELECT * FROM tasks WHERE id = ?",
      [taskId]
    )
    
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }
    
    // Delete the task
    await sqlite.run("DELETE FROM tasks WHERE id = ?", [taskId])
    
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