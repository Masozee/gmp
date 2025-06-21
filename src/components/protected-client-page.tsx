"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

export function ProtectedClientPage({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  
  // Check authentication on the client side
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!response.ok) {
          // If no session, redirect to login
          router.replace('/login');
          return;
        }

        const data = await response.json();
        
        if (data.success && data.user) {
          // If session exists, show content
          setUser(data.user);
          setIsLoading(false);
        } else {
          // If no valid session, redirect to login
          router.replace('/login');
        }
      } catch (error) {
        console.error("Authentication error:", error);
        router.replace('/login');
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  // If not loading and we have a user, show the protected content
  return <>{children}</>;
} 