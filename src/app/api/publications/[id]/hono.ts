import { Hono } from 'hono'
import sqlite from '@/lib/sqlite'
import { getServerSession } from '@/lib/server-auth'

const publicationIdRoute = new Hono()

// GET /api/publications/:id
publicationIdRoute.get(async (c) => {
  try {
    const { id } = c.req.param()
    const publication = await sqlite.get(`SELECT p.*, c.name as categoryName FROM publications p LEFT JOIN event_categories c ON p.categoryId = c.id WHERE p.id = ?`, [id])
    if (!publication) return c.json({ error: 'Publication not found' }, 404)
    return c.json(publication)
  } catch (error) {
    return c.json({ error: 'Failed to fetch publication' }, 500)
  }
})

export { publicationIdRoute }
