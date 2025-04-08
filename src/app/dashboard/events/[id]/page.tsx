"use client"

import React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarDays, Pencil, ArrowLeft, AlertCircle, Loader2, User } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  status: string;
  startDate: string;
  endDate: string;
  location: string;
  venue?: string;
  posterImage?: string;
  posterCredit?: string;
  published: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: {
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  speakers: {
    id: string;
    order: number;
    speaker: {
      id: string;
      firstName: string;
      lastName: string;
      organization?: string;
      position?: string;
      photoUrl?: string;
    };
  }[];
}

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const eventId = resolvedParams.id;
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/events/${eventId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch event: ${response.statusText}`);
        }
        
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <h3 className="font-semibold text-lg">Error loading event</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      ) : event ? (
        <>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={event.status === "UPCOMING" ? "default" : event.status === "ONGOING" ? "outline" : "secondary"}>
                  {event.status}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{event.category.name}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/events/${event.id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/events">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{event.description}</p>
                  {event.content && (
                    <div className="mt-4 prose prose-sm max-w-none">
                      {event.content}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.startDate).toLocaleTimeString()} - {new Date(event.endDate).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Speakers</CardTitle>
                </CardHeader>
                <CardContent>
                  {event.speakers.length > 0 ? (
                    <div className="space-y-4">
                      {event.speakers.map((speakerItem) => (
                        <div key={speakerItem.id} className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                            {speakerItem.speaker.photoUrl ? (
                              <img 
                                src={speakerItem.speaker.photoUrl} 
                                alt={`${speakerItem.speaker.firstName} ${speakerItem.speaker.lastName}`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{speakerItem.speaker.firstName} {speakerItem.speaker.lastName}</p>
                            {(speakerItem.speaker.position || speakerItem.speaker.organization) && (
                              <p className="text-sm text-muted-foreground">
                                {speakerItem.speaker.position}
                                {speakerItem.speaker.position && speakerItem.speaker.organization && " at "}
                                {speakerItem.speaker.organization}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No speakers assigned to this event.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Location</h4>
                    <p>{event.location}</p>
                    {event.venue && <p className="text-sm text-muted-foreground">{event.venue}</p>}
                  </div>

                  {event.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {event.tags.map((tagItem) => (
                          <Badge key={tagItem.tag.id} variant="outline">
                            {tagItem.tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
                    <p>{new Date(event.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h4>
                    <p>{new Date(event.updatedAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>

              {event.posterImage && (
                <Card>
                  <CardHeader>
                    <CardTitle>Event Poster</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video relative overflow-hidden rounded-md">
                      <Image
                        src={event.posterImage}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {event.posterCredit && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Credit: {event.posterCredit}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <h3 className="font-semibold text-lg">Event not found</h3>
            <p className="text-muted-foreground">The event you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      )}
    </div>
  );
} 