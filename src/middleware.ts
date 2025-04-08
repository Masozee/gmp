import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/edge-jwt"

// List of paths that require authentication
const protectedPaths = [
  "/dashboard",
  "/users",
  "/api/dashboard",
  "/api/profile",
  "/api/auth/session"
]

// List of paths that are only accessible when not authenticated
const authPaths = ["/login", "/register"]

// List of public API paths that don't require authentication
const publicApiPaths = [
  "/api/test",
  "/api/auth/login",
  "/api/auth/register",
  "/api/events",
  "/api/categories",
  "/api/publications"
]

// Cookie settings - must match those in login API
const cookieSettings = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 24 * 60 * 60, // 24 hours (same as login API)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log(`\n[Middleware] =============== Processing path: ${pathname} ===============`)

  // Skip middleware for static files and images
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/images") ||
    pathname.includes("favicon") ||
    pathname.includes(".svg")
  ) {
    console.log("[Middleware] Skipping for static asset:", pathname)
    return NextResponse.next()
  }
  
  // Check if the path is a public API path
  const isPublicApiPath = publicApiPaths.some(path => pathname.startsWith(path))
  if (isPublicApiPath) {
    console.log("[Middleware] Public API path, allowing access:", pathname)
    return NextResponse.next()
  }

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )
  console.log("[Middleware] Is protected path:", isProtectedPath)

  // Check if the path is for authentication (login/register)
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path))
  console.log("[Middleware] Is auth path:", isAuthPath)

  // Get the token from the cookies
  const token = request.cookies.get("token")
  console.log("[Middleware] All cookies:", Array.from(request.cookies.getAll()).map(c => `${c.name}=${c.value?.substring(0, 10)}...`))

  console.log("[Middleware] Token present:", !!token)
  if (token) {
    console.log("[Middleware] Token name:", token.name)
    console.log("[Middleware] Token value exists:", !!token.value)
    console.log("[Middleware] Token value preview:", token.value?.substring(0, 20) + "...")
  }

  try {
    // Verify the token if it exists
    if (token?.value) {
      console.log("[Middleware] Attempting to verify token")
      
      try {
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
          
          console.log("[Middleware] Response URL:", response.url)
          console.log("[Middleware] Cookie in redirect response:", token.value.substring(0, 20) + "...")
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

        console.log("[Middleware] User authenticated, proceeding to:", pathname)
        return response
      } catch (verifyError) {
        console.error("[Middleware] Token verification failed:", verifyError)
        
        // Clear invalid token
        const response = NextResponse.next()
        response.cookies.delete("token")
        
        // If protected path, redirect to login
        if (isProtectedPath) {
          console.log("[Middleware] Redirecting to login due to invalid token")
          const url = new URL("/login", request.url)
          url.searchParams.set("from", pathname)
          return NextResponse.redirect(url)
        }
        
        return response
      }
    }

    // If no token and trying to access protected path, redirect to login
    if (isProtectedPath) {
      console.log("[Middleware] Redirecting unauthenticated user to login")
      const url = new URL("/login", request.url)
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }

    // Allow access to public routes
    console.log("[Middleware] Allowing access to public route:", pathname)
    return NextResponse.next()
  } catch (error) {
    console.error("[Middleware] Unexpected error:", error)

    // If error occurs and trying to access protected path, redirect to login
    if (isProtectedPath) {
      console.log("[Middleware] Error occurred, redirecting to login")
      const url = new URL("/login", request.url)
      url.searchParams.set("from", pathname)
      const response = NextResponse.redirect(url)
      response.cookies.delete("token")
      return response
    }

    // For other errors, clear the cookie
    console.log("[Middleware] Clearing token due to error")
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