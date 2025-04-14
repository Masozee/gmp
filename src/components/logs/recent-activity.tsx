"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ActivityLog {
  id: string
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL"
  message: string
  createdAt: string
  user?: {
    email: string
  } | null
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/logs?limit=20")
        if (!response.ok) throw new Error("Failed to fetch activities")
        const data = await response.json()
        setActivities(data)
      } catch (error) {
        console.error("[Recent Activity] Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const getSeverityIcon = (severity: ActivityLog["severity"]) => {
    switch (severity) {
      case "CRITICAL":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "ERROR":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "WARNING":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "INFO":
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="text-center text-muted-foreground">
              Loading activities...
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No recent activities
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-lg border p-4"
                >
                  <div className="mt-1">
                    {getSeverityIcon(activity.severity)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.message}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <p className="text-xs text-muted-foreground">
                        {activity.user?.email || "System"}
                      </p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 