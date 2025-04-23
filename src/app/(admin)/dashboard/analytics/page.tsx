"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  PieChart,
  Calendar,
  ArrowUp,
  ArrowDown,
  Users,
  MousePointerClick,
  Clock,
  ArrowUpRight,
  BarChart3,
  Globe,
  Laptop,
  Smartphone,
  Tablet,
  Share2,
  Eye,
  UserPlus,
  Loader2
} from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from "recharts";


import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Define types for our analytics data
interface DailyData {
  date: string
  visitors: number
  pageViews: number
  bounceRate: number
  avgSessionDuration: number
  newUsers: number
}

interface TrafficSource {
  source: string
  visitors: number
  percentage: number
}

interface DeviceCategory {
  device: string
  visitors: number
  percentage: number
}

interface TopPage {
  path: string
  title: string
  pageViews: number
  avgTimeOnPage: number
}

interface EventEngagement {
  id: string
  title: string
  status: string
  views: number
  registrations: number
  conversionRate: number
  shareCount: number
}

interface MonthlyComparison {
  current: {
    month: string
    visitors: number
    pageViews: number
    avgSessionDuration: number
    bounceRate: number
  }
  previous: {
    month: string
    visitors: number
    pageViews: number
    avgSessionDuration: number
    bounceRate: number
  }
}

interface GeographicData {
  country: string
  visitors: number
  percentage: number
}

interface AnalyticsData {
  summary: {
    totalVisitors: number
    totalPageViews: number
    avgBounceRate: number
    avgSessionDuration: number
    totalNewUsers: number
  }
  dailyData: DailyData[]
  trafficSources: TrafficSource[]
  deviceCategories: DeviceCategory[]
  topPages: TopPage[]
  eventEngagement: EventEngagement[]
  monthlyComparison: MonthlyComparison
  geographicData: GeographicData[]
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsPageSkeleton />}>
      <AnalyticsPageContent />
    </Suspense>
  )
}

function AnalyticsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [period, setPeriod] = useState<string>(searchParams?.get("range") || "month")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/analytics?period=${period}`)
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data")
        }
        const data = await response.json()
        setAnalyticsData(data)
      } catch (err) {
        // Fallback to dummy/mock data for preview
        setAnalyticsData({
          summary: {
            totalVisitors: 12345,
            totalPageViews: 45678,
            avgBounceRate: 47,
            avgSessionDuration: 312,
            totalNewUsers: 2345
          },
          dailyData: Array.from({ length: 30 }, (_, i) => ({
            date: `2025-04-${(i+1).toString().padStart(2, '0')}`,
            visitors: Math.floor(800 + Math.random() * 1200),
            pageViews: Math.floor(1800 + Math.random() * 2200),
            bounceRate: Math.floor(40 + Math.random() * 20),
            avgSessionDuration: Math.floor(200 + Math.random() * 200),
            newUsers: Math.floor(40 + Math.random() * 60)
          })),
          trafficSources: [
            { source: 'Organic Search', visitors: 7000, percentage: 56 },
            { source: 'Direct', visitors: 3000, percentage: 24 },
            { source: 'Referral', visitors: 1800, percentage: 14 },
            { source: 'Social', visitors: 1200, percentage: 6 }
          ],
          deviceCategories: [
            { device: 'Desktop', visitors: 7000, percentage: 58 },
            { device: 'Mobile', visitors: 4200, percentage: 35 },
            { device: 'Tablet', visitors: 800, percentage: 7 }
          ],
          topPages: [
            { path: '/home', title: 'Home', pageViews: 12000, avgTimeOnPage: 220 },
            { path: '/events', title: 'Events', pageViews: 9000, avgTimeOnPage: 180 },
            { path: '/about', title: 'About', pageViews: 7000, avgTimeOnPage: 140 }
          ],
          eventEngagement: [
            { id: '1', title: 'Spring Festival', status: 'COMPLETED', views: 3000, registrations: 600, conversionRate: 20, shareCount: 150 },
            { id: '2', title: 'Tech Talk', status: 'ONGOING', views: 2200, registrations: 500, conversionRate: 23, shareCount: 120 },
            { id: '3', title: 'Workshop', status: 'UPCOMING', views: 1800, registrations: 350, conversionRate: 19, shareCount: 90 }
          ],
          monthlyComparison: {
            current: {
              month: 'April',
              visitors: 12345,
              pageViews: 45678,
              avgSessionDuration: 312,
              bounceRate: 47
            },
            previous: {
              month: 'March',
              visitors: 11000,
              pageViews: 41000,
              avgSessionDuration: 295,
              bounceRate: 49
            }
          },
          geographicData: [
            { country: 'United States', visitors: 6000, percentage: 48 },
            { country: 'Indonesia', visitors: 2500, percentage: 20 },
            { country: 'India', visitors: 2000, percentage: 16 },
            { country: 'United Kingdom', visitors: 1200, percentage: 10 },
            { country: 'Australia', visitors: 800, percentage: 6 }
          ]
        });
        setError(null);
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [period])

  const handlePeriodChange = (value: string) => {
    setPeriod(value)
    
    // Update URL with period parameter
    const params = new URLSearchParams(searchParams.toString())
    params.set("period", value)
    router.push(`/dashboard/analytics?${params.toString()}`)
  }

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

  // Helper function to format time in seconds to mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Helper function to calculate percentage change
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 100
    return Math.round(((current - previous) / previous) * 100)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <Skeleton className="h-10 w-32" />
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
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Always render dashboard if analyticsData is available, even if error is set
  if (!analyticsData) {
    if (loading) return null;
    // If not loading and no data, show error
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-center text-muted-foreground">
              {error || "No analytics data available."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Optionally show an error banner if error exists, but still render dashboard
  // (You can style this as you wish)
  const showErrorBanner = error && analyticsData;

  const { 
    summary, 
    dailyData, 
    trafficSources, 
    deviceCategories, 
    topPages, 
    eventEngagement, 
    monthlyComparison, 
    geographicData 
  } = analyticsData

  // Calculate month-over-month changes
  const visitorChange = calculateChange(
    monthlyComparison.current.visitors,
    monthlyComparison.previous.visitors
  )
  
  const pageViewChange = calculateChange(
    monthlyComparison.current.pageViews,
    monthlyComparison.previous.pageViews
  )
  
  const sessionDurationChange = calculateChange(
    monthlyComparison.current.avgSessionDuration,
    monthlyComparison.previous.avgSessionDuration
  )
  
  const bounceRateChange = calculateChange(
    monthlyComparison.previous.bounceRate,
    monthlyComparison.current.bounceRate
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Website traffic and engagement metrics
          </p>
        </div>
        <Tabs defaultValue={period} onValueChange={handlePeriodChange}>
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="14d">14 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary.totalVisitors)}</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              {visitorChange > 0 ? (
                <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={visitorChange > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(visitorChange)}%
              </span>
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary.totalPageViews)}</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              {pageViewChange > 0 ? (
                <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={pageViewChange > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(pageViewChange)}%
              </span>
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(summary.avgSessionDuration)}</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              {sessionDurationChange > 0 ? (
                <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={sessionDurationChange > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(sessionDurationChange)}%
              </span>
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgBounceRate}%</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              {bounceRateChange > 0 ? (
                <ArrowDown className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowUp className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={bounceRateChange > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(bounceRateChange)}%
              </span>
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Overview */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Daily visitors and page views</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={dailyData.slice(-30)} margin={{ top: 16, right: 32, left: 0, bottom: 8 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
      <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={8} />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip contentStyle={{ background: 'var(--card)', borderRadius: 8, fontSize: 14 }} />
      <Legend verticalAlign="top" height={36} iconType="circle"/>
      <Line type="monotone" dataKey="visitors" stroke="#3cb1dc" strokeWidth={2} dot={{ r: 3 }} name="Visitors" />
      <Line type="monotone" dataKey="pageViews" stroke="#e5b546" strokeWidth={2} dot={{ r: 3 }} name="Page Views" />
    </LineChart>
  </ResponsiveContainer>
</div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{source.source}</p>
                    <p className="text-sm text-muted-foreground">{formatNumber(source.visitors)} visitors</p>
                  </div>
                  <p className="text-sm font-medium">{source.percentage}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Categories and Geographic Data */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Device Categories</CardTitle>
            <CardDescription>Visitors by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceCategories.map((device, index) => (
                <div key={index} className="flex items-center">
                  <div className="mr-4">
                    {device.device === "Desktop" ? (
                      <Laptop className="h-8 w-8 text-muted-foreground" />
                    ) : device.device === "Mobile" ? (
                      <Smartphone className="h-8 w-8 text-muted-foreground" />
                    ) : (
                      <Tablet className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{device.device}</p>
                      <p className="text-sm font-medium">{device.percentage}%</p>
                    </div>
                    <Progress value={device.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">{formatNumber(device.visitors)} visitors</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Top 5 countries by visitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geographicData.slice(0, 5).map((geo, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{geo.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatNumber(geo.visitors)}</p>
                    <p className="text-xs text-muted-foreground">{geo.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
          <CardDescription>Most viewed pages on your website</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead className="text-right">Page Views</TableHead>
                <TableHead className="text-right">Avg. Time on Page</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPages.map((page, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{page.title}</div>
                    <div className="text-sm text-muted-foreground">{page.path}</div>
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(page.pageViews)}</TableCell>
                  <TableCell className="text-right">{formatTime(page.avgTimeOnPage)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Event Engagement */}
      <Card>
        <CardHeader>
          <CardTitle>Event Engagement</CardTitle>
          <CardDescription>Performance metrics for your events</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Registrations</TableHead>
                <TableHead className="text-right">Conversion Rate</TableHead>
                <TableHead className="text-right">Shares</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventEngagement.map((event, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{event.title}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      event.status === "UPCOMING" ? "default" :
                      event.status === "ONGOING" ? "secondary" :
                      event.status === "COMPLETED" ? "outline" : "destructive"
                    }>
                      {event.status.charAt(0) + event.status.slice(1).toLowerCase()}
                    </Badge>
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
                      {formatNumber(event.registrations)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{event.conversionRate}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Share2 className="mr-1 h-3 w-3 text-muted-foreground" />
                      {event.shareCount}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Skeleton className="h-10 w-32" />
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
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  )
} 