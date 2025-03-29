"use client"

import { useEffect, useState } from "react"
import { Calendar } from "lucide-react"

export function DateDisplay() {
  const [dateTime, setDateTime] = useState<Date>(new Date())

  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setDateTime(new Date())
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date)
  }

  return (
    <div className="flex items-center gap-1.5">
      <Calendar className="h-4 w-4" />
      <div className="flex flex-col">
        <span className="text-xs font-medium">{formatDate(dateTime)}</span>
        <span className="text-xs text-muted-foreground">{formatTime(dateTime)}</span>
      </div>
    </div>
  )
} 