import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Get session ID from cookies
  const sessionId = request.cookies.get('session')?.value;
  
  // Simple session check - just verify cookie exists
  // Full validation will happen in the actual page/API route
  const hasSession = !!sessionId;
  
  // 1. If the user is on the login page and has a session cookie
  // redirect them to the admin dashboard
  if (hasSession && pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  // 2. If the user is trying to access any admin page and has no session cookie
  // redirect them to the login page
  if (!hasSession && pathname.startsWith('/admin')) {
    const redirectUrl = new URL('/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*'
  ],
}; 