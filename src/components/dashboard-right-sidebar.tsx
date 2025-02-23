"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function DashboardRightSidebar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

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
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Today</div>
                <div className="text-sm text-muted-foreground">No events scheduled</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Tomorrow</div>
                <div className="text-sm text-muted-foreground">No events scheduled</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">This Week</div>
                <div className="text-sm text-muted-foreground">No events scheduled</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
} 