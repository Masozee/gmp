"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { Users, BookOpen, Calendar, UserCircle2, AlertTriangle } from "lucide-react"

interface DashboardData {
  overview: {
    totalUsers: number
    totalPublications: number
    totalEvents: number
    totalProfiles: number
    errorRate: number
  }
  publicationStats: Array<{
    status: string
    _count: number
  }>
  eventStats: Array<{
    status: string
    _count: number
  }>
  recentActivity: {
    publications: Array<any>
    events: Array<any>
    errorLogs: Array<any>
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard')
        if (!response.ok) throw new Error('Failed to fetch dashboard data')
        const jsonData = await response.json()
        setData(jsonData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Here's an overview of your system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data?.overview.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Active users in your system
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publications</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data?.overview.totalPublications}</div>
                <p className="text-xs text-muted-foreground">
                  Total publications
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data?.overview.totalEvents}</div>
                <p className="text-xs text-muted-foreground">
                  Total events
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data?.overview.errorRate}/day</div>
                <p className="text-xs text-muted-foreground">
                  Average errors per day (last 7 days)
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Publications by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.publicationStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="_count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.eventStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="_count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            ) : (
              <div className="space-y-4">
                {data?.recentActivity.publications.length === 0 && 
                 data?.recentActivity.events.length === 0 && 
                 data?.recentActivity.errorLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No recent activity to display.
                  </p>
                ) : (
                  <>
                    {data?.recentActivity.publications.map((pub: any) => (
                      <div key={pub.id} className="flex items-center space-x-4">
                        <BookOpen className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-medium">{pub.title}</p>
                          <p className="text-xs text-muted-foreground">
                            New publication • {format(new Date(pub.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    ))}
                    {data?.recentActivity.events.map((event: any) => (
                      <div key={event.id} className="flex items-center space-x-4">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.status} event • {format(new Date(event.startDate), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    ))}
                    {data?.recentActivity.errorLogs.map((log: any) => (
                      <div key={log.id} className="flex items-center space-x-4">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <div>
                          <p className="text-sm font-medium">{log.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.severity} • {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <a 
                href="/dashboard/publications/new" 
                className="flex items-center space-x-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                <span>Create new publication</span>
              </a>
              <a 
                href="/dashboard/events/new" 
                className="flex items-center space-x-2 text-sm text-primary hover:underline"
              >
                <Calendar className="h-4 w-4" />
                <span>Schedule new event</span>
              </a>
              <a 
                href="/dashboard/profiles/new" 
                className="flex items-center space-x-2 text-sm text-primary hover:underline"
              >
                <UserCircle2 className="h-4 w-4" />
                <span>Add new profile</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
