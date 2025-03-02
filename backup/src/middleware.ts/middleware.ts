import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/edge-jwt"

// List of paths that require authentication
const protectedPaths = [
  "/dashboard",
  "/users",
  "/api/dashboard",
  "/api/profile",
  "/api/publications",
  "/api/events",
  "/api/auth/session"
]

// List of paths that are only accessible when not authenticated
const authPaths = ["/login", "/register"]

// Cookie settings
const cookieSettings = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log("[Middleware] Processing path:", pathname)

  // Skip middleware for static files and images
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/images") ||
    pathname.includes("favicon") ||
    pathname.includes(".svg")
  ) {
    return NextResponse.next()
  }

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  // Check if the path is for authentication (login/register)
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path))

  // Get the token from the cookies
  const token = request.cookies.get("token")

  console.log("[Middleware] Token present:", !!token)
  if (token) {
    console.log("[Middleware] Token value exists:", !!token.value)
    console.log("[Middleware] Token value preview:", token.value.substring(0, 10) + "...")
  }

  try {
    // Verify the token if it exists
    if (token?.value) {
      console.log("[Middleware] Verifying token")
      const decoded = await verifyToken(token.value)
      console.log("[Middleware] Token verified for user:", decoded.email)

      // If user is authenticated and tries to access auth paths, redirect to dashboard
      if (isAuthPath) {
        console.log("[Middleware] Redirecting authenticated user to dashboard")
        const response = NextResponse.redirect(new URL("/dashboard", request.url))
        // Preserve token cookie
        response.cookies.set({
          name: "token",
          value: token.value,
          ...cookieSettings,
        })
        return response
      }

      // Create a new response
      const response = NextResponse.next()

      // Add the user info to the response headers
      const userInfo = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      }
      console.log("[Middleware] Setting user info in headers:", userInfo)
      
      response.headers.set("x-user-info", JSON.stringify(userInfo))

      // Preserve token cookie
      response.cookies.set({
        name: "token",
        value: token.value,
        ...cookieSettings,
      })

      return response
    }

    // If no token and trying to access protected path, redirect to login
    if (isProtectedPath) {
      console.log("[Middleware] Redirecting unauthenticated user to login")
      const url = new URL("/login", request.url)
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }

    // Allow access to public routes
    console.log("[Middleware] Allowing access to public route")
    return NextResponse.next()
  } catch (error) {
    console.error("[Middleware] Error:", error)

    // If token is invalid and trying to access protected path, redirect to login
    if (isProtectedPath) {
      console.log("[Middleware] Invalid token, redirecting to login")
      const url = new URL("/login", request.url)
      url.searchParams.set("from", pathname)
      const response = NextResponse.redirect(url)
      response.cookies.delete("token")
      return response
    }

    // For invalid tokens, clear the cookie
    console.log("[Middleware] Clearing invalid token")
    const response = NextResponse.next()
    response.cookies.delete("token")
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
} 