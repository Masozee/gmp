"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar as CalendarIcon, MapPin, Clock, Plus, Edit, Trash2, User, List, ArrowUpDown } from "lucide-react"
import { format, parseISO } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Event {
  id: string
  title: string
  description: string
  location: string
  startDate: string
  endDate: string
  status: string
  posterImage?: string
  category: {
    id: string
    name: string
  }
  tags: {
    tag: {
      id: string
      name: string
    }
  }[]
  speakers: {
    speaker: {
      id: string
      firstName: string
      lastName: string
    }
  }[]
}

interface Category {
  id: string
  name: string
}

function EventsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get("status") || "ALL")
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("categoryId") || "ALL")
  const [sortOrder, setSortOrder] = useState<string>(searchParams.get("sort") || "newest")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        
        let url = `/api/events?page=${page}`
        if (selectedStatus && selectedStatus !== "ALL") url += `&status=${selectedStatus}`
        if (selectedCategory && selectedCategory !== "ALL") url += `&categoryId=${selectedCategory}`
        if (sortOrder) url += `&sort=${sortOrder}`
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }
        
        const data = await response.json()
        
        // Handle new API response structure: { success, data: { events, pagination }, ... }
        if (!data.data || !data.data.events) {
          // If the API returns just an array of events without pagination
          if (Array.isArray(data)) {
            setEvents(data)
            setTotalPages(1)
            setLoading(false)
            return
          }
          throw new Error("Invalid response format from API")
        }
        setEvents(data.data.events)
        setTotalPages(data.data.pagination?.totalPages || 1)
        setLoading(false)
      } catch (err) {
        setError("Could not load events")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/event-categories")
        
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        
        const data = await response.json()
        
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories)
        } else if (Array.isArray(data)) {
          setCategories(data)
        } else {
          console.error("Unexpected categories response format:", data)
          setCategories([])
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
        setCategories([])
      }
    }

    fetchEvents()
    fetchCategories()
  }, [page, selectedStatus, selectedCategory, sortOrder])

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    setPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortOrder(value)
    setPage(1)
    
    // Update URL with sort parameter
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    if (selectedStatus !== "ALL") params.set("status", selectedStatus)
    if (selectedCategory !== "ALL") params.set("categoryId", selectedCategory)
    router.push(`/dashboard/events?${params.toString()}`)
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete event")
      }
      
      // Refresh the events list
      setEvents(events.filter(event => event.id !== id))
    } catch (err) {
      console.error("Error deleting event:", err)
    }
  }

  const getStatusBadgeColor = (status: string) => {
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

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Events</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Events</h1>
          <Button asChild>
            <Link href="/dashboard/events/new">
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-center text-muted-foreground">
              {error}. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button asChild>
          <Link href="/dashboard/events/new">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-1/4">
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="UPCOMING">Upcoming</SelectItem>
              <SelectItem value="ONGOING">Ongoing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-1/4">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-1/4">
          <Select value={sortOrder} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title_asc">Title (A-Z)</SelectItem>
              <SelectItem value="title_desc">Title (Z-A)</SelectItem>
              <SelectItem value="upcoming">Upcoming First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-center text-muted-foreground mb-4">
              No events found. Create your first event to get started.
            </p>
            <Button asChild>
              <Link href="/dashboard/events/new">
                <Plus className="mr-2 h-4 w-4" />
                New Event
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                {event.posterImage ? (
                  <img
                    src={event.posterImage}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <CalendarIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <Badge
                  className={`absolute right-2 top-2 ${getStatusBadgeColor(event.status)}`}
                >
                  {event.status.charAt(0) + event.status.slice(1).toLowerCase()}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{event.category?.name || 'Uncategorized'}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-muted-foreground mb-4">
                  {event.description}
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(event.startDate), "MMM d, yyyy")} - {format(new Date(event.endDate), "MMM d, yyyy")}
                    </span>
                  </div>
                  {Array.isArray(event.speakers) && event.speakers.length > 0 && (
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <User className="mr-1 h-4 w-4" />
                      <span>
                        {event.speakers[0].speaker.firstName} {event.speakers[0].speaker.lastName}
                        {event.speakers.length > 1 && ` +${event.speakers.length - 1} more`}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
// ...
              <CardFooter className="flex justify-between p-4">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/events/${event.id}`}>
                    View Details
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/events/${event.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Event</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this event? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Wrapper component with Suspense
export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Events</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    }>
      <EventsPageContent />
    </Suspense>
  )
} 