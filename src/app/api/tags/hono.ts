import { Hono } from 'hono'
import sqlite from '@/lib/sqlite'
import { getServerSession } from '@/lib/server-auth'

const tagsRoute = new Hono()

// GET /api/tags
tagsRoute.get(async (c) => {
  try {
    const tags = await sqlite.all('SELECT * FROM tags ORDER BY name ASC')
    return c.json({ tags })
  } catch (error) {
    return c.json({ error: 'Failed to fetch tags' }, 500)
  }
})

export { tagsRoute }
