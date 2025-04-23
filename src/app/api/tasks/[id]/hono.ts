import { Hono } from 'hono'
import sqlite from '@/lib/sqlite'
import { verifyToken } from '@/lib/jwt'

const taskIdRoute = new Hono()

// GET /api/tasks/:id
taskIdRoute.get(async (c) => {
  try {
    const { id } = c.req.param()
    const task = await sqlite.get('SELECT * FROM tasks WHERE id = ?', [id])
    if (!task) return c.json({ error: 'Task not found' }, 404)
    return c.json({ task })
  } catch (error) {
    return c.json({ error: 'Failed to fetch task', details: String(error) }, 500)
  }
})

// PUT /api/tasks/:id
taskIdRoute.put(async (c) => {
  try {
    const { id } = c.req.param()
    const token = c.req.header('authorization')?.replace('Bearer ', '')
    if (!token) return c.json({ error: 'Unauthorized' }, 401)
    let user
    try { user = verifyToken(token) } catch { return c.json({ error: 'Invalid token' }, 401) }
    const existingTask = await sqlite.get('SELECT * FROM tasks WHERE id = ?', [id])
    if (!existingTask) return c.json({ error: 'Task not found' }, 404)
    const body = await c.req.json()
    const now = new Date().toISOString()
    const updatedTask = {
      title: body.title || existingTask.title,
      description: body.description !== undefined ? body.description : existingTask.description,
      status: body.status || existingTask.status,
      priority: body.priority || existingTask.priority,
      dueDate: body.dueDate !== undefined ? body.dueDate : existingTask.dueDate,
      assignedTo: body.assignedTo !== undefined ? body.assignedTo : existingTask.assignedTo,
      agentId: body.agentId !== undefined ? body.agentId : existingTask.agentId,
      tags: body.tags !== undefined ? body.tags : existingTask.tags,
      updatedAt: now,
      completedDate: (body.status === 'COMPLETED' && existingTask.status !== 'COMPLETED') ? now : (body.status !== 'COMPLETED' && existingTask.status === 'COMPLETED' ? null : existingTask.completedDate)
    }
    const updateFields = Object.keys(updatedTask).filter(k => k !== 'id').map(k => `${k} = ?`).join(', ')
    const updateValues = Object.keys(updatedTask).filter(k => k !== 'id').map(k => (updatedTask as any)[k])
    await sqlite.run(`UPDATE tasks SET ${updateFields} WHERE id = ?`, [...updateValues, id])
    const task = await sqlite.get('SELECT * FROM tasks WHERE id = ?', [id])
    return c.json({ message: 'Task updated successfully', task })
  } catch (error) {
    return c.json({ error: 'Failed to update task', details: String(error) }, 500)
  }
})

// DELETE /api/tasks/:id
taskIdRoute.delete(async (c) => {
  try {
    const { id } = c.req.param()
    const token = c.req.header('authorization')?.replace('Bearer ', '')
    if (!token) return c.json({ error: 'Unauthorized' }, 401)
    let user
    try { user = verifyToken(token) } catch { return c.json({ error: 'Invalid token' }, 401) }
    const task = await sqlite.get('SELECT * FROM tasks WHERE id = ?', [id])
    if (!task) return c.json({ error: 'Task not found' }, 404)
    await sqlite.run('DELETE FROM tasks WHERE id = ?', [id])
    return c.json({ message: 'Task deleted successfully' })
  } catch (error) {
    return c.json({ error: 'Failed to delete task', details: String(error) }, 500)
  }
})

export { taskIdRoute }
