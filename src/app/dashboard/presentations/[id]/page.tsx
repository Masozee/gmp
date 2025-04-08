"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, CalendarIcon, ClockIcon, EditIcon, FileTextIcon, TrashIcon, UserIcon, VideoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

type Presentation = {
  id: string
  title: string
  abstract?: string
  startTime?: string
  endTime?: string
  duration?: number
  videoUrl?: string
  slides?: string
  speakerId: string
  eventId?: string
  createdAt: string
  updatedAt: string
  speaker?: {
    id: string
    firstName: string
    lastName: string
    photoUrl?: string
  }
  event?: {
    id: string
    title: string
    startDate: string
    endDate: string
  }
}

export default function PresentationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params object using React.use()
  const resolvedParams = React.use(params);
  const presentationId = resolvedParams.id;
  
  const router = useRouter()
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchPresentation = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/presentations/${presentationId}`)
        
        if (response.status === 404) {
          setError("Presentation not found")
          return
        }
        
        if (!response.ok) {
          throw new Error(`Error fetching presentation: ${response.statusText}`)
        }
        
        const data = await response.json()
        setPresentation(data)
      } catch (err) {
        console.error("Failed to fetch presentation", err)
        setError("Failed to load presentation details. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchPresentation()
  }, [presentationId])
  
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/presentations/${presentationId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete presentation")
      }
      
      toast.success("Presentation deleted", {
        description: "The presentation has been successfully deleted."
      })
      
      router.push("/dashboard/presentations")
    } catch (error) {
      console.error("Error deleting presentation:", error)
      toast.error("Failed to delete presentation. Please try again.")
    } finally {
      setIsDeleting(false)
      setDeleteAlertOpen(false)
    }
  }
  
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleString()
  }
  
  const formatDuration = (minutes?: number) => {
    if (!minutes) return "Not specified"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Separator />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !presentation) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">{error || "Presentation not found"}</h3>
          <p className="text-muted-foreground mb-4">
            The requested presentation could not be found or loaded.
          </p>
          <Button 
            variant="outline" 
            onClick={() => router.push("/dashboard/presentations")}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Presentations
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{presentation.title}</h1>
          <p className="text-muted-foreground">
            Presentation Details
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/presentations")}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/presentations/${presentationId}/edit`)}
          >
            <EditIcon className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteAlertOpen(true)}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Presentation Information</CardTitle>
            <CardDescription>
              Details about this presentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {presentation.abstract && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Abstract</h3>
                <p className="text-sm whitespace-pre-line">{presentation.abstract}</p>
              </div>
            )}
            
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <p className="text-sm">
                <span className="font-medium">Start Time:</span> {formatDateTime(presentation.startTime)}
              </p>
            </div>
            
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <p className="text-sm">
                <span className="font-medium">End Time:</span> {formatDateTime(presentation.endTime)}
              </p>
            </div>
            
            <div className="flex items-center">
              <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <p className="text-sm">
                <span className="font-medium">Duration:</span> {formatDuration(presentation.duration)}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {presentation.slides && (
                <Badge variant="secondary">Has Slides</Badge>
              )}
              {presentation.videoUrl && (
                <Badge variant="secondary">Has Video</Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-start gap-2 border-t p-4">
            {presentation.slides && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(presentation.slides, '_blank')}
              >
                <FileTextIcon className="mr-2 h-4 w-4" />
                View Slides
              </Button>
            )}
            {presentation.videoUrl && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(presentation.videoUrl, '_blank')}
              >
                <VideoIcon className="mr-2 h-4 w-4" />
                Watch Video
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Speaker</CardTitle>
              <CardDescription>
                The presenter of this content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {presentation.speaker ? (
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={presentation.speaker.photoUrl || ""} alt={`${presentation.speaker.firstName} ${presentation.speaker.lastName}`} />
                    <AvatarFallback>
                      {presentation.speaker.firstName[0]}
                      {presentation.speaker.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {presentation.speaker.firstName} {presentation.speaker.lastName}
                    </h3>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm"
                      onClick={() => router.push(`/dashboard/speakers/${presentation.speaker?.id}`)}
                    >
                      View Speaker Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center text-muted-foreground">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Speaker information not available
                </div>
              )}
            </CardContent>
          </Card>
          
          {presentation.event && (
            <Card>
              <CardHeader>
                <CardTitle>Event</CardTitle>
                <CardDescription>
                  This presentation is part of an event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <h3 className="font-medium">{presentation.event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(presentation.event.startDate).toLocaleDateString()} - {new Date(presentation.event.endDate).toLocaleDateString()}
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm"
                    onClick={() => router.push(`/dashboard/events/${presentation.event?.id}`)}
                  >
                    View Event Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div className="text-muted-foreground">Created</div>
                <div>{new Date(presentation.createdAt).toLocaleString()}</div>
                <div className="text-muted-foreground">Last Updated</div>
                <div>{new Date(presentation.updatedAt).toLocaleString()}</div>
                <div className="text-muted-foreground">ID</div>
                <div className="truncate font-mono text-xs">{presentation.id}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this presentation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the presentation and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 