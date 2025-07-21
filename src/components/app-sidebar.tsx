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
  SlidersHorizontalIcon,
  FileSliders,
  Settings,
  Unplug,
  QrCode,
  ScanFace,
  TrendingUpIcon,
  Users,
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
      title: "Research",
      url: "/admin/research",
      icon: TrendingUpIcon,
    },
    {
      title: "Pengurus",
      url: "/admin/pengurus",
      icon: Users,
    },
    {
      title: "Pages",
      url: "/admin/program",
      icon: FolderIcon,
      items: [
        {
          title: "Semua Program",
          url: "/admin/program",
          icon: FolderIcon,
        },
        {
          title: "Diskusi",
          url: "/admin/program/diskusi",
          icon: MessageSquareIcon,
        },
      ],
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChartIcon,
      items: [
        {
          title: "Visitor Tracking",
          url: "/admin/analytics/visitor-tracking",
          icon: UsersIcon,
        },
      ],
    },
    {
      title: "Konfigurasi",
      url: "/admin/config",
      icon: Settings,
      items: [
        {
          title: "Halaman",
          url: "/admin/config/pages",
          icon: FileIcon,
        },
        {
          title: "Slider Homepage",
          url: "/admin/config/homepage-slides",
          icon: FileSliders,
        },
        {
          title: "Pengurus",
          url: "/admin/config/homepage-slides",
          icon: UsersIcon,
        },
        {
          title: "Mitra Strategis",
          url: "/admin/config/partners",
          icon: Unplug,
        },
        {
          title: "Media Sosial",
          url: "/admin/config/social-media",
          icon: ScanFace,
        },
      ],
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
      name: "Asset Management",
      url: "/admin/data",
      icon: DatabaseIcon,
    },
    {
      name: "Shorten URL",
      url: "/admin/reports",
      icon: QrCode,
    },
    {
      name: "Word Assistant",
      url: "/admin/assistant",
      icon: FileIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "Loading...",
    email: "loading@example.com",
    avatar: "",
    initials: "L",
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  // Helper function to generate initials from name
  const generateInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Fetch user data from Hono API
  React.useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/hono/protected/profile', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          const userData = await response.json();
          if (userData.success && userData.user) {
            const initials = generateInitials(userData.user.name);
            setUser({
              name: userData.user.name,
              email: userData.user.email,
              avatar: "",
              initials: initials,
            });
          }
        } else {
          // If unauthorized, redirect to login
          if (response.status === 401) {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserData();
  }, [router]);

  return (
    <div className="font-geist">
      <Sidebar collapsible="offcanvas" className="bg-slate-900 border-slate-800" {...props}>
        <SidebarHeader className="bg-slate-900">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-slate-800">
                <a href="/admin" className="flex items-center">
                  <Image src="/images/logo/logo.png" alt="Logo" width={32} height={32} />
                  <span className="text-lg font-bold ml-3 text-white">Admin Panel</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="bg-slate-900">
          <NavMain items={data.navMain} />
          <NavDocuments items={data.documents} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter className="bg-slate-900">
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
