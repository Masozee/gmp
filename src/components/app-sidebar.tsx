"use client"

import * as React from "react"
import {
  ChartColumnStacked,
  FolderKanban,
  Newspaper,
  Briefcase,
  Home,
  Mail,
  Settings2,
  Map,
  Calendar,
  LayoutGrid,
  CircleUser,
  Blocks,
  Earth,
  MonitorDown
} from "lucide-react"
import Image from "next/image"
import { memo } from "react"

import { cx } from "class-variance-authority"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader as SidebarHeaderComponent,

} from "@/components/ui/sidebar"

// Memoize the sidebar data to prevent unnecessary recalculations
const sidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: ChartColumnStacked,
      isActive: false,
    },
    {
      title: "Tasks",
      url: "/dashboard/tasks",
      icon: FolderKanban,
      isActive: false,
    },
    {
      title: "Publications",
      url: "#",
      icon: Newspaper,
      isActive: false,
      items: [
        {
          title: "Browse Publications",
          url: "/dashboard/publications",
        },
        {
          title: "Create Publication",
          url: "/dashboard/publications/create",
        },
        {
          title: "Categories",
          url: "/dashboard/publications/categories",
        },
        {
          title: "Analytics",
          url: "/dashboard/publications/analytics",
        },
      ],
    },
    {
      title: "Projects",
      url: "#",
      icon: Briefcase,
      isActive: false,
      items: [
        {
          title: "All Projects",
          url: "/dashboard/projects",
        },
        {
          title: "Create Project",
          url: "/dashboard/projects/create",
        },
        {
          title: "Milestones",
          url: "/dashboard/projects/milestones",
        },
        {
          title: "Reports",
          url: "/dashboard/projects/reports",
        },
      ],
    },
    {
      title: "Calendar",
      url: "/dashboard/calendar",
      icon: Calendar,
      isActive: false,
    },
    {
      title: "People",
      url: "#",
      icon: CircleUser,
      items: [
        {
          title: "List",
          url: "/dashboard/profiles",
        },
        {
          title: "User Profiles",
          url: "/dashboard/users/profiles",
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
      title: "Events",
      url: "/dashboard/events",
      icon: Calendar,
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
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/dashboard/support",
      icon: Home,
    },
    {
      title: "Feedback",
      url: "/dashboard/feedback",
      icon: Mail,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2 // Replace with a valid icon if imported, otherwise use 'Settings2' as a string or another imported icon.
    },
  ],
  projects: [
    {
      name: "Project Management",
      url: "/dashboard/projects",
      icon: Blocks,
    },
    {
      name: "Geo Tagging",
      url: "/dashboard/projects/geo-tagging",
      icon: Earth,
    },
    {
      name: "Asset Management",
      url: "#",
      icon: MonitorDown,
    },
  ],
};

// Memoize individual sections
const SidebarHeader = memo(function SidebarHeader() {
  return (
    <SidebarHeaderComponent className="border-b border-sidebar-border">
  <div className="flex items-center justify-center py-2">
  <Image
    src="/logos/logo.png"
    alt="Logo"
    width={160}
    height={180}
    className="object-contain drop-shadow-lg"
    priority
    loading="eager"
  />
</div>
</SidebarHeaderComponent>
  );
});

export const AppSidebar = memo(function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        <NavProjects projects={sidebarData.projects} />
        <NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
});
