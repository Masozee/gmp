import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"

// Define our task type
export interface Task {
  id: string
  title: string
  description: string | null
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED" | "CANCELLED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  dueDate: string | null
  completedDate: string | null
  assignedTo: string | null
  createdBy: string | null
  agentId: string | null
  tags: string | null
  createdAt: string
  updatedAt: string
}

export async function GET(request: NextRequest) {
  try {
    // Get URL parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const assignedTo = searchParams.get("assignedTo")
    const agentId = searchParams.get("agentId")
    const tag = searchParams.get("tag")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    
    // Build query
    let query = "SELECT * FROM tasks WHERE 1=1"
    const params: any[] = []
    
    // Add filters
    if (status) {
      query += " AND status = ?"
      params.push(status)
    }
    
    if (priority) {
      query += " AND priority = ?"
      params.push(priority)
    }
    
    if (assignedTo) {
      query += " AND assignedTo = ?"
      params.push(assignedTo)
    }
    
    if (agentId) {
      query += " AND agentId = ?"
      params.push(agentId)
    }
    
    if (tag) {
      query += " AND tags LIKE ?"
      params.push(`%${tag}%`)
    }
    
    // Add order and pagination
    query += " ORDER BY createdAt DESC"
    
    // Get total count for pagination
    const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as count")
    const countResult = await sqlite.get<{ count: number }>(countQuery, params)
    const total = countResult?.count || 0
    
    // Add pagination
    const { offset, limit: validLimit } = await sqlite.paginate(page, limit)
    query += " LIMIT ? OFFSET ?"
    params.push(validLimit, offset)
    
    // Execute query
    const tasks = await sqlite.all<Task>(query, params)
    
    return NextResponse.json({
      tasks,
      pagination: {
        total,
        page,
        limit: validLimit,
        pages: Math.ceil(total / validLimit)
      }
    })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({
      error: "Failed to fetch tasks",
      details: String(error)
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
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
    
    // Parse request body
    const body = await request.json()
    
    // Validation
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }
    
    if (!body.status) {
      body.status = "TODO" // Default status
    }
    
    if (!body.priority) {
      body.priority = "MEDIUM" // Default priority
    }
    
    // Create task object
    const now = new Date().toISOString()
    const task: Task = {
      id: sqlite.generateId(),
      title: body.title,
      description: body.description || null,
      status: body.status,
      priority: body.priority,
      dueDate: body.dueDate || null,
      completedDate: body.status === "COMPLETED" ? now : null,
      assignedTo: body.assignedTo || null,
      createdBy: user.id || null,
      agentId: body.agentId || null,
      tags: body.tags || null,
      createdAt: now,
      updatedAt: now
    }
    
    // Insert into database
    await sqlite.run(`
      INSERT INTO tasks (
        id, title, description, status, priority, dueDate, completedDate,
        assignedTo, createdBy, agentId, tags, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      task.id, task.title, task.description, task.status, task.priority,
      task.dueDate, task.completedDate, task.assignedTo, task.createdBy,
      task.agentId, task.tags, task.createdAt, task.updatedAt
    ])
    
    return NextResponse.json({
      message: "Task created successfully",
      task
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({
      error: "Failed to create task",
      details: String(error)
    }, { status: 500 })
  }
} 