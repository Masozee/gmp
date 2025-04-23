import { Hono } from 'hono'
import sqlite from '@/lib/sqlite'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt'

const tasksRoute = new Hono()

// GET /api/tasks
// List tasks with filters and pagination
// (Adapted from original Next.js handler)
tasksRoute.get(async (c) => {
  try {
    const searchParams = c.req.query()
    const status = searchParams['status']
    const priority = searchParams['priority']
    const assignedTo = searchParams['assignedTo']
    const agentId = searchParams['agentId']
    const tag = searchParams['tag']
    const page = parseInt(searchParams['page'] || '1')
    const limit = parseInt(searchParams['limit'] || '10')

    let query = 'SELECT * FROM tasks WHERE 1=1'
    const params: any[] = []
    if (status) { query += ' AND status = ?'; params.push(status) }
    if (priority) { query += ' AND priority = ?'; params.push(priority) }
    if (assignedTo) { query += ' AND assignedTo = ?'; params.push(assignedTo) }
    if (agentId) { query += ' AND agentId = ?'; params.push(agentId) }
    if (tag) { query += ' AND tags LIKE ?'; params.push(`%${tag}%`) }
    query += ' ORDER BY createdAt DESC'
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count')
    const countResult = await sqlite.get<{ count: number }>(countQuery, params)
    const total = countResult?.count || 0
    const { offset, limit: validLimit } = await sqlite.paginate(page, limit)
    query += ' LIMIT ? OFFSET ?'
    params.push(validLimit, offset)
    const tasks = await sqlite.all(query, params)
    return c.json({
      tasks,
      pagination: { total, page, limit: validLimit, pages: Math.ceil(total / validLimit) }
    })
  } catch (error) {
    return c.json({ error: 'Failed to fetch tasks', details: String(error) }, 500)
  }
})

// POST /api/tasks
// Create a new task
tasksRoute.post(async (c) => {
  try {
    // Hono does not have access to Next.js cookies, so handle auth via headers or a custom middleware
    const token = c.req.header('authorization')?.replace('Bearer ', '')
    if (!token) return c.json({ error: 'Unauthorized' }, 401)
    let user
    try { user = verifyToken(token) } catch { return c.json({ error: 'Invalid token' }, 401) }
    const body = await c.req.json()
    if (!body.title) return c.json({ error: 'Title is required' }, 400)
    if (!body.status) body.status = 'TODO'
    if (!body.priority) body.priority = 'MEDIUM'
    const now = new Date().toISOString()
    const task = {
      id: sqlite.generateId(),
      title: body.title,
      description: body.description || null,
      status: body.status,
      priority: body.priority,
      dueDate: body.dueDate || null,
      completedDate: body.status === 'COMPLETED' ? now : null,
      assignedTo: body.assignedTo || null,
      createdBy: user.id || null,
      agentId: body.agentId || null,
      tags: body.tags || null,
      createdAt: now,
      updatedAt: now
    }
    await sqlite.run(`INSERT INTO tasks (id, title, description, status, priority, dueDate, completedDate, assignedTo, createdBy, agentId, tags, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [task.id, task.title, task.description, task.status, task.priority, task.dueDate, task.completedDate, task.assignedTo, task.createdBy, task.agentId, task.tags, task.createdAt, task.updatedAt])
    return c.json({ message: 'Task created successfully', task }, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create task', details: String(error) }, 500)
  }
})

export { tasksRoute }
