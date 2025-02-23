"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorLog {
  id: string
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL"
  path: string
  method: string
  message: string
  createdAt: string
  user?: {
    email: string
  }
}

export function ErrorLogsTable() {
  const [logs, setLogs] = useState<ErrorLog[]>([])
  const [severity, setSeverity] = useState<string>("ERROR")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLogs()
  }, [severity])

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/logs?severity=${severity}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch logs")
      }

      setLogs(data)
    } catch (error) {
      console.error("Error fetching logs:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch logs")
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityBadge = (severity: ErrorLog["severity"]) => {
    const variants = {
      INFO: "secondary",
      WARNING: "secondary",
      ERROR: "destructive",
      CRITICAL: "destructive",
    } as const

    return (
      <Badge variant={variants[severity]}>
        {severity}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <Select
            value={severity}
            onValueChange={setSeverity}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INFO">Info</SelectItem>
              <SelectItem value="WARNING">Warning</SelectItem>
              <SelectItem value="ERROR">Error</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getSeverityBadge(log.severity)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {log.method} {log.path}
                    </TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>{log.user?.email || "N/A"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 