"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Separator } from "@/components/ui/separator"
import { MultiSelect } from "@/components/ui/multi-select"
import { Skeleton } from "@/components/ui/skeleton"

// Define the form schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().optional(),
  location: z.string().min(3, "Location must be at least 3 characters"),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid start date",
  }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid end date",
  }),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]),
  categoryId: z.string().min(1, "Please select a category"),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  posterCredit: z.string().optional(),
  tags: z.array(z.string()).optional(),
  speakers: z.array(z.string()).optional(),
}).refine(data => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type FormValues = z.infer<typeof formSchema>;

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Speaker {
  id: string;
  name: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  content?: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  categoryId: string;
  capacity?: number;
  imageUrl?: string;
  tags: {
    tag: {
      id: string;
      name: string;
    }
  }[];
  speakers: {
    speaker: {
      id: string;
      name: string;
    }
  }[];
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params object using React.use()
  const resolvedParams = React.use(params);
  const eventId = resolvedParams.id;

  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      location: "",
      startDate: "",
      endDate: "",
      status: "UPCOMING",
      categoryId: "",
      imageUrl: "",
      posterCredit: "",
      tags: [],
      speakers: [],
    },
  });

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsFetching(true);
        const response = await fetch(`/api/events/${eventId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        
        const event = await response.json();
        
        // Format dates for input
        const startDate = new Date(event.startDate).toISOString().split('T')[0];
        const endDate = new Date(event.endDate).toISOString().split('T')[0];
        
        // Set form values
        form.reset({
          title: event.title,
          description: event.description,
          content: event.content || "",
          location: event.location,
          startDate,
          endDate,
          status: event.status,
          categoryId: event.categoryId,
          imageUrl: event.posterImage || "",
          posterCredit: event.posterCredit || "",
          tags: event.tags.map((t: { tag: { id: string } }) => t.tag.id),
          speakers: event.speakers.map((s: { speaker: { id: string } }) => s.speaker.id),
        });
        
        setEvent(event);
      } catch (err) {
        console.error(err);
        setError("Could not load event data");
      } finally {
        setIsFetching(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, form]);

  // Fetch categories, tags, and speakers
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/event-categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        if (!response.ok) throw new Error("Failed to fetch tags");
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    const fetchSpeakers = async () => {
      try {
        const response = await fetch("/api/speakers");
        if (!response.ok) throw new Error("Failed to fetch speakers");
        const data = await response.json();
        setSpeakers(data);
      } catch (error) {
        console.error("Error fetching speakers:", error);
      }
    };

    fetchCategories();
    fetchTags();
    fetchSpeakers();
  }, []);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update event");
      }

      router.push(`/dashboard/events/${eventId}`);
    } catch (error: unknown) {
      console.error("Error updating event:", error)
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        toast.error((error as { message: string }).message)
      } else {
        toast.error("Failed to update event")
      };
    }
  };

  if (isFetching) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/events/${eventId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Event
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-center text-muted-foreground">
              {error || "Event not found"}. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/events/${eventId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>Edit Event</CardTitle>
            <CardDescription>
              Update the details of your event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Event title" {...field} />
                        </FormControl>
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
                            placeholder="Brief description of the event"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
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
                            placeholder="Detailed content of the event (optional)"
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          You can use HTML for formatting
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Event location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="UPCOMING">Upcoming</SelectItem>
                              <SelectItem value="ONGOING">Ongoing</SelectItem>
                              <SelectItem value="COMPLETED">Completed</SelectItem>
                              <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="URL for event image"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional image for the event
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
                          <FormLabel>Poster Credit</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Credit for the event poster"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional credit for the event poster
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={tags.map(tag => ({
                              label: tag.name,
                              value: tag.id,
                            }))}
                            placeholder="Select tags"
                            selected={field.value || []}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Select relevant tags for the event
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="speakers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Speakers</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={speakers.map(speaker => ({
                              label: speaker.name,
                              value: speaker.id,
                            }))}
                            placeholder="Select speakers"
                            selected={field.value || []}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Select speakers for the event
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Event
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Editing Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Event Status</h3>
                <p className="text-sm text-muted-foreground">
                  Update the status to reflect the current state of your event.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-1">Date Changes</h3>
                <p className="text-sm text-muted-foreground">
                  If you change the dates, make sure to update any related presentations.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-1">Speakers</h3>
                <p className="text-sm text-muted-foreground">
                  Adding or removing speakers will affect the event&apos;s schedule.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Calendar className="h-16 w-16 text-muted-foreground" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 