"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Calendar, Clock, MapPin, Plus, Users, Trash2, MoveUp, MoveDown } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { format, isValid, parse, set } from "date-fns"

import { type Event, type EventCategory, type Speaker } from "@/types/events"

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"], {
    required_error: "Please select a status",
  }),
  categoryId: z.string().min(1, "Category is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be a valid time (HH:MM)"),
  endDate: z.date({
    required_error: "End date is required",
  }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be a valid time (HH:MM)"),
  location: z.string().optional(),
  venue: z.string().optional(),
  posterImage: z.any()
    .refine(
      (file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024),
      "Cover image must be less than 5MB"
    )
    .optional(),
  posterCredit: z.string().optional(),
  published: z.boolean().default(false),
  speakers: z.array(
    z.object({
      id: z.string().optional(),
      speakerId: z.string().min(1, "Speaker is required"),
      role: z.string().optional(),
      order: z.number().int().min(1).default(1),
    })
  ).default([]),
  presentations: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().min(1, "Title is required"),
      abstract: z.string().optional().nullable(),
      duration: z.number().int().min(1).optional().nullable(),
      speakerId: z.string().min(1, "Speaker is required"),
      startTime: z.string().optional().nullable(),
      endTime: z.string().optional().nullable(),
    })
  ).default([]),
})
.refine(
  (data) => {
    // Parse times and combine with dates
    const startDateTime = combineDateAndTime(data.startDate, data.startTime);
    const endDateTime = combineDateAndTime(data.endDate, data.endTime);
    
    return endDateTime > startDateTime;
  },
  {
    message: "End date/time must be after start date/time",
    path: ["endDate"],
  }
);

function combineDateAndTime(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  return set(date, { hours, minutes });
}

function getTimeStringFromDate(date: Date): string {
  return format(date, "HH:mm");
}

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const eventId = params.id
  const [event, setEvent] = useState<Event | null>(null)
  const [categories, setCategories] = useState<EventCategory[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      status: "UPCOMING",
      categoryId: "",
      startDate: new Date(),
      startTime: "09:00",
      endDate: new Date(),
      endTime: "17:00",
      location: "",
      venue: "",
      posterCredit: "",
      published: false,
      speakers: [],
      presentations: [],
    },
  })
  
  // Initialize the speakers field array
  const { fields: speakerFields, append: appendSpeaker, remove: removeSpeaker, move: moveSpeaker } = 
    useFieldArray({
      control: form.control,
      name: "speakers",
    })

  // Initialize the presentations field array
  const { fields: presentationFields, append: appendPresentation, remove: removePresentation } = 
    useFieldArray({
      control: form.control,
      name: "presentations",
    })

  useEffect(() => {
    const fetchEventAndData = async () => {
      try {
        setLoading(true)
        
        // Fetch the event
        const eventResponse = await fetch(`/api/events/${eventId}`)
        if (!eventResponse.ok) {
          if (eventResponse.status === 404) {
            toast.error("Event not found")
            router.push("/dashboard/events")
            return
          }
          throw new Error("Failed to fetch event")
        }
        const eventData: Event = await eventResponse.json()
        setEvent(eventData)
        
        // Fetch categories
        const categoriesResponse = await fetch("/api/event-categories")
        if (!categoriesResponse.ok) throw new Error("Failed to fetch categories")
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
        
        // Fetch speakers
        const speakersResponse = await fetch("/api/speakers")
        if (!speakersResponse.ok) throw new Error("Failed to fetch speakers")
        const speakersData = await speakersResponse.json()
        setSpeakers(speakersData.speakers || [])
        
        // Set form values
        const startDate = new Date(eventData.startDate)
        const endDate = new Date(eventData.endDate)
        
        form.reset({
          title: eventData.title || "",
          description: eventData.description || "",
          content: eventData.content || "",
          status: eventData.status as "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED",
          categoryId: eventData.categoryId || "",
          startDate: startDate,
          startTime: getTimeStringFromDate(startDate),
          endDate: endDate,
          endTime: getTimeStringFromDate(endDate),
          location: eventData.location || "",
          venue: eventData.venue || "",
          posterCredit: eventData.posterCredit || "",
          published: eventData.published || false,
          speakers: eventData.speakers?.map(speaker => ({
            id: speaker.id,
            speakerId: speaker.speakerId,
            role: speaker.role || "",
            order: speaker.order || 1,
          })) || [],
          presentations: eventData.presentations?.map(presentation => ({
            id: presentation.id,
            title: presentation.title,
            abstract: presentation.abstract || null,
            duration: presentation.duration || null,
            speakerId: presentation.speakerId,
            startTime: presentation.startTime ? format(new Date(presentation.startTime), "HH:mm") : null,
            endTime: presentation.endTime ? format(new Date(presentation.endTime), "HH:mm") : null,
          })) || [],
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load event data", {
          description: "Please try again later.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEventAndData()
  }, [eventId, router, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true)
      
      // Create FormData object for file upload
      const formData = new FormData()
      
      // Add date/time combined fields
      const startDateTime = combineDateAndTime(values.startDate, values.startTime)
      const endDateTime = combineDateAndTime(values.endDate, values.endTime)
      
      formData.append("title", values.title)
      formData.append("description", values.description)
      formData.append("content", values.content)
      formData.append("status", values.status)
      formData.append("categoryId", values.categoryId)
      formData.append("startDate", startDateTime.toISOString())
      formData.append("endDate", endDateTime.toISOString())
      formData.append("published", String(values.published))
      
      if (values.location) formData.append("location", values.location)
      if (values.venue) formData.append("venue", values.venue)
      if (values.posterCredit) formData.append("posterCredit", values.posterCredit)
      
      // Handle the poster image
      if (values.posterImage instanceof File) {
        formData.append("posterImage", values.posterImage)
      }
      
      // Add speakers data
      if (values.speakers && values.speakers.length > 0) {
        formData.append("speakers", JSON.stringify(values.speakers))
      }
      
      // Add presentations data
      if (values.presentations && values.presentations.length > 0) {
        formData.append("presentations", JSON.stringify(values.presentations))
      }
      
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update event")
      }

      toast.success("Event updated successfully")
      router.push(`/dashboard/events/${eventId}`)
    } catch (error) {
      console.error("Error updating event:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update event")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
              <p className="text-muted-foreground">Loading event data...</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-8 w-40" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-8 w-24" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
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
            onClick={() => router.push(`/dashboard/events/${eventId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
            <p className="text-muted-foreground">
              Update event information
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - left side */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event title" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of your event. Make it clear and descriptive.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a short description"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief summary of the event (max 500 characters). This will appear in listings.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter detailed content"
                            className="min-h-[200px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed information about the event, including agenda, what to expect, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Date & Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
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
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
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
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Jakarta, Indonesia"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>City, country, or online</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="venue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Venue</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Conference Center"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>Specific venue name if applicable</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="posterImage"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Poster Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              onChange(file)
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {event?.posterUrl ? (
                            <div className="flex items-center gap-2">
                              <span>Current image: </span>
                              <a 
                                href={event.posterUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary underline text-sm"
                              >
                                View current image
                              </a>
                              <span className="text-muted-foreground text-sm">(Upload a new one to replace)</span>
                            </div>
                          ) : (
                            "Upload an image for the event (max 5MB). Optimal aspect ratio 16:9."
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="posterCredit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Credit</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Photo by John Doe"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>Credit the creator or source of the image</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Speakers</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendSpeaker({ speakerId: "", role: "", order: speakerFields.length + 1 })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Speaker
                  </Button>
                </CardHeader>
                <CardContent>
                  {speakerFields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-lg">
                      <Users className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        No speakers added yet. Click "Add Speaker" to assign speakers to this event.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {speakerFields.map((field, index) => (
                        <div key={field.id} className="flex flex-col space-y-3 p-4 border rounded-md">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Speaker {index + 1}</h4>
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => index > 0 && moveSpeaker(index, index - 1)}
                                disabled={index === 0}
                              >
                                <MoveUp className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => index < speakerFields.length - 1 && moveSpeaker(index, index + 1)}
                                disabled={index === speakerFields.length - 1}
                              >
                                <MoveDown className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeSpeaker(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name={`speakers.${index}.speakerId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Speaker</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a speaker" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {speakers.map((speaker) => (
                                      <SelectItem key={speaker.id} value={speaker.id}>
                                        {speaker.firstName} {speaker.lastName} - {speaker.organization}
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
                            name={`speakers.${index}.role`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Keynote Speaker, Panelist"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormDescription>
                                  The speaker's role in this event (optional)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`speakers.${index}.order`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Display Order</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                    value={field.value}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Order in which this speaker appears in listings
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* Keep the hidden id field for existing relationships */}
                          <input 
                            type="hidden" 
                            {...form.register(`speakers.${index}.id`)} 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Presentations</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendPresentation({ 
                      title: "", 
                      abstract: "", 
                      duration: 30, 
                      speakerId: "", 
                      startTime: "", 
                      endTime: "" 
                    })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Presentation
                  </Button>
                </CardHeader>
                <CardContent>
                  {presentationFields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-lg">
                      <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        No presentations added yet. Click "Add Presentation" to add presentations to this event.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {presentationFields.map((field, index) => (
                        <div key={field.id} className="flex flex-col space-y-3 p-4 border rounded-md">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Presentation {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removePresentation(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name={`presentations.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Introduction to Next.js"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`presentations.${index}.abstract`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Abstract</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Brief description of the presentation"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormDescription>
                                  A short summary of what the presentation will cover
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`presentations.${index}.speakerId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Speaker</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a speaker" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {speakers.map((speaker) => (
                                      <SelectItem key={speaker.id} value={speaker.id}>
                                        {speaker.firstName} {speaker.lastName} - {speaker.organization}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`presentations.${index}.duration`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Duration (minutes)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                                      value={field.value || 30}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-2">
                              <FormField
                                control={form.control}
                                name={`presentations.${index}.startTime`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                      <Input type="time" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`presentations.${index}.endTime`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Time</FormLabel>
                                    <FormControl>
                                      <Input type="time" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
                          {/* Keep the hidden id field for existing presentations */}
                          <input 
                            type="hidden" 
                            {...form.register(`presentations.${index}.id`)} 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - right side */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UPCOMING">Upcoming</SelectItem>
                            <SelectItem value="ONGOING">Ongoing</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Current status of the event
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the most appropriate category
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="rounded border-input h-4 w-4"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Published
                          </FormLabel>
                          <FormDescription>
                            Make this event visible to the public
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/events/${eventId}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
} 