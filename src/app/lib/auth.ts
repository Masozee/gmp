import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

// For server components where we just need to read session
export async function createServerSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: () => undefined,
        set: () => {},
        remove: () => {},
      },
    }
  );
}

export async function getSession() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  return session;
}

// Use this in server components to require authentication
// The middleware will handle the redirect for normal navigation
export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    // We shouldn't reach here because middleware should handle redirects,
    // but just in case, we'll redirect to login
    redirect('/login');
  }
  
  return session;
}

export async function createAdminAccount(email: string, password: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: 'admin',
    },
  });
  
  return { data, error };
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signOut();
  return { error };
} 