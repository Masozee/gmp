import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, db } from '@/lib/db';
import { events } from '@/lib/db/content-schema';
import { getSessionUser } from '@/lib/auth-utils';
import { eq } from 'drizzle-orm';

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

// GET - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const event = await db.select().from(events).where(eq(events.id, id));
    
    if (event.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

// PUT - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const body = await request.json();
    const {
      title,
      description,
      slug,
      date,
      time,
      location,
      address,
      capacity,
      imageUrl,
      category,
      isPaid,
      price,
      isRegistrationOpen
    } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json({ 
        error: 'Title and description are required' 
      }, { status: 400 });
    }

    // Check if event exists
    const existingEvent = await db.select().from(events).where(eq(events.id, id));
    if (existingEvent.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if slug is unique (excluding current event)
    if (slug) {
      const slugExists = await db.select()
        .from(events)
        .where(eq(events.slug, slug));
      
      if (slugExists.length > 0 && slugExists[0].id !== id) {
        return NextResponse.json({ 
          error: 'Slug already exists' 
        }, { status: 400 });
      }
    }

    // Update event
    const updatedEvent = await db.update(events)
      .set({
        title,
        description,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        date,
        time,
        location,
        address,
        capacity: capacity || 50,
        image: imageUrl,
        category,
        isPaid: isPaid || false,
        price: isPaid ? price : null,
        isRegistrationOpen: isRegistrationOpen ?? true,
        updatedAt: new Date().toISOString()
      })
      .where(eq(events.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedEvent[0]
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const deletedEvent = await db.delete(events)
      .where(eq(events.id, id))
      .returning();

    if (deletedEvent.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
} 