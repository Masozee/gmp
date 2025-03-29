"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MailStatsData {
  totalMail: number
  incomingMail: number
  outgoingMail: number
  totalCategories: number
  mailByCategory: {
    name: string
    count: number
  }[]
  mailByMonth: {
    name: string
    incoming: number
    outgoing: number
  }[]
}

export function MailStats() {
  const [stats, setStats] = useState<MailStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        // This would normally fetch from an API endpoint
        // For now, we'll use mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock data
        const mockData: MailStatsData = {
          totalMail: 254,
          incomingMail: 145,
          outgoingMail: 109,
          totalCategories: 8,
          mailByCategory: [
            { name: "SK - Surat Keterangan", count: 78 },
            { name: "UM - Undangan Meeting", count: 65 },
            { name: "SP - Surat Pemberitahuan", count: 42 },
            { name: "LN - Lain-lain", count: 69 }
          ],
          mailByMonth: [
            { name: "Jan", incoming: 10, outgoing: 8 },
            { name: "Feb", incoming: 15, outgoing: 12 },
            { name: "Mar", incoming: 20, outgoing: 18 },
            { name: "Apr", incoming: 25, outgoing: 15 },
            { name: "May", incoming: 18, outgoing: 14 },
            { name: "Jun", incoming: 22, outgoing: 16 }
          ]
        }
        
        setStats(mockData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  if (loading) {
    return <div className="flex justify-center p-4">Loading statistics...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>
  }

  if (!stats) {
    return <div className="text-muted-foreground p-4">No statistics available</div>
  }

  // Find the maximum value for scaling the bars
  const maxMonthlyValue = Math.max(
    ...stats.mailByMonth.map(item => Math.max(item.incoming, item.outgoing))
  )

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Mail Volume by Month</CardTitle>
          <CardDescription>
            Incoming vs outgoing mail over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-4 text-sm">
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded-full bg-green-500"></div>
                <span>Incoming</span>
              </div>
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded-full bg-blue-500"></div>
                <span>Outgoing</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {stats.mailByMonth.map((month, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{month.name}</span>
                    <span className="text-muted-foreground">
                      In: {month.incoming} | Out: {month.outgoing}
                    </span>
                  </div>
                  <div className="flex h-2 gap-1 w-full">
                    <div 
                      className="bg-green-500 rounded-full" 
                      style={{ 
                        width: `${(month.incoming / maxMonthlyValue) * 100}%` 
                      }}
                    />
                    <div 
                      className="bg-blue-500 rounded-full" 
                      style={{ 
                        width: `${(month.outgoing / maxMonthlyValue) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Mail by Category</CardTitle>
          <CardDescription>
            Distribution of mail by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.mailByCategory.map((category, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-sm font-medium">{category.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ 
                      width: `${(category.count / stats.totalMail) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 