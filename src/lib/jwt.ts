"use client"

interface TokenPayload {
  id: string
  email: string
  role: string
}

/**
 * Verify a JWT token on the client side
 * This is a simple implementation that decodes the token without verifying the signature
 * Proper verification happens on the server
 */
export function verifyToken(token: string): TokenPayload {
  try {
    // Split the token and get the payload
    const [, payload] = token.split('.');
    
    // Decode the payload
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to verify token:', error);
    throw new Error('Invalid token');
  }
} 