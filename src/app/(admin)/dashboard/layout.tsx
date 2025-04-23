"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { DashboardRightSidebar } from "@/components/dashboard-right-sidebar"
import { GeistSans } from 'geist/font/sans'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/session')
        if (res.ok) {
          setIsAuthenticated(true)
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in the useEffect
  }

  return (
    <div className={`${GeistSans.className} grid grid-cols-1 lg:grid-cols-[1fr_350px] h-[calc(100vh-56px)]`}>
      <main className="overflow-auto p-6">
        {children}
      </main>
      <DashboardRightSidebar />
    </div>
  )
} 