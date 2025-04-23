import { SignJWT, jwtVerify } from "jose"

// This should be in an environment variable in a real application
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "test_jwt_secret_for_development_only"
)

interface TokenPayload {
  id: string
  email: string
  role: string
}

/**
 * Sign a JWT token with the given payload
 * @param payload The data to include in the token
 * @returns The signed JWT token
 */
export async function signToken(payload: TokenPayload): Promise<string> {
  const token = await new SignJWT(payload as unknown)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(JWT_SECRET)
  
  return token
}

/**
 * Verify a JWT token on the server
 * @param token The JWT token to verify
 * @returns The decoded payload if valid
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as unknown as TokenPayload
  } catch (error) {
    console.error("Failed to verify token:", error)
    throw new Error("Invalid token")
  }
} 