import { Hono } from 'hono'
import sqlite from '@/lib/sqlite'
import { getServerSession } from '@/lib/server-auth'

const publicationsRoute = new Hono()

// GET /api/publications
publicationsRoute.get(async (c) => {
  try {
    // For demo, skip session check; in production, add auth middleware
    const searchParams = c.req.query()
    const search = searchParams['search'] || ''
    const status = searchParams['status'] || 'all'
    const page = parseInt(searchParams['page'] || '1')
    const limit = parseInt(searchParams['limit'] || '10')
    const { offset, limit: validLimit } = await sqlite.paginate(page, limit)
    const conditions = []
    const params: any[] = []
    if (search) { conditions.push('(p.title LIKE ? OR p.abstract LIKE ?)'); params.push(`%${search}%`, `%${search}%`) }
    if (status && status !== 'all') { conditions.push('p.published = ?'); params.push(status === 'PUBLISHED' ? 1 : 0) }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const publications = await sqlite.all(`SELECT p.id, p.title, p.slug, p.abstract, p.published, p.categoryId, p.createdAt, p.updatedAt, c.name as categoryName FROM publications p LEFT JOIN event_categories c ON p.categoryId = c.id ${whereClause} ORDER BY p.createdAt DESC LIMIT ? OFFSET ?`, [...params, validLimit, offset])
    const totalCount = await sqlite.get(`SELECT COUNT(*) as count FROM publications p ${whereClause}`, params)
    return c.json({ publications, pagination: { page, limit: validLimit, totalCount: totalCount ? totalCount.count : 0, totalPages: Math.ceil((totalCount ? totalCount.count : 0) / validLimit) } })
  } catch (error) {
    return c.json({ error: 'Failed to fetch publications' }, 500)
  }
})

export { publicationsRoute }
