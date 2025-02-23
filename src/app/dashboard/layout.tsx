import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { DashboardRightSidebar } from "@/components/dashboard-right-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="grid grid-cols-[1fr_350px] h-[calc(100vh-56px)]">
          <main className="overflow-auto">
            {children}
          </main>
          <DashboardRightSidebar />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 