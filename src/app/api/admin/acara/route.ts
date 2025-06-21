import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, db } from '@/lib/db';
import { events } from '@/lib/db/content-schema';
import { getSessionUser } from '@/lib/auth-utils';
import { desc, eq } from 'drizzle-orm';

// Initialize database
initializeDatabase();

// Helper function to verify admin authentication
async function verifyAdmin(request: NextRequest) {
  const sessionId = request.cookies.get('session')?.value;
  
  if (!sessionId) {
    return null;
  }

  const user = await getSessionUser(sessionId);
  
  if (!user || user.role !== 'admin') {
    return null;
  }

  return user;
}

// GET - Get all events
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allEvents = await db.select().from(events).orderBy(desc(events.createdAt));

    return NextResponse.json({ 
      success: true, 
      data: allEvents 
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      slug,
      date,
      time,
      location,
      capacity,
      registrationUrl,
      imageUrl,
      isActive
    } = body;

    // Validation
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!description?.trim()) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    if (!time) {
      return NextResponse.json({ error: 'Time is required' }, { status: 400 });
    }

    if (!location?.trim()) {
      return NextResponse.json({ error: 'Location is required' }, { status: 400 });
    }

    if (!capacity || capacity <= 0) {
      return NextResponse.json({ error: 'Valid capacity is required' }, { status: 400 });
    }

    // Generate slug if not provided
    let finalSlug = slug?.trim();
    if (!finalSlug) {
      finalSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    const newEvent = await db.insert(events).values({
      title: title.trim(),
      description: description.trim(),
      slug: finalSlug,
      date,
      time,
      location: location.trim(),
      capacity: parseInt(capacity),
      image: imageUrl?.trim() || null,
      category: 'general', // Default category
      isPaid: false, // Default to free
      isRegistrationOpen: Boolean(isActive),
    }).returning();

    return NextResponse.json({ 
      success: true, 
      data: newEvent[0] 
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

// PUT - Update event
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      title,
      description,
      slug,
      date,
      time,
      location,
      capacity,
      registrationUrl,
      imageUrl,
      isActive
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Validation
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!description?.trim()) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    if (!time) {
      return NextResponse.json({ error: 'Time is required' }, { status: 400 });
    }

    if (!location?.trim()) {
      return NextResponse.json({ error: 'Location is required' }, { status: 400 });
    }

    if (!capacity || capacity <= 0) {
      return NextResponse.json({ error: 'Valid capacity is required' }, { status: 400 });
    }

    // Generate slug if not provided
    let finalSlug = slug?.trim();
    if (!finalSlug) {
      finalSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    const updatedEvent = await db.update(events)
      .set({
        title: title.trim(),
        description: description.trim(),
        slug: finalSlug,
        date,
        time,
        location: location.trim(),
        capacity: parseInt(capacity),
        image: imageUrl?.trim() || null,
        isRegistrationOpen: Boolean(isActive),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(events.id, parseInt(id)))
      .returning();

    if (updatedEvent.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedEvent[0] 
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
} 