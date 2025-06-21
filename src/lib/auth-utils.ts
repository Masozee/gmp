import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, users, sessions, type User } from './db';
import { eq, and, gt } from 'drizzle-orm';
import { randomBytes } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateJWT(payload: { userId: number; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJWT(token: string): { userId: number; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role: string };
  } catch {
    return null;
  }
}

export async function createUser(email: string, password: string, name: string, role: 'admin' | 'user' = 'user') {
  const hashedPassword = await hashPassword(password);
  
  const [user] = await db.insert(users).values({
    email,
    password: hashedPassword,
    name,
    role,
  }).returning();
  
  return user;
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  
  if (!user) return null;
  
  const isValid = await verifyPassword(password, user.password);
  return isValid ? user : null;
}

export async function createSession(userId: number): Promise<string> {
  const sessionId = randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_DURATION;
  
  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });
  
  return sessionId;
}

export async function getSessionUser(sessionId: string): Promise<User | null> {
  const [session] = await db
    .select({
      user: users,
      session: sessions,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.id, sessionId),
        gt(sessions.expiresAt, Date.now())
      )
    );
  
  return session?.user || null;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function cleanupExpiredSessions(): Promise<void> {
  await db.delete(sessions).where(
    and(
      eq(sessions.expiresAt, Date.now())
    )
  );
} 