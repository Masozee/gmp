"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { DashboardRightSidebar } from "@/components/dashboard-right-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isEligible, setIsEligible] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const start = performance.now();
      try {
        console.log('[Perf] Starting auth/session fetch');
        const res = await fetch('/api/auth/session');
        const afterFetch = performance.now();
        console.log(`[Perf] /api/auth/session fetch took ${afterFetch - start}ms`);
        if (res.ok) {
          const userStart = performance.now();
          const user = await res.json();
          const afterUser = performance.now();
          console.log(`[Perf] Parsing user JSON took ${afterUser - userStart}ms`);
          // Adjust this check based on your user object structure
          if (user && (user.role === 'admin' || user.isAdmin)) {
            setIsAuthenticated(true);
            setIsEligible(true);
            const end = performance.now();
            console.log(`[Perf] Auth check complete, total time: ${end - start}ms`);
          } else {
            setIsAuthenticated(true);
            setIsEligible(false);
            const beforeRedirect = performance.now();
            router.push('/admin/auth/login'); // or redirect to a forbidden page
            const afterRedirect = performance.now();
            console.log(`[Perf] Redirect (ineligible) took ${afterRedirect - beforeRedirect}ms`);
            return;
          }
        } else {
          setIsAuthenticated(false);
          setIsEligible(false);
          const beforeRedirect = performance.now();
          router.push('/admin/auth/login');
          const afterRedirect = performance.now();
          console.log(`[Perf] Redirect (unauthenticated) took ${afterRedirect - beforeRedirect}ms`);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
        setIsEligible(false);
        const beforeRedirect = performance.now();
        router.push('/admin/auth/login');
        const afterRedirect = performance.now();
        console.log(`[Perf] Redirect (error) took ${afterRedirect - beforeRedirect}ms`);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

  if (!isAuthenticated || !isEligible) {
    return null // Will redirect in the useEffect
  }

  return (
    <div className="admin-geist-font grid grid-cols-1 lg:grid-cols-[1fr_350px] h-[calc(100vh-56px)]">
      <main className="overflow-auto p-6">
        {children}
      </main>
      <DashboardRightSidebar />
    </div>
  )
} 