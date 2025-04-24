import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define our user payload type
export interface UserPayload {
  id: string | number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function verifyToken(token: string): UserPayload | null {
  console.log('[JWT] Verifying token:', token.substring(0, 20) + '...');
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    console.error('[JWT] Token verification failed:', error);
    return null;
  }
}

/**
 * Verify JWT from the Authorization header or from cookies
 */
export async function verifyJwtHeader(request: Request): Promise<UserPayload | null> {
  try {
    // Try to get token from authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      return verifyToken(token);
    }
    
    // Try to get token from cookie
    const cookies = request.headers.get('cookie');
    if (cookies) {
      const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='));
      if (tokenCookie) {
        const token = tokenCookie.split('=')[1].trim();
        return verifyToken(token);
      }
    }
    
    console.log('No token found in headers or cookies');
    return null;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}
