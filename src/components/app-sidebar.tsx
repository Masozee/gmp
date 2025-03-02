"use client"

import * as React from "react"
import {
  BookOpen,
  BookOpenText,
  Bot,
  CalendarDays,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Users,
  Briefcase,
  BarChart,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
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
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Reports",
          url: "/dashboard/reports",
        },
      ],
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: Briefcase,
      items: [
        {
          title: "All Projects",
          url: "/dashboard/projects",
        },
        {
          title: "Create New",
          url: "/dashboard/projects/new",
        },
        {
          title: "Categories",
          url: "/dashboard/projects/categories",
        },
      ],
    },
    {
      title: "People",
      url: "#",
      icon: Users,
      items: [
        {
          title: "List",
          url: "/dashboard/profiles",
        },
        {
          title: "Roles",
          url: "/dashboard/users/roles",
        },
        {
          title: "Permissions",
          url: "/dashboard/users/permissions",
        },
      ],
    },
    {
      title: "Publications",
      url: "#",
      icon: BookOpenText,
      items: [
        {
          title: "List",
          url: "/dashboard/publications",
        },
        {
          title: "Categories",
          url: "/dashboard/publications/categories",
        },
      ],
    },
    {
      title: "Events",
      url: "/dashboard/events",
      icon: CalendarDays,
      items: [
        {
          title: "All Events",
          url: "/dashboard/events",
        },
        {
          title: "Create New",
          url: "/dashboard/events/new",
        },
        {
          title: "Calendar View",
          url: "/dashboard/events?view=calendar",
        },
        {
          title: "Upcoming",
          url: "/dashboard/events?status=UPCOMING",
        },
        {
          title: "Completed",
          url: "/dashboard/events?status=COMPLETED",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Logs",
          url: "/dashboard/logs",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Project Management",
      url: "/dashboard/projects",
      icon: Briefcase,
    },
    {
      name: "Geo Tagging",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AI Agent Dashboard</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
