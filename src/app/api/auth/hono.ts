import { Hono } from 'hono'
import sqlite from '@/lib/sqlite'
import bcrypt from 'bcryptjs'
import { signToken, verifyToken } from '@/lib/edge-jwt'
import { apiResponse } from '@/lib/api-helpers'
import logger from '@/lib/logger'

const authRoute = new Hono()

// POST /api/auth/login
authRoute.post('/login', async (c) => {
  try {
    const body = await c.req.json()
    const { email, password } = body
    if (!email || !password) return c.json({ error: 'Email and password are required' }, 400)
    const user = await sqlite.get('SELECT id, email, password, role FROM users WHERE email = ?', [email])
    if (!user) return c.json({ error: 'Invalid credentials' }, 401)
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return c.json({ error: 'Invalid credentials' }, 401)
    const token = await signToken({ id: user.id, email: user.email, role: user.role })
    logger.info(`User ${email} logged in successfully`, { userId: user.id })
    return c.json({ token, user: { id: user.id, email: user.email, role: user.role } })
  } catch (error) {
    logger.error('Login failed', error instanceof Error ? error : new Error(String(error)))
    return c.json({ error: 'Authentication failed' }, 500)
  }
})

// POST /api/auth/register
authRoute.post('/register', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    if (!email || !password || !name) return c.json({ error: 'Email, password, and name are required' }, 400)
    const existingUser = await sqlite.get('SELECT * FROM users WHERE email = ?', [email])
    if (existingUser) return c.json({ error: 'User already exists' }, 409)
    const hashedPassword = await bcrypt.hash(password, 10)
    const now = new Date().toISOString()
    const result = await sqlite.run('INSERT INTO users (email, password, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)', [email, hashedPassword, name, 'user', now, now])
    const user = await sqlite.get('SELECT id, email, name, role, createdAt, updatedAt FROM users WHERE id = ?', [result.lastInsertRowid])
    return c.json(user)
  } catch (error) {
    return c.json({ error: 'Failed to register user' }, 500)
  }
})

// POST /api/auth/logout
authRoute.post('/logout', async (c) => {
  // For stateless JWT, just instruct client to delete token
  return c.json({ message: 'Logged out. Remove token from client.' })
})

// GET /api/auth/session
authRoute.get('/session', async (c) => {
  try {
    const token = c.req.header('authorization')?.replace('Bearer ', '')
    if (!token) return c.json({ error: 'Unauthorized - No token provided' }, 401)
    const decoded = await verifyToken(token)
    const newToken = await signToken({ id: decoded.id, email: decoded.email, role: decoded.role })
    return c.json({ user: { id: decoded.id, email: decoded.email, role: decoded.role }, token: newToken })
  } catch (error) {
    return c.json({ error: 'Unauthorized - Invalid token' }, 401)
  }
})

export { authRoute }
