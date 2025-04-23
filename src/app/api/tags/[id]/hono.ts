import { Hono } from 'hono'
import sqlite from '@/lib/sqlite'

const tagIdRoute = new Hono()

// GET /api/tags/:id
tagIdRoute.get(async (c) => {
  try {
    const { id } = c.req.param()
    const tag = await sqlite.get('SELECT * FROM tags WHERE id = ?', [id])
    if (!tag) return c.json({ error: 'Tag not found' }, 404)
    return c.json(tag)
  } catch (error) {
    return c.json({ error: 'Failed to fetch tag' }, 500)
  }
})

export { tagIdRoute }
