import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

interface Event {
  id: number;
  title: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  description: string;
  en_description: string;
  image: string;
  category: string;
  isPaid: boolean;
  price?: number;
  isRegistrationOpen: boolean;
  registrationLink: string;
  capacity: number;
  registeredCount: number;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Handle async params
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    // Read the events data from the JSON file
    const filePath = path.join(process.cwd(), 'src', 'data', 'events.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const eventsData = JSON.parse(jsonData);

    // Find the event with the matching slug
    const event = eventsData.find((item: Event) => 
      item.slug === slug
    );

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Return the event as JSON
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event data' },
      { status: 500 }
    );
  }
} 