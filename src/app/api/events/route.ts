import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events } from '@/lib/db/content-schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Fetch all events from database
    const eventsData = await db
      .select()
      .from(events)
      .orderBy(desc(events.createdAt));

    // Transform data to match the expected interface
    const transformedData = eventsData.map(event => ({
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
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching events from database:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events data' },
      { status: 500 }
    );
  }
} 