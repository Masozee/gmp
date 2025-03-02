import { sign, verify, JwtPayload } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "default-secret"
const JWT_EXPIRES_IN = "1d" // 1 day

interface UserJwtPayload extends JwtPayload {
  id: string
  email: string
  role: "USER" | "ADMIN"
}

export function signToken(payload: Omit<UserJwtPayload, "iat" | "exp">) {
  try {
    console.log("[JWT] Signing token with payload:", payload)
    const token = sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      algorithm: "HS256",
    })
    console.log("[JWT] Token signed successfully")
    return token
  } catch (error) {
    console.error("[JWT] Error signing token:", error)
    throw error
  }
}

export function verifyToken(token: string): UserJwtPayload {
  try {
    console.log("[JWT] Verifying token")
    console.log("[JWT] Using secret:", JWT_SECRET.substring(0, 10) + "...")

    const decoded = verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    }) as UserJwtPayload

    console.log("[JWT] Token verified successfully:", {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    })

    return decoded
  } catch (error) {
    console.error("[JWT] Token verification failed:", error)
    throw new Error("Invalid token")
  }
}

export function verifyAuth(authHeader?: string): UserJwtPayload {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid authorization header")
  }

  const token = authHeader.split(" ")[1]
  return verifyToken(token)
} 