"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export function ProtectedClientPage({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // Check authentication on the client side for additional protection
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "",
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
        );
        
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          // If no session, redirect to login
          router.replace('/login');
        } else {
          // If session exists, show content
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        router.replace('/login');
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  // If not loading, we have a session, so show the protected content
  return <>{children}</>;
} 