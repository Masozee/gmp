import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || "default-secret"
const JWT_EXPIRES_IN = "1d" // 1 day

// Convert secret to Uint8Array for jose
const secretKey = new TextEncoder().encode(JWT_SECRET)

export interface JWTPayload {
  id: string
  email: string
  role: "USER" | "ADMIN"
  [key: string]: unknown
}

export async function signToken(payload: JWTPayload): Promise<string> {
  try {
    console.log("[JWT] Signing token with payload:", payload)

    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(JWT_EXPIRES_IN)
      .setIssuedAt()
      .sign(secretKey)

    console.log("[JWT] Token signed successfully")
    return token
  } catch (error) {
    console.error("[JWT] Error signing token:", error)
    throw error
  }
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    console.log("[JWT] Verifying token")
    console.log("[JWT] Using secret:", JWT_SECRET.substring(0, 10) + "...")

    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    })

    const result = payload as unknown as JWTPayload

    if (!result.id || !result.email || !result.role) {
      throw new Error("Invalid token payload")
    }

    console.log("[JWT] Token verified successfully:", {
      id: result.id,
      email: result.email,
      role: result.role,
    })

    return result
  } catch (error) {
    console.error("[JWT] Token verification failed:", error)
    throw new Error("Invalid token")
  }
} 