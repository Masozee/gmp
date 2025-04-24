"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format, addHours } from "date-fns"

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

function NewEventPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get date from URL if available
  const dateParam = searchParams.get('date');
  
  // Format date for datetime-local input
  const formatDateForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };
  
  // Calculate default dates
  const getDefaultDates = () => {
    if (dateParam) {
      const selectedDate = new Date(dateParam);
      if (!isNaN(selectedDate.getTime())) {
        return {
          startDate: formatDateForInput(selectedDate),
          endDate: formatDateForInput(addHours(selectedDate, 2))
        };
      }
    }
    return {
      startDate: "",
      endDate: ""
    };
  };
  
  const defaultDates = getDefaultDates();

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      location: "",
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
      status: "UPCOMING",
      categoryId: "",
      imageUrl: "",
      posterCredit: "",
      tags: [],
      speakers: [],
    },
  });

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
        setSpeakers(data.speakers || []);
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
      
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create event");
      }

      const event = await response.json();
      router.push(`/dashboard/events/${event.id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      setIsLoading(false);
    }
  };

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

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
            <CardDescription>
              Fill in the details to create a new event
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
                    Create Event
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Event Creation Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Title & Description</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a clear, descriptive title and provide a concise description of your event.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-1">Date & Time</h3>
                <p className="text-sm text-muted-foreground">
                  Set the start and end dates for your event. Make sure the end date is after the start date.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-1">Location</h3>
                <p className="text-sm text-muted-foreground">
                  Specify where the event will take place. This can be a physical address or a virtual location.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-1">Categories & Tags</h3>
                <p className="text-sm text-muted-foreground">
                  Select a category and add relevant tags to help people find your event.
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

// Wrap with Suspense for useSearchParams
export default function NewEventPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/dashboard/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Please wait while we load the form.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    }>
      <NewEventPageContent />
    </Suspense>
  );
} 