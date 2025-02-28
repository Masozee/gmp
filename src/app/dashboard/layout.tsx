"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { DashboardRightSidebar } from "@/components/dashboard-right-sidebar"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isPublicationPage = pathname?.includes("/dashboard/publications")

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 min-w-0">
          <div className="flex flex-col h-full">
            <SiteHeader />
            <div className="flex-1 flex overflow-hidden">
              <main className="flex-1 min-w-0 overflow-y-auto">
                <div className={cn(
                  "h-full",
                  isPublicationPage ? "p-0" : "p-6"
                )}>
                  {children}
                </div>
              </main>
              <aside className="w-[350px] border-l overflow-y-auto shrink-0">
                <DashboardRightSidebar />
              </aside>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
} 