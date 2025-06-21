import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, db } from '@/lib/db';
import { events, publications, discussions, eventRegistrations } from '@/lib/db/content-schema';
import { getSessionUser } from '@/lib/auth-utils';
import { count, gte, lt, sql } from 'drizzle-orm';

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

// Helper function to get month boundaries
function getMonthBoundaries(monthsBack: number) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 1);
  
  return {
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    label: startDate.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chartData = [];

    // Get data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const { start, end, label } = getMonthBoundaries(i);

      // Count events for this month
      const [eventsCount] = await db.select({ count: count() })
        .from(events)
        .where(sql`${events.createdAt} >= ${start} AND ${events.createdAt} < ${end}`);

      // Count publications for this month
      const [publicationsCount] = await db.select({ count: count() })
        .from(publications)
        .where(sql`${publications.createdAt} >= ${start} AND ${publications.createdAt} < ${end}`);

      // Count discussions for this month
      const [discussionsCount] = await db.select({ count: count() })
        .from(discussions)
        .where(sql`${discussions.createdAt} >= ${start} AND ${discussions.createdAt} < ${end}`);

      // Count registrations for this month
      const [registrationsCount] = await db.select({ count: count() })
        .from(eventRegistrations)
        .where(sql`${eventRegistrations.createdAt} >= ${start} AND ${eventRegistrations.createdAt} < ${end}`);

      chartData.push({
        month: label,
        events: eventsCount.count,
        publications: publicationsCount.count,
        discussions: discussionsCount.count,
        registrations: registrationsCount.count,
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: chartData 
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
  }
} 