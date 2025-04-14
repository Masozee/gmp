"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
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

export default function NewPresentationPage() {
  const router = useRouter()
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [slides, setSlides] = useState<File | null>(null)

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

  // Load speakers and events
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
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
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

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
      const response = await fetch("/api/presentations", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create presentation")
      }

      // Show success message
      toast({
        title: "Success",
        description: "Presentation created successfully",
      })

      // Redirect to presentations list
      router.push("/dashboard/presentations")
    } catch (error) {
      console.error("Error creating presentation:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create presentation",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSlides(e.target.files[0])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Create Presentation</h1>
          <p className="text-muted-foreground">
            Add a new presentation to the system
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
            Fill in the details of the presentation
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                      <Input
                        type="file"
                        accept=".pdf,.ppt,.pptx,.key"
                        onChange={handleFileChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload presentation slides (PDF, PowerPoint, Keynote)
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
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                >
                  {isSubmitting && (
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Presentation
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 