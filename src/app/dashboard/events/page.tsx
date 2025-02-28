"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Eye, Flag, MapPin, PlusCircle, Trash, CalendarClock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

import { type Event } from "@/types/events"

export default function EventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setHasError(false)
        
        // Add timeout to avoid infinite loading if the request never resolves
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
        
        const response = await fetch("/api/events", {
          signal: controller.signal,
          // Add cache control to prevent stale data
          cache: "no-cache",
          // Add credentials to include cookies
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          }
        }).catch(error => {
          clearTimeout(timeoutId)
          throw new Error(`Network error: ${error.message}`)
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error")
          throw new Error(`Server error (${response.status}): ${errorText}`)
        }
        
        // Safe parsing with error handling
        let data: Event[] = []
        try {
          const jsonData = await response.json()
          // Handle both array and paginated response formats
          const eventsArray = Array.isArray(jsonData) ? jsonData : 
                            jsonData.events && Array.isArray(jsonData.events) ? jsonData.events : 
                            []
          
          data = eventsArray.map((event: {
            id?: string;
            title?: string;
            description?: string;
            status?: string;
            slug?: string;
            categoryId?: string;
            startDate?: string;
            endDate?: string;
            published?: boolean;
            createdAt?: string;
            updatedAt?: string;
            posterUrl?: string;
            location?: string;
            venue?: string;
            content?: string;
            posterCredit?: string;
            category?: any;
            speakers?: any[];
            tags?: any[];
          }) => ({
            id: event.id || "",
            title: event.title || "Untitled Event",
            description: event.description || "",
            status: event.status || "UPCOMING",
            // Ensure other required fields have fallbacks
            slug: event.slug || "",
            categoryId: event.categoryId || "",
            startDate: event.startDate || new Date().toISOString(),
            endDate: event.endDate || new Date().toISOString(),
            published: Boolean(event.published),
            createdAt: event.createdAt || new Date().toISOString(),
            updatedAt: event.updatedAt || new Date().toISOString(),
            // Optional fields
            posterUrl: event.posterUrl || undefined,
            location: event.location || undefined,
            venue: event.venue || undefined,
            content: event.content || undefined,
            posterCredit: event.posterCredit || undefined,
            // Include category and other relations if they exist
            category: event.category,
            speakers: event.speakers,
            tags: event.tags
          }))
        } catch (parseError) {
          console.error("Error parsing response:", parseError)
          throw new Error("Failed to parse server response")
        }
        
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
        setHasError(true)
        toast.error("Failed to load events", {
          description: error instanceof Error 
            ? error.message 
            : "Please try again later.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const filteredEvents = () => {
    if (!events || events.length === 0) {
      return []
    }
    
    switch (activeTab) {
      case "upcoming":
        return events.filter((event) => event.status === "UPCOMING")
      case "ongoing":
        return events.filter((event) => event.status === "ONGOING")
      case "completed":
        return events.filter((event) => event.status === "COMPLETED")
      case "cancelled":
        return events.filter((event) => event.status === "CANCELLED")
      default:
        return events
    }
  }

  const deleteEvent = async () => {
    if (!eventToDelete) return

    try {
      const response = await fetch(`/api/events/${eventToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(error.error || `Failed to delete event (status: ${response.status})`)
      }

      setEvents((prev) => prev.filter((event) => event.id !== eventToDelete))
      toast.success("Event deleted successfully")
      setEventToDelete(null)
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete event")
    }
  }

  const getStatusColor = (status: string) => {
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

  // Extract retry button component for reuse
  const RetryButton = () => (
    <Button 
      onClick={() => {
        setLoading(true)
        setHasError(false)
        // Force a re-render to trigger the useEffect
        setEvents([])
        // Set timeout to give time for state update
        setTimeout(() => window.location.reload(), 100)
      }}
      variant="outline"
      className="mt-4"
    >
      Retry
    </Button>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Create and manage events for your organization
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Event
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-muted">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : hasError ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <CalendarClock className="h-16 w-16 text-destructive mb-4" />
              <h3 className="text-2xl font-semibold">Failed to load events</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                There was an error loading the events. Please try again later.
              </p>
              <RetryButton />
            </div>
          ) : filteredEvents().length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <CalendarClock className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold">No events found</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                {activeTab === "all"
                  ? "You haven't created any events yet."
                  : `You don't have any ${activeTab.toLowerCase()} events.`}
              </p>
              <Button onClick={() => router.push("/dashboard/events/new")}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents().map((event) => (
                <Card key={event.id} className="overflow-hidden flex flex-col">
                  <div className="relative h-48 bg-muted">
                    {event.posterUrl ? (
                      <Image
                        src={event.posterUrl}
                        alt={event.title || "Event image"}
                        className="object-cover"
                        fill
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-secondary/50">
                        <CalendarClock className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="secondary"
                        className={`${getStatusColor(event.status)}`}
                      >
                        {event.status ? event.status.charAt(0) + event.status.slice(1).toLowerCase() : "Unknown"}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="19" cy="12" r="1" />
                              <circle cx="5" cy="12" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/events/${event.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/events/${event.id}/edit`)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2 h-4 w-4"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setEventToDelete(event.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>
                      {event.startDate && (
                        <div className="flex items-center gap-1 mt-2 text-sm">
                          <CalendarClock className="h-3.5 w-3.5" />
                          <span>
                            {format(new Date(event.startDate), "MMM d, yyyy")}
                          </span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1 mt-1 text-sm">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {event.description || "No description available"}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/dashboard/events/${event.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Other tabs share the same content */}
        <TabsContent value="upcoming" className="mt-6">
          {/* Content is handled by the filteredEvents function */}
        </TabsContent>
        <TabsContent value="ongoing" className="mt-6">
          {/* Content is handled by the filteredEvents function */}
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          {/* Content is handled by the filteredEvents function */}
        </TabsContent>
        <TabsContent value="cancelled" className="mt-6">
          {/* Content is handled by the filteredEvents function */}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={deleteEvent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 