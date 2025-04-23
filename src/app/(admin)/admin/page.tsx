"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart, LineChart, PieChart, CalendarDays, Users, FileText, Globe } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button size="sm" asChild>
            <Link href="/admin/settings">Settings</Link>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Publications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 upcoming this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>
              Daily user activity over the past 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-md">
              <LineChart className="h-8 w-8 text-slate-400" />
              <span className="ml-2 text-muted-foreground">Chart placeholder</span>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Content Performance</CardTitle>
            <CardDescription>
              Most popular content categories
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-md">
              <PieChart className="h-8 w-8 text-slate-400" />
              <span className="ml-2 text-muted-foreground">Chart placeholder</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>User Demographics</CardTitle>
            <CardDescription>
              User distribution by region
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-md">
              <BarChart className="h-8 w-8 text-slate-400" />
              <span className="ml-2 text-muted-foreground">Chart placeholder</span>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform updates and changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-2 text-sm">
                <span className="rounded-full h-2 w-2 bg-blue-500 mt-1.5"></span>
                <div>
                  <p className="font-medium">New publication added</p>
                  <p className="text-muted-foreground">Political Education for Youth</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="rounded-full h-2 w-2 bg-green-500 mt-1.5"></span>
                <div>
                  <p className="font-medium">Event scheduled</p>
                  <p className="text-muted-foreground">Youth Leadership Workshop</p>
                  <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                </div>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="rounded-full h-2 w-2 bg-orange-500 mt-1.5"></span>
                <div>
                  <p className="font-medium">User milestone reached</p>
                  <p className="text-muted-foreground">1,000 registered users</p>
                  <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 