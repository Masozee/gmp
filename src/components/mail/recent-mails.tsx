"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Mail {
  id: string
  mailNumber: string
  subject: string
  date: string
  type: "INCOMING" | "OUTGOING"
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
}

export function RecentMails() {
  const [mails, setMails] = useState<Mail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentMails = async () => {
      try {
        setLoading(true)
        // This would normally fetch from an API endpoint
        // For now, we'll use mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock data
        const mockData: Mail[] = [
          {
            id: "1",
            mailNumber: "0089/SK/III/2025",
            subject: "Official Statement - Department of Finance",
            date: "2025-03-15",
            type: "OUTGOING",
            status: "PUBLISHED"
          },
          {
            id: "2",
            mailNumber: "0088/UM/III/2025",
            subject: "Invitation to Annual Meeting",
            date: "2025-03-14",
            type: "OUTGOING",
            status: "PUBLISHED"
          },
          {
            id: "3",
            mailNumber: "REF-2025/032",
            subject: "Budget Approval Request",
            date: "2025-03-12",
            type: "INCOMING",
            status: "DRAFT"
          },
          {
            id: "4",
            mailNumber: "0087/SP/III/2025",
            subject: "Notification of Policy Changes",
            date: "2025-03-10",
            type: "OUTGOING",
            status: "PUBLISHED"
          },
          {
            id: "5",
            mailNumber: "REF-2025/031",
            subject: "Vendor Contract Renewal",
            date: "2025-03-08",
            type: "INCOMING",
            status: "ARCHIVED"
          }
        ]
        
        setMails(mockData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecentMails()
  }, [])

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant="outline" className={type === "INCOMING" ? "text-green-500 border-green-500" : "text-blue-500 border-blue-500"}>
        {type === "INCOMING" ? "Incoming" : "Outgoing"}
      </Badge>
    )
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading recent mails...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>
  }

  if (mails.length === 0) {
    return <div className="text-muted-foreground p-4">No recent mail records found</div>
  }

  return (
    <div className="space-y-4">
      {mails.map((mail) => (
        <div key={mail.id} className="flex items-center justify-between border-b pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link 
                href={`/dashboard/mail/${mail.id}`}
                className="text-sm font-medium hover:underline"
              >
                {mail.mailNumber}
              </Link>
              {getTypeBadge(mail.type)}
            </div>
            <p className="text-sm text-muted-foreground">
              {mail.subject}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(mail.date).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
} 