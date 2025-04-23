import { Hono } from 'hono'
import sqlite from '@/lib/sqlite'

const categoriesRoute = new Hono()

// GET /api/categories
categoriesRoute.get(async (c) => {
  try {
    const categories = await sqlite.all('SELECT * FROM event_categories ORDER BY name ASC')
    return c.json({ categories })
  } catch (error) {
    return c.json({ error: 'Failed to fetch categories' }, 500)
  }
})

export { categoriesRoute }
