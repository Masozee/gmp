import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events } from '@/lib/db/content-schema';
import { eq } from 'drizzle-orm';

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Handle async params
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    // Find the event with the matching slug from database
    const eventData = await db
      .select()
      .from(events)
      .where(eq(events.slug, slug))
      .limit(1);

    if (eventData.length === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const event = eventData[0];

    // Transform data to match the expected interface
    const transformedEvent = {
      id: event.id,
      title: event.title,
      slug: event.slug,
      date: event.date,
      time: event.time,
      location: event.location,
      address: event.address,
      description: event.description,
      en_description: event.enDescription,
      image: event.image || '/images/events/default-event.jpg',
      category: event.category,
      registrationLink: '' // This field doesn't exist in the schema but is expected by the frontend
    };

    return NextResponse.json(transformedEvent);
  } catch (error) {
    console.error('Error fetching event from database:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event data' },
      { status: 500 }
    );
  }
} 