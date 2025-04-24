import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/edge-jwt"

// Define our task type
export interface Task {
  id: string
  title: string
  description: string | null
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED" | "CANCELLED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  dueDate: string | null
  completedDate: string | null
  // Person who performs the task (B)
  assignedTo: string | null
  // Person who delegates/creates the task (A)
  delegatedBy: string
  // Review status fields
  reviewStatus: "PENDING" | "NEEDS_UPDATE" | "ACCEPTED"
  reviewComment: string | null
  reviewDate: string | null
  // Legacy field for compatibility
  createdBy: string | null
  agentId: string | null
  tags: string | null
  // Shared files for collaboration (JSON string array)
  sharedFiles: string | null
  // Soft delete flag (0 = active, 1 = deleted)
  deleted: number
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
    let query = "SELECT * FROM tasks WHERE deleted = 0"
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
    const cookieStore = await cookies();
    console.log("Cookies in POST /api/tasks:", cookieStore.getAll());
    const token = cookieStore.get("token")?.value
    
    // Check if user is authenticated
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Verify token
    let user: { id: string | number; email: string; role: string } | null = null;
    try {
      user = await verifyToken(token);
      console.log("User from token:", user);
    } catch (error) {
      console.error("verifyToken error:", error);
      return NextResponse.json({ error: "Invalid token", details: String(error) }, { status: 401 })
    }

    // Parse request body
    let body: any
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    // Validation: Required fields
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: "Title is required and must be a string" }, { status: 400 })
    }

    // Optional fields with defaults
    if (!body.status || typeof body.status !== 'string') {
      body.status = "TODO"
    }
    if (!body.priority || typeof body.priority !== 'string') {
      body.priority = "MEDIUM"
    }

    // Convert user ID to string (ensuring it matches the TEXT column in SQLite)
    const userId = user?.id ? String(user.id) : null;
    console.log("User ID for createdBy:", userId, "Type:", typeof userId);

    // Validate and sanitize all fields
    const now = new Date().toISOString()
    const task: Task = {
      id: sqlite.generateId(),
      title: body.title,
      description: typeof body.description === 'string' ? body.description : null,
      status: body.status,
      priority: body.priority,
      dueDate: typeof body.dueDate === 'string' ? body.dueDate : null,
      completedDate: body.status === "COMPLETED" ? now : null,
      // Person being assigned to the task (B)
      assignedTo: typeof body.assignedTo === 'string' ? body.assignedTo : null,
      // Person delegating the task (A) - must be the current user
      delegatedBy: userId || '',
      // Initial review status is always PENDING
      reviewStatus: "PENDING",
      reviewComment: null,
      reviewDate: null,
      // Keep createdBy for backwards compatibility
      createdBy: userId,
      agentId: typeof body.agentId === 'string' ? body.agentId : null,
      tags: typeof body.tags === 'string' ? body.tags : null,
      // Shared files (JSON string array)
      sharedFiles: typeof body.sharedFiles === 'string' ? body.sharedFiles : null,
      // Default to not deleted (0)
      deleted: 0,
      createdAt: now,
      updatedAt: now
    }

    // Debug log for task object
    console.log('Task to insert:', task)

    // Insert into database
    await sqlite.run(`
      INSERT INTO tasks (
        id, title, description, status, priority, dueDate, completedDate,
        assignedTo, delegatedBy, reviewStatus, reviewComment, reviewDate,
        createdBy, agentId, tags, sharedFiles, deleted, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      task.id, task.title, task.description, task.status, task.priority,
      task.dueDate, task.completedDate, task.assignedTo, task.delegatedBy,
      task.reviewStatus, task.reviewComment, task.reviewDate, task.createdBy,
      task.agentId, task.tags, task.sharedFiles, task.deleted, task.createdAt, task.updatedAt
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