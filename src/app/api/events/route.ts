import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the events data from the JSON file
    const filePath = path.join(process.cwd(), 'src', 'data', 'events.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const eventsData = JSON.parse(jsonData);

    // Return the data as JSON
    return NextResponse.json(eventsData);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events data' },
      { status: 500 }
    );
  }
} 