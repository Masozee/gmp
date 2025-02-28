"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Clock, Globe, MapPin, Pencil, Users, Building, ExternalLink } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { type Event, type EventCategory } from "@/types/events"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [category, setCategory] = useState<EventCategory | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Access params directly since we're in a client component
  const id = params.id

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/events/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Event not found")
            router.push("/dashboard/events")
            return
          }
          throw new Error("Failed to fetch event")
        }
        const data = await response.json()
        setEvent(data)
        
        // Fetch category details
        if (data.categoryId) {
          const categoryResponse = await fetch(`/api/event-categories/${data.categoryId}`)
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json()
            setCategory(categoryData)
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error)
        toast.error("Failed to load event", {
          description: "Please try again later.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id, router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Upcoming
          </Badge>
        )
      case "ONGOING":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Ongoing
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            Completed
          </Badge>
        )
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Cancelled
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (date: string | Date) => {
    return format(new Date(date), "MMMM d, yyyy • h:mm a")
  }

  const renderLoading = () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40 mb-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Event Details</h1>
            <p className="text-muted-foreground">Loading event information...</p>
          </div>
        </div>
        
        {renderLoading()}
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-6">The event you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push("/dashboard/events")}>
          Return to Events
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/events")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
            <p className="text-muted-foreground">
              View and manage event details
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/dashboard/events/${id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - left side */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="content">Full Content</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6 space-y-6">
              {/* Event poster/image */}
              <Card>
                <CardContent className="p-0 overflow-hidden">
                  <div className="relative aspect-video w-full">
                    {event.posterUrl ? (
                      <>
                        <Image
                          src={event.posterUrl}
                          alt={event.title}
                          className="object-cover"
                          fill
                        />
                        {event.posterCredit && (
                          <div className="absolute right-2 bottom-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {event.posterCredit}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted">
                        <Calendar className="h-24 w-24 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Event description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{event.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Full Content</CardTitle>
                </CardHeader>
                <CardContent>
                  {event.content ? (
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-line">{event.content}</div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No detailed content available for this event.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - right side */}
        <div className="space-y-6">
          {/* Event status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Current status of the event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                {getStatusBadge(event.status)}
                {event.published ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Published
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    Draft
                  </Badge>
                )}
              </div>
              
              {category && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Category</h4>
                  <Badge variant="outline">
                    {category.name}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Date & Time</h4>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm">
                      {event.startDate && formatDate(event.startDate)}
                    </p>
                    <p className="text-sm text-muted-foreground">to</p>
                    <p className="text-sm">
                      {event.endDate && formatDate(event.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              {(event.location || event.venue) && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Location</h4>
                  {event.venue && (
                    <div className="flex items-start gap-2 mb-1">
                      <Building className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <p className="text-sm">{event.venue}</p>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <p className="text-sm">{event.location}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Speakers section */}
          {event.speakers && event.speakers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Speakers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.speakers
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((eventSpeaker) => (
                      <div key={eventSpeaker.id} className="flex items-start gap-3 p-3 border rounded-md">
                        {eventSpeaker.speaker?.photoUrl ? (
                          <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            <Image
                              src={eventSpeaker.speaker.photoUrl}
                              alt={`${eventSpeaker.speaker.firstName} ${eventSpeaker.speaker.lastName}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                            <Users className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">
                            {eventSpeaker.speaker?.firstName} {eventSpeaker.speaker?.lastName}
                          </p>
                          {eventSpeaker.speaker?.organization && (
                            <p className="text-sm text-muted-foreground">
                              {eventSpeaker.speaker.organization}
                            </p>
                          )}
                          {eventSpeaker.role && (
                            <p className="text-sm mt-1">
                              <span className="font-medium">Role:</span> {eventSpeaker.role}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 