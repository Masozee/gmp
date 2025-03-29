"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, isToday, isTomorrow, isThisWeek, isSameDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

interface CalendarEvent {
  id: string
  title: string
  startDate: string
  endDate: string
  status: string
  categoryId: string
  location: string
}

export function DashboardRightSidebar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch events for the selected month
  useEffect(() => {
    const fetchEvents = async () => {
      if (!date) return

      setLoading(true)
      setError(null)

      try {
        const start = format(startOfMonth(date), "yyyy-MM-dd")
        const end = format(endOfMonth(date), "yyyy-MM-dd")
        
        const response = await fetch(`/api/calendar-events?startDate=${start}&endDate=${end}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }
        
        const data = await response.json()
        
        if (data.events && Array.isArray(data.events)) {
          setEvents(data.events)
        } else {
          setEvents([])
        }
      } catch (err) {
        console.error("Error fetching calendar events:", err)
        setError("Could not load events")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [date])

  // Filter events for today, tomorrow, and this week
  const todayEvents = events.filter(event => 
    isToday(new Date(event.startDate)) || 
    (isToday(new Date()) && new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date())
  )
  
  const tomorrowEvents = events.filter(event => 
    isTomorrow(new Date(event.startDate)) || 
    (isTomorrow(new Date()) && new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date())
  )
  
  const thisWeekEvents = events.filter(event => 
    isThisWeek(new Date(event.startDate)) && 
    !isToday(new Date(event.startDate)) && 
    !isTomorrow(new Date(event.startDate))
  )

  // Function to get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "ONGOING":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "COMPLETED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Function to check if a day has events
  const hasEvents = (day: Date) => {
    return events.some(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)
      return (
        isSameDay(day, eventStart) || 
        isSameDay(day, eventEnd) || 
        (day >= eventStart && day <= eventEnd)
      )
    })
  }

  // Function to render event list
  const renderEventList = (eventList: CalendarEvent[], title: string) => (
    <div className="space-y-2">
      <div className="text-sm font-medium">{title}</div>
      {eventList.length === 0 ? (
        <div className="text-sm text-muted-foreground">No events scheduled</div>
      ) : (
        <div className="space-y-2">
          {eventList.map(event => (
            <div key={event.id} className="block">
              <a 
                href={`/dashboard/events/${event.id}`}
                className="block p-2 rounded-md hover:bg-accent"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium truncate">{event.title}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getStatusColorClass(event.status)}`}>
                    {event.status.charAt(0) + event.status.slice(1).toLowerCase()}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {format(new Date(event.startDate), "MMM d, h:mm a")}
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="border-l h-full">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-4">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border w-full"
                  modifiers={{
                    hasEvent: (date) => hasEvents(date)
                  }}
                  modifiersStyles={{
                    hasEvent: {
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                      color: 'var(--primary)'
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading events...</div>
              ) : error ? (
                <div className="text-sm text-red-500">{error}</div>
              ) : (
                <>
                  {renderEventList(todayEvents, "Today")}
                  {renderEventList(tomorrowEvents, "Tomorrow")}
                  {renderEventList(thisWeekEvents, "This Week")}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
} 