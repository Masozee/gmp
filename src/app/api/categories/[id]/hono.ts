import { Hono } from 'hono'
import sqlite from '@/lib/sqlite'

const categoryIdRoute = new Hono()

// GET /api/categories/:id
categoryIdRoute.get(async (c) => {
  try {
    const { id } = c.req.param()
    const category = await sqlite.get('SELECT * FROM event_categories WHERE id = ?', [id])
    if (!category) return c.json({ error: 'Category not found' }, 404)
    return c.json(category)
  } catch (error) {
    return c.json({ error: 'Failed to fetch category' }, 500)
  }
})

export { categoryIdRoute }
