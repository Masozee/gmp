import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/edge-jwt"

// Cache TTL configurations (in seconds)
const CACHE_TIMES = {
  short: 60, // 1 minute
  medium: 300, // 5 minutes
  long: 3600, // 1 hour
  day: 86400, // 24 hours
} as const;

// Define which paths should use caching and their TTL
const CACHE_PATHS = new Map([
  ['/api/profile', CACHE_TIMES.medium],
  ['/api/publications', CACHE_TIMES.short],
  ['/api/events', CACHE_TIMES.medium],
  ['/api/weather', CACHE_TIMES.short],
]);

// Simple in-memory cache
type CacheEntry = {
  response: Response;
  timestamp: number;
};

const apiCache = new Map<string, CacheEntry>();

// List of paths that require authentication
const protectedPaths = [
  "/admin",
  "/dashboard", // Keep for backward compatibility
  "/api/admin",
  "/api/dashboard", // Keep for backward compatibility
  "/api/profile",
  "/api/auth/session"
]

// List of paths that are only accessible when not authenticated
const authPaths = [
  "/admin/login", // New auth path
  "/(auth)/admin/login",
  "/admin/auth/login", // Keep for backward compatibility
  "/admin/auth/register",
  "/admin/auth/forgot-password",
  "/auth/login", // Keep for backward compatibility
  "/auth/register", // Keep for backward compatibility
  "/login", // Keep for backward compatibility
  "/register" // Keep for backward compatibility
]

// List of public API paths that don't require authentication
const publicApiPaths = [
  "/api/test",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
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
  maxAge: 60 * 60, // 1 hour to match token expiration (previously 24 hours)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log(`\n[Middleware] =============== Processing path: ${pathname} ===============`)

  // Skip middleware for static files, images, homepage
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/images") ||
    pathname.includes("favicon") ||
    pathname.includes(".svg") ||
    pathname === "/" // Skip middleware for homepage to prevent redirect loops
  ) {
    console.log("[Middleware] Skipping for static asset or homepage:", pathname)
    return NextResponse.next()
  }
  
  // Handle caching for API routes
  if (pathname.startsWith('/api/')) {
    const cacheTTL = CACHE_PATHS.get(pathname.split('?')[0]);
    
    if (cacheTTL) {
      const cacheKey = request.nextUrl.toString();
      const cachedData = apiCache.get(cacheKey);

      // Return cached response if it exists and is not expired
      if (cachedData) {
        const age = Date.now() - cachedData.timestamp;
        if (age < cacheTTL * 1000) {
          console.log("[Middleware] Cache hit for:", pathname);
          return new NextResponse(cachedData.response.body, cachedData.response);
        } else {
          // Remove expired cache entry
          apiCache.delete(cacheKey);
        }
      }

      // Get fresh response
      const response = await handleRequest(request);
      
      if (response.status === 200) {
        // Clone the response and store in cache
        const clonedResponse = new NextResponse(response.body, response);
        apiCache.set(cacheKey, {
          response: clonedResponse,
          timestamp: Date.now()
        });
      }

      return response;
    }
  }

  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  const { pathname } = request.nextUrl

  // For auth pages, just return next() to ensure the correct layout is used
  if (pathname.startsWith("/admin/auth/") || pathname.includes("/(auth)/") || pathname === "/admin/login") {
    console.log("[Middleware] Auth page detected, using proper auth layout:", pathname)
    return NextResponse.next()
  }
  
  // Check if the path is a public API path
  const isPublicApiPath = publicApiPaths.some(path => pathname.startsWith(path))
  if (isPublicApiPath) {
    console.log("[Middleware] Public API path, allowing access:", pathname)
    return NextResponse.next()
  }

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some((path) => {
    // Special case: don't treat /admin/login as protected
    if (pathname === "/admin/login") return false;
    return pathname.startsWith(path);
  })
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

        // If user is authenticated and tries to access auth paths, redirect to admin dashboard
        if (isAuthPath) {
          console.log("[Middleware] Redirecting authenticated user to admin dashboard")
          const response = NextResponse.redirect(new URL("/admin", request.url))
          
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
          // Use the new auth route
          const url = new URL("/admin/login", request.url)
          url.searchParams.set("from", pathname)
          return NextResponse.redirect(url)
        }
        
        return response
      }
    }

    // If no token and trying to access protected path, redirect to login
    if (isProtectedPath) {
      console.log("[Middleware] Redirecting unauthenticated user to login")
      // Use the new auth route
      const url = new URL("/admin/login", request.url)
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
      // Use the new auth route
      const url = new URL("/admin/login", request.url)
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