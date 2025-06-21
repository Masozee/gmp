import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, db } from '@/lib/db';
import { events, publications, discussions, eventRegistrations } from '@/lib/db/content-schema';
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

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get recent events
    const recentEvents = await db.select({
      id: events.id,
      title: events.title,
      createdAt: events.createdAt,
      slug: events.slug,
    }).from(events).orderBy(desc(events.createdAt)).limit(5);

    // Get recent publications
    const recentPublications = await db.select({
      id: publications.id,
      title: publications.title,
      createdAt: publications.createdAt,
      slug: publications.slug,
    }).from(publications).orderBy(desc(publications.createdAt)).limit(5);

    // Get recent discussions
    const recentDiscussions = await db.select({
      id: discussions.id,
      title: discussions.title,
      createdAt: discussions.createdAt,
      slug: discussions.slug,
    }).from(discussions).orderBy(desc(discussions.createdAt)).limit(5);

    // Get recent registrations with event details
    const recentRegistrations = await db.select({
      id: eventRegistrations.id,
      name: eventRegistrations.name,
      createdAt: eventRegistrations.createdAt,
      eventId: eventRegistrations.eventId,
      eventTitle: events.title,
    })
    .from(eventRegistrations)
    .leftJoin(events, eq(eventRegistrations.eventId, events.id))
    .orderBy(desc(eventRegistrations.createdAt))
    .limit(5);

    // Combine all activities
    const activities: Array<{
      id: number;
      title: string;
      type: string;
      date: string;
      slug?: string;
      eventTitle?: string | null;
    }> = [];

    // Add events
    recentEvents.forEach(event => {
      activities.push({
        id: event.id,
        title: event.title,
        type: 'event',
        date: event.createdAt,
        slug: event.slug,
      });
    });

    // Add publications
    recentPublications.forEach(publication => {
      activities.push({
        id: publication.id,
        title: publication.title,
        type: 'publication',
        date: publication.createdAt,
        slug: publication.slug,
      });
    });

    // Add discussions
    recentDiscussions.forEach(discussion => {
      activities.push({
        id: discussion.id,
        title: discussion.title,
        type: 'discussion',
        date: discussion.createdAt,
        slug: discussion.slug,
      });
    });

    // Add registrations
    recentRegistrations.forEach(registration => {
      activities.push({
        id: registration.id,
        title: registration.name,
        type: 'registration',
        date: registration.createdAt,
        eventTitle: registration.eventTitle,
      });
    });

    // Sort by date and take top 15
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const topActivities = activities.slice(0, 15);

    return NextResponse.json({ 
      success: true, 
      data: topActivities 
    });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return NextResponse.json({ error: 'Failed to fetch recent activities' }, { status: 500 });
  }
} 