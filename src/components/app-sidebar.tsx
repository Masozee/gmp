"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  BarChartIcon,
  BookOpenIcon,
  CalendarIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  FolderIcon,
  MessageSquareIcon,
  BriefcaseIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin User",
    email: "admin@partisipasimuda.org",
    avatar: "/images/logo/logo.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Publikasi",
      url: "/admin/publikasi",
      icon: BookOpenIcon,
    },
    {
      title: "Acara",
      url: "/admin/acara",
      icon: CalendarIcon,
    },
    {
      title: "Karir",
      url: "/admin/karir",
      icon: BriefcaseIcon,
    },
    {
      title: "Program",
      url: "/admin/program",
      icon: FolderIcon,
      items: [
        {
          title: "Diskusi",
          url: "/admin/program/diskusi",
          icon: MessageSquareIcon,
        },
      ],
    },
    {
      title: "Pengguna",
      url: "/admin/users",
      icon: UsersIcon,
    },
    {
      title: "Laporan",
      url: "/admin/reports", 
      icon: BarChartIcon,
    },
  ],
  navSecondary: [
    {
      title: "Pengaturan",
      url: "/admin/settings",
      icon: SettingsIcon,
    },
    {
      title: "Bantuan",
      url: "/admin/help",
      icon: HelpCircleIcon,
    },
    {
      title: "Pencarian",
      url: "/admin/search",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "/admin/data",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "/admin/reports",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "/admin/assistant",
      icon: FileIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState(data.user);
  const router = useRouter();

  // Fetch user data from our new authentication system
  React.useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          const userData = await response.json();
          if (userData.user) {
            setUser({
              name: userData.user.name,
              email: userData.user.email,
              avatar: "/images/logo/logo.png", // Use logo as avatar for now
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUserData();
  }, []);

  return (
    <div className="font-inter">
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                <a href="/admin" className="flex items-center">
                  <Image src="/images/logo/logo.png" alt="Logo" width={28} height={28} />
                  <span className="text-base font-semibold ml-2">Admin Panel</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavDocuments items={data.documents} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
