"use client";

import { ReactNode } from "react";
import { ProtectedClientPage } from "@/components/protected-client-page";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";

export function AdminLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <ProtectedClientPage>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col bg-white font-geist">
            <div className="@container/main flex flex-1 flex-col">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedClientPage>
  );
} 