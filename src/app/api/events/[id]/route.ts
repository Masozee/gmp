import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Params {
  params: {
    id: string;
  };
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  isPaid?: boolean;
  price?: number;
  isRegistrationOpen: boolean;
  capacity?: number;
  registeredCount?: number;
  [key: string]: string | number | boolean | undefined;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Handle async params
    const id = await Promise.resolve(params.id);
    
    // Read the events data from the JSON file
    const filePath = path.join(process.cwd(), 'src', 'data', 'events.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const eventsData = JSON.parse(jsonData);

    // Find the event with the matching ID
    const event = eventsData.find((item: Event) => 
      item.id === parseInt(id, 10)
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