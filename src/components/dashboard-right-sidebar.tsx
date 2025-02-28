"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, isSameDay } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { DayContentProps } from "react-day-picker"

interface Event {
  id: string
  title: string
  startDate: string | Date
  endDate: string | Date
  status: string
}

export function DashboardRightSidebar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events", {
          credentials: "include",
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch events")
        }
        
        const data = await response.json()
        setEvents(data.events || [])
      } catch (error) {
        console.error("Error fetching events:", error)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const getEventsForDate = (date: Date | undefined) => {
    if (!date || !Array.isArray(events)) return []
    return events.filter(event => {
      try {
        const eventDate = new Date(event.startDate)
        return isSameDay(eventDate, date)
      } catch (error) {
        return false
      }
    })
  }

  const getDaysWithEvents = () => {
    if (!Array.isArray(events)) return []
    return events.map(event => {
      try {
        return new Date(event.startDate)
      } catch (error) {
        return null
      }
    }).filter((date): date is Date => date !== null)
  }

  const getUpcomingEvents = () => {
    if (!Array.isArray(events)) {
      return {
        todayEvents: [],
        tomorrowEvents: [],
        thisWeekEvents: []
      }
    }

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const todayEvents = events.filter(event => {
      try {
        const eventDate = new Date(event.startDate)
        return isSameDay(eventDate, today)
      } catch (error) {
        return false
      }
    })

    const tomorrowEvents = events.filter(event => {
      try {
        const eventDate = new Date(event.startDate)
        return isSameDay(eventDate, tomorrow)
      } catch (error) {
        return false
      }
    })

    const thisWeekEvents = events.filter(event => {
      try {
        const eventDate = new Date(event.startDate)
        return eventDate > tomorrow && eventDate <= nextWeek
      } catch (error) {
        return false
      }
    })

    return { todayEvents, tomorrowEvents, thisWeekEvents }
  }

  const { todayEvents, tomorrowEvents, thisWeekEvents } = getUpcomingEvents()

  const eventDates = getDaysWithEvents()

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              components={{
                DayContent: (props: DayContentProps) => {
                  const hasEvents = eventDates.some(eventDate => 
                    isSameDay(eventDate, props.date)
                  )
                  const events = getEventsForDate(props.date)
                  const isSelected = date ? isSameDay(date, props.date) : false

                  return (
                    <div
                      className={cn(
                        "relative group h-8 w-8 p-0 flex items-center justify-center rounded-md transition-colors",
                        hasEvents && !isSelected && "bg-primary/10 font-medium text-primary",
                        isSelected && "bg-primary text-primary-foreground font-medium",
                        !hasEvents && !isSelected && "hover:bg-muted"
                      )}
                    >
                      <div>{props.date.getDate()}</div>
                      {hasEvents && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-max z-50">
                          <div className="bg-popover text-popover-foreground text-xs rounded px-1 py-0.5 hidden group-hover:block shadow-sm">
                            {events.length} event{events.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }
              }}
            />
            {!loading && date && getEventsForDate(date).length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="text-sm font-medium">Events on {format(date, "MMMM d, yyyy")}</div>
                {getEventsForDate(date).map(event => (
                  <div key={event.id} className="flex items-center space-x-2">
                    <Badge variant="outline">{format(new Date(event.startDate), "HH:mm")}</Badge>
                    <span className="text-sm">{event.title}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="text-sm font-medium">Today</div>
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : todayEvents.length > 0 ? (
                todayEvents.map(event => (
                  <div key={event.id} className="flex items-center space-x-2">
                    <Badge variant="outline">{format(new Date(event.startDate), "HH:mm")}</Badge>
                    <span className="text-sm">{event.title}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No events scheduled</div>
              )}
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium">Tomorrow</div>
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : tomorrowEvents.length > 0 ? (
                tomorrowEvents.map(event => (
                  <div key={event.id} className="flex items-center space-x-2">
                    <Badge variant="outline">{format(new Date(event.startDate), "HH:mm")}</Badge>
                    <span className="text-sm">{event.title}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No events scheduled</div>
              )}
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium">This Week</div>
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : thisWeekEvents.length > 0 ? (
                thisWeekEvents.map(event => (
                  <div key={event.id} className="flex items-center space-x-2">
                    <Badge variant="outline">{format(new Date(event.startDate), "HH:mm")}</Badge>
                    <span className="text-sm">{event.title}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No events scheduled</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
} 