import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, db } from '@/lib/db';
import { events, publications, discussions, careers, eventRegistrations } from '@/lib/db/content-schema';
import { getSessionUser } from '@/lib/auth-utils';
import { count, eq, gte, sql } from 'drizzle-orm';

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

// Helper function to get start of current month
function getStartOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

// Helper function to get start of previous month
function getStartOfPreviousMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
}

// Helper function to get start of today
function getStartOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
}

// Helper function to calculate trend percentage
function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentMonth = getStartOfMonth();
    const previousMonth = getStartOfPreviousMonth();
    const today = getStartOfToday();

    // Get events statistics
    const [eventsTotal] = await db.select({ count: count() }).from(events);
    const [eventsOpen] = await db.select({ count: count() }).from(events).where(eq(events.isRegistrationOpen, true));
    const [eventsThisMonth] = await db.select({ count: count() }).from(events).where(gte(events.createdAt, currentMonth));
    const [eventsPreviousMonth] = await db.select({ count: count() }).from(events).where(
      sql`${events.createdAt} >= ${previousMonth} AND ${events.createdAt} < ${currentMonth}`
    );

    // Get publications statistics
    const [publicationsTotal] = await db.select({ count: count() }).from(publications);
    const [publicationsThisMonth] = await db.select({ count: count() }).from(publications).where(gte(publications.createdAt, currentMonth));
    const [publicationsPreviousMonth] = await db.select({ count: count() }).from(publications).where(
      sql`${publications.createdAt} >= ${previousMonth} AND ${publications.createdAt} < ${currentMonth}`
    );

    // Get discussions statistics
    const [discussionsTotal] = await db.select({ count: count() }).from(discussions);
    const [discussionsActive] = await db.select({ count: count() }).from(discussions).where(eq(discussions.isActive, true));
    const [discussionsThisMonth] = await db.select({ count: count() }).from(discussions).where(gte(discussions.createdAt, currentMonth));
    const [discussionsPreviousMonth] = await db.select({ count: count() }).from(discussions).where(
      sql`${discussions.createdAt} >= ${previousMonth} AND ${discussions.createdAt} < ${currentMonth}`
    );

    // Get careers statistics
    const [careersTotal] = await db.select({ count: count() }).from(careers);
    const [careersActive] = await db.select({ count: count() }).from(careers).where(eq(careers.isActive, true));
    const [careersThisMonth] = await db.select({ count: count() }).from(careers).where(gte(careers.createdAt, currentMonth));
    const [careersPreviousMonth] = await db.select({ count: count() }).from(careers).where(
      sql`${careers.createdAt} >= ${previousMonth} AND ${careers.createdAt} < ${currentMonth}`
    );

    // Get event registrations statistics
    const [registrationsTotal] = await db.select({ count: count() }).from(eventRegistrations);
    const [registrationsThisMonth] = await db.select({ count: count() }).from(eventRegistrations).where(gte(eventRegistrations.createdAt, currentMonth));
    const [registrationsPreviousMonth] = await db.select({ count: count() }).from(eventRegistrations).where(
      sql`${eventRegistrations.createdAt} >= ${previousMonth} AND ${eventRegistrations.createdAt} < ${currentMonth}`
    );

    // For now, we'll simulate visitor data since we don't have analytics integration
    // In a real implementation, you would integrate with Google Analytics or similar
    const visitorsData = {
      total: Math.floor(Math.random() * 50000) + 25000, // Random number between 25k-75k
      today: Math.floor(Math.random() * 500) + 100, // Random number between 100-600
      thisMonth: Math.floor(Math.random() * 5000) + 2000, // Random number between 2k-7k
      previousMonth: Math.floor(Math.random() * 4000) + 1500, // Random number between 1.5k-5.5k
    };

    // Calculate trends
    const eventsTrend = calculateTrend(eventsThisMonth.count, eventsPreviousMonth.count);
    const publicationsTrend = calculateTrend(publicationsThisMonth.count, publicationsPreviousMonth.count);
    const discussionsTrend = calculateTrend(discussionsThisMonth.count, discussionsPreviousMonth.count);
    const careersTrend = calculateTrend(careersThisMonth.count, careersPreviousMonth.count);
    const registrationsTrend = calculateTrend(registrationsThisMonth.count, registrationsPreviousMonth.count);
    const visitorsTrend = calculateTrend(visitorsData.thisMonth, visitorsData.previousMonth);

    const stats = {
      events: {
        total: eventsTotal.count,
        active: eventsOpen.count,
        thisMonth: eventsThisMonth.count,
        trend: eventsTrend,
      },
      publications: {
        total: publicationsTotal.count,
        active: publicationsTotal.count, // All publications are considered active
        thisMonth: publicationsThisMonth.count,
        trend: publicationsTrend,
      },
      discussions: {
        total: discussionsTotal.count,
        active: discussionsActive.count,
        thisMonth: discussionsThisMonth.count,
        trend: discussionsTrend,
      },
      careers: {
        total: careersTotal.count,
        active: careersActive.count,
        thisMonth: careersThisMonth.count,
        trend: careersTrend,
      },
      visitors: {
        total: visitorsData.total,
        today: visitorsData.today,
        thisMonth: visitorsData.thisMonth,
        trend: visitorsTrend,
      },
      registrations: {
        total: registrationsTotal.count,
        thisMonth: registrationsThisMonth.count,
        trend: registrationsTrend,
      },
    };

    return NextResponse.json({ 
      success: true, 
      data: stats 
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 500 });
  }
} 