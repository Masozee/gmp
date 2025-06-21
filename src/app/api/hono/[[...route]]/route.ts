import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { initializeDatabase, db, users, type User } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-utils';
import { eq } from 'drizzle-orm';
import { Context } from 'hono';

// Initialize database on startup
initializeDatabase();

// Define the app with proper typing
type Variables = {
  user: User;
};

const app = new Hono<{ Variables: Variables }>().basePath('/api/hono');

// Middleware to check authentication
const authMiddleware = async (c: Context<{ Variables: Variables }>, next: () => Promise<void>) => {
  const sessionId = c.req.header('Cookie')?.split('session=')[1]?.split(';')[0];
  
  if (!sessionId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const user = await getSessionUser(sessionId);
  
  if (!user) {
    return c.json({ error: 'Invalid session' }, 401);
  }

  c.set('user', user);
  await next();
};

// Public routes
app.get('/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Protected routes
app.use('/protected/*', authMiddleware);

app.get('/protected/profile', async (c) => {
  const user = c.get('user');
  return c.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

app.get('/protected/users', async (c) => {
  const user = c.get('user');
  
  // Only admins can view all users
  if (user.role !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const allUsers = await db.select({
    id: users.id,
    email: users.email,
    name: users.name,
    role: users.role,
    createdAt: users.createdAt,
  }).from(users);

  return c.json({
    success: true,
    users: allUsers,
  });
});

app.put('/protected/profile', async (c) => {
  const user = c.get('user');
  const { name } = await c.req.json();

  if (!name) {
    return c.json({ error: 'Name is required' }, 400);
  }

  const [updatedUser] = await db
    .update(users)
    .set({ name, updatedAt: new Date().toISOString() })
    .where(eq(users.id, user.id))
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    });

  return c.json({
    success: true,
    user: updatedUser,
  });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app); 