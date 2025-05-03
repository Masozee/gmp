import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  
  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options: CookieOptions) => {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();
  
  // 1. If the user is on the login page and is already authenticated
  // redirect them to the admin dashboard
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  // 2. If the user is trying to access any admin page and is not authenticated
  // redirect them to the login page
  if (!session && pathname.startsWith('/admin')) {
    const redirectUrl = new URL('/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*'
  ],
}; 