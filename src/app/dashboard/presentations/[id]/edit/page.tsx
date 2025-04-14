"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowLeftIcon, LoaderIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Define types for the form data
type Speaker = {
  id: string
  firstName: string
  lastName: string
  organization?: string
}

type Event = {
  id: string
  title: string
  startDate: string
  endDate: string
}

type Presentation = {
  id: string
  title: string
  abstract?: string
  speakerId: string
  eventId?: string
  videoUrl?: string
  duration?: number
  startTime?: string
  endTime?: string
  slides?: string
}

// Form schema for validation
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  abstract: z.string().optional(),
  speakerId: z.string().min(1, { message: "Speaker is required" }),
  eventId: z.string().optional(),
  videoUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal("")),
  duration: z.coerce.number().int().positive().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function EditPresentationPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params object using React.use()
  const resolvedParams = React.use(params);
  const presentationId = resolvedParams.id;

  const router = useRouter()
  const { toast } = useToast()
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slides, setSlides] = useState<File | null>(null)
  const [currentSlides, setCurrentSlides] = useState<string | null>(null)

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      abstract: "",
      speakerId: "",
      eventId: "",
      videoUrl: "",
      duration: undefined,
      startTime: "",
      endTime: "",
    },
  })

  // Load data: presentation, speakers, and events
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch presentation
        const presentationResponse = await fetch(`/api/presentations/${presentationId}`)
        if (presentationResponse.status === 404) {
          setError("Presentation not found")
          return
        }
        if (!presentationResponse.ok) {
          throw new Error("Failed to fetch presentation")
        }
        const presentationData = await presentationResponse.json()
        setPresentation(presentationData)
        setCurrentSlides(presentationData.slides)
        
        // Fetch speakers
        const speakersResponse = await fetch("/api/speakers")
        if (!speakersResponse.ok) {
          throw new Error("Failed to fetch speakers")
        }
        const speakersData = await speakersResponse.json()
        setSpeakers(speakersData.speakers || [])

        // Fetch events
        const eventsResponse = await fetch("/api/events")
        if (!eventsResponse.ok) {
          throw new Error("Failed to fetch events")
        }
        const eventsData = await eventsResponse.json()
        setEvents(eventsData.events || [])
        
        // Set form values
        form.reset({
          title: presentationData.title,
          abstract: presentationData.abstract || "",
          speakerId: presentationData.speakerId,
          eventId: presentationData.eventId || "",
          videoUrl: presentationData.videoUrl || "",
          duration: presentationData.duration,
          startTime: presentationData.startTime ? formatDateForInput(presentationData.startTime) : "",
          endTime: presentationData.endTime ? formatDateForInput(presentationData.endTime) : "",
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load presentation data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [presentationId, form, toast])

  // Format date string for datetime-local input
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16) // Format as "YYYY-MM-DDThh:mm"
  }

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSaving(true)

    try {
      // Create a FormData object to handle file upload
      const formData = new FormData()
      formData.append("title", data.title)
      if (data.abstract) formData.append("abstract", data.abstract)
      formData.append("speakerId", data.speakerId)
      if (data.eventId) formData.append("eventId", data.eventId)
      if (data.videoUrl) formData.append("videoUrl", data.videoUrl)
      if (data.duration) formData.append("duration", String(data.duration))
      if (data.startTime) formData.append("startTime", data.startTime)
      if (data.endTime) formData.append("endTime", data.endTime)
      if (slides) formData.append("slides", slides)

      // Submit the form
      const response = await fetch(`/api/presentations/${presentationId}`, {
        method: "PATCH",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update presentation")
      }

      // Show success message
      toast({
        title: "Success",
        description: "Presentation updated successfully",
      })

      // Redirect to presentation details
      router.push(`/dashboard/presentations/${presentationId}`)
    } catch (error) {
      console.error("Error updating presentation:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update presentation",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSlides(e.target.files[0])
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-1/4 ml-auto" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (error || !presentation) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Edit Presentation</h1>
          <p className="text-muted-foreground">
            Update presentation details
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Presentation Details</CardTitle>
          <CardDescription>
            Edit the details of your presentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Presentation title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="speakerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Speaker</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a speaker" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {speakers.map((speaker) => (
                            <SelectItem key={speaker.id} value={speaker.id}>
                              {speaker.firstName} {speaker.lastName}
                              {speaker.organization && ` (${speaker.organization})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an event (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {events.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Associate this presentation with an event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Duration in minutes"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? undefined : parseInt(e.target.value)
                            field.onChange(value)
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        How long is the presentation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        When does the presentation start
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        When does the presentation end
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.youtube.com/watch?v=..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to a recorded video of the presentation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormItem>
                    <FormLabel>Slides</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept=".pdf,.ppt,.pptx,.key"
                          onChange={handleFileChange}
                        />
                        {currentSlides && !slides && (
                          <div className="text-sm text-muted-foreground">
                            Current file: {currentSlides.split('/').pop()}
                            <Button
                              variant="link"
                              className="h-auto p-0 ml-2"
                              onClick={() => window.open(currentSlides, '_blank')}
                            >
                              View
                            </Button>
                          </div>
                        )}
                        {slides && (
                          <div className="text-sm text-muted-foreground">
                            New file selected: {slides.name}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload new presentation slides (PDF, PowerPoint, Keynote)
                    </FormDescription>
                  </FormItem>
                </div>
              </div>

              <FormField
                control={form.control}
                name="abstract"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abstract</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a summary of the presentation..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of what the presentation is about
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="flex justify-end px-0 pb-0">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/presentations/${presentationId}`)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                  >
                    {isSaving && (
                      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 