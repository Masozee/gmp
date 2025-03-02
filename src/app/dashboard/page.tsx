"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowUpRight, 
  BarChart, 
  Calendar, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUp, 
  ArrowDown,
  CalendarDays,
  Eye,
  UserPlus,
  Share2,
  BarChart3,
  Activity,
  Server,
  Database,
  Network,
  HardDrive
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Define types for our dashboard data
interface DashboardStats {
  totalUsers: number
  activeSessions: number
  errorRate: number
  systemStatus: "operational" | "degraded" | "outage"
  userGrowth: number
  recentActivity: {
    id: string
    user: string
    action: string
    timestamp: string
  }[]
  upcomingEvents: {
    id: string
    title: string
    date: string
    status: string
    registrations: number
  }[]
  eventStats: {
    total: number
    upcoming: number
    completed: number
    cancelled: number
  }
  userActivity: {
    date: string
    activeUsers: number
  }[]
  systemHealth: {
    cpu: number
    memory: number
    storage: number
    network: number
    lastUpdated: string
  }
  topPerformingEvents: {
    id: string
    title: string
    registrations: number
    views: number
    conversionRate: number
  }[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data
        setStats({
          totalUsers: 2547,
          activeSessions: 184,
          errorRate: 0.12,
          systemStatus: "operational",
          userGrowth: 12.5,
          recentActivity: [
            { id: "1", user: "Sarah Johnson", action: "Created new event", timestamp: "2 minutes ago" },
            { id: "2", user: "Michael Chen", action: "Updated user profile", timestamp: "15 minutes ago" },
            { id: "3", user: "Emma Davis", action: "Published article", timestamp: "1 hour ago" },
            { id: "4", user: "James Wilson", action: "Deleted event", timestamp: "3 hours ago" },
            { id: "5", user: "Olivia Martinez", action: "Added new speaker", timestamp: "5 hours ago" }
          ],
          upcomingEvents: [
            { id: "1", title: "AI and Machine Learning Workshop", date: "May 15, 2025", status: "UPCOMING", registrations: 156 },
            { id: "2", title: "Deep Learning Conference 2025", date: "June 3, 2025", status: "UPCOMING", registrations: 243 },
            { id: "3", title: "Data Science Symposium", date: "June 12, 2025", status: "UPCOMING", registrations: 98 }
          ],
          eventStats: {
            total: 22,
            upcoming: 8,
            completed: 12,
            cancelled: 2
          },
          userActivity: [
            { date: "Mon", activeUsers: 1245 },
            { date: "Tue", activeUsers: 1380 },
            { date: "Wed", activeUsers: 1530 },
            { date: "Thu", activeUsers: 1678 },
            { date: "Fri", activeUsers: 1890 },
            { date: "Sat", activeUsers: 1456 },
            { date: "Sun", activeUsers: 1245 }
          ],
          systemHealth: {
            cpu: 42,
            memory: 68,
            storage: 57,
            network: 84,
            lastUpdated: "2 minutes ago"
          },
          topPerformingEvents: [
            { id: "1", title: "AI and Machine Learning Workshop", registrations: 156, views: 2345, conversionRate: 6.7 },
            { id: "2", title: "Deep Learning Conference 2025", registrations: 243, views: 3120, conversionRate: 7.8 },
            { id: "3", title: "Data Science Symposium", registrations: 98, views: 1560, conversionRate: 6.3 }
          ]
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Helper function to format numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    } else {
      return num.toString()
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your platform.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/analytics">
              <BarChart className="mr-2 h-4 w-4" />
              View Analytics
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/events">
              <Calendar className="mr-2 h-4 w-4" />
              Manage Events
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalUsers)}</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">{stats.userGrowth}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              Users currently online
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.errorRate}%</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {stats.systemStatus}
            </div>
            <div className="flex items-center pt-1">
              <span className={`h-2 w-2 rounded-full mr-1 ${
                stats.systemStatus === "operational" ? "bg-green-500" :
                stats.systemStatus === "degraded" ? "bg-yellow-500" : "bg-red-500"
              }`} />
              <p className="text-xs text-muted-foreground">
                All systems normal
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Current system resource utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Server className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">CPU Usage</span>
                </div>
                <span className="text-sm font-medium">{stats.systemHealth.cpu}%</span>
              </div>
              <Progress value={stats.systemHealth.cpu} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {stats.systemHealth.cpu < 50 ? "Normal" : stats.systemHealth.cpu < 80 ? "Moderate" : "High"}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Memory Usage</span>
                </div>
                <span className="text-sm font-medium">{stats.systemHealth.memory}%</span>
              </div>
              <Progress value={stats.systemHealth.memory} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {stats.systemHealth.memory < 50 ? "Normal" : stats.systemHealth.memory < 80 ? "Moderate" : "High"}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Storage Usage</span>
                </div>
                <span className="text-sm font-medium">{stats.systemHealth.storage}%</span>
              </div>
              <Progress value={stats.systemHealth.storage} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {stats.systemHealth.storage < 50 ? "Normal" : stats.systemHealth.storage < 80 ? "Moderate" : "High"}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Network className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Network Usage</span>
                </div>
                <span className="text-sm font-medium">{stats.systemHealth.network}%</span>
              </div>
              <Progress value={stats.systemHealth.network} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {stats.systemHealth.network < 50 ? "Normal" : stats.systemHealth.network < 80 ? "Moderate" : "High"}
              </p>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground text-right">
            Last updated: {stats.systemHealth.lastUpdated}
          </div>
        </CardContent>
      </Card>

      {/* Event Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Statistics</CardTitle>
            <CardDescription>Overview of your events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Events</span>
                    <span className="text-sm font-medium">{stats.eventStats.total}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Upcoming</span>
                    <span className="text-sm font-medium">{stats.eventStats.upcoming}</span>
                  </div>
                  <Progress value={(stats.eventStats.upcoming / stats.eventStats.total) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completed</span>
                    <span className="text-sm font-medium">{stats.eventStats.completed}</span>
                  </div>
                  <Progress value={(stats.eventStats.completed / stats.eventStats.total) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cancelled</span>
                    <span className="text-sm font-medium">{stats.eventStats.cancelled}</span>
                  </div>
                  <Progress value={(stats.eventStats.cancelled / stats.eventStats.total) * 100} className="h-2" />
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/events">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    View All Events
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Active users over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <div className="flex h-full items-end gap-2">
                {stats.userActivity.map((day, i) => (
                  <div key={i} className="relative flex h-full w-full flex-col justify-end">
                    <div 
                      className="bg-primary rounded-md w-full animate-in" 
                      style={{ 
                        height: `${(day.activeUsers / 2000) * 100}%`,
                        transition: "height 0.3s ease"
                      }}
                    />
                    <span className="mt-2 text-center text-xs text-muted-foreground">{day.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Events */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Events</CardTitle>
          <CardDescription>Events with highest engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Registrations</TableHead>
                <TableHead className="text-right">Conversion Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.topPerformingEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="font-medium">{event.title}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Eye className="mr-1 h-3 w-3 text-muted-foreground" />
                      {formatNumber(event.views)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <UserPlus className="mr-1 h-3 w-3 text-muted-foreground" />
                      {event.registrations}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{event.conversionRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upcoming Events and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your next scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Registrations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.upcomingEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="font-medium">{event.title}</div>
                    </TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <UserPlus className="mr-1 h-3 w-3 text-muted-foreground" />
                        {event.registrations}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/events/create">
                  <Calendar className="mr-2 h-4 w-4" />
                  Create New Event
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="rounded-full bg-secondary p-1">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col py-4 justify-start items-center text-center" asChild>
              <Link href="/dashboard/events/create">
                <Calendar className="mb-2 h-6 w-6" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Create Event</p>
                  <p className="text-xs text-muted-foreground">Add a new event to your platform</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4 justify-start items-center text-center" asChild>
              <Link href="/dashboard/users">
                <Users className="mb-2 h-6 w-6" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Manage Users</p>
                  <p className="text-xs text-muted-foreground">View and edit user accounts</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4 justify-start items-center text-center" asChild>
              <Link href="/dashboard/analytics">
                <BarChart3 className="mb-2 h-6 w-6" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">View Analytics</p>
                  <p className="text-xs text-muted-foreground">Check your platform metrics</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4 justify-start items-center text-center" asChild>
              <Link href="/dashboard/settings">
                <AlertTriangle className="mb-2 h-6 w-6" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">View Errors</p>
                  <p className="text-xs text-muted-foreground">Check system error logs</p>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
