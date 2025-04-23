import { Hono } from 'hono'
import sqlite from '@/lib/sqlite'
import { getServerSession } from '@/lib/server-auth'
import { apiResponse } from '@/lib/api-helpers'

const eventsRoute = new Hono()

eventsRoute.get(async (c) => {
  try {
    const searchParams = c.req.query()
    const page = parseInt(searchParams['page'] || '1')
    const limit = parseInt(searchParams['limit'] || '10')
    const search = searchParams['search'] || ''
    const { offset } = await sqlite.paginate(page, limit)
    let whereClause = ''
    let params: any[] = []
    if (search) {
      whereClause = ' WHERE title LIKE ? OR description LIKE ?'
      params = [`%${search}%`, `%${search}%`]
    }
    const countResult = await sqlite.get('SELECT COUNT(*) as total FROM events' + whereClause, params)
    const total = countResult?.total || 0
    let eventsQuery = `SELECT e.*, c.name as categoryName FROM events e LEFT JOIN event_categories c ON e.categoryId = c.id`
    if (search) eventsQuery += ' WHERE e.title LIKE ? OR e.description LIKE ?'
    eventsQuery += ' ORDER BY e.startDate DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)
    const events = await sqlite.all(eventsQuery, params)
    return c.json({ events, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    return c.json({ error: 'Failed to fetch events' }, 500)
  }
})

export { eventsRoute }
