import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, db } from '@/lib/db';
import { events, publications, discussions, eventRegistrations, contactMessages, newsletterSubscriptions } from '@/lib/db/content-schema';
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

// Helper function to get date range for the last 6 months
function getDateRange() {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  return {
    start: sixMonthsAgo.toISOString(),
    end: now.toISOString()
  };
}

// Helper function to generate date array for the last 6 months
function generateDateArray() {
  const dates = [];
  const now = new Date();
  
  for (let i = 180; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dates.push({
      date: date.toISOString().split('T')[0],
      month: date.toLocaleDateString('id-ID', { month: 'short' }),
      day: date.getDate(),
      weekday: date.toLocaleDateString('id-ID', { weekday: 'short' })
    });
  }
  
  return dates;
}

// Simulate visitor data (in a real app, this would come from analytics)
function generateVisitorData(dates: any[]) {
  return dates.map(dateInfo => {
    // Simulate realistic visitor patterns
    const baseVisitors = 150;
    const weekendMultiplier = dateInfo.weekday === 'Sab' || dateInfo.weekday === 'Min' ? 0.7 : 1;
    const randomVariation = Math.random() * 100 - 50;
    const seasonalTrend = Math.sin((dateInfo.day / 30) * Math.PI) * 50;
    
    const desktop = Math.max(0, Math.floor((baseVisitors + randomVariation + seasonalTrend) * weekendMultiplier));
    const mobile = Math.max(0, Math.floor(desktop * (0.6 + Math.random() * 0.8)));
    
    return {
      date: dateInfo.date,
      desktop,
      mobile,
      total: desktop + mobile,
      month: dateInfo.month,
      day: dateInfo.day
    };
  });
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { start, end } = getDateRange();
    const dates = generateDateArray();
    
    // Generate visitor data
    const visitorData = generateVisitorData(dates);
    
    // Get monthly content creation data
    const monthlyData = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i, 1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date();
      monthEnd.setMonth(monthEnd.getMonth() - i + 1, 1);
      monthEnd.setHours(0, 0, 0, 0);
      
      const monthStartISO = monthStart.toISOString();
      const monthEndISO = monthEnd.toISOString();
      
      // Count activities for this month
      const [eventsCount] = await db.select({ count: count() })
        .from(events)
        .where(sql`${events.createdAt} >= ${monthStartISO} AND ${events.createdAt} < ${monthEndISO}`);

      const [publicationsCount] = await db.select({ count: count() })
        .from(publications)
        .where(sql`${publications.createdAt} >= ${monthStartISO} AND ${publications.createdAt} < ${monthEndISO}`);

      const [discussionsCount] = await db.select({ count: count() })
        .from(discussions)
        .where(sql`${discussions.createdAt} >= ${monthStartISO} AND ${discussions.createdAt} < ${monthEndISO}`);

      const [registrationsCount] = await db.select({ count: count() })
        .from(eventRegistrations)
        .where(sql`${eventRegistrations.createdAt} >= ${monthStartISO} AND ${eventRegistrations.createdAt} < ${monthEndISO}`);

      const [contactsCount] = await db.select({ count: count() })
        .from(contactMessages)
        .where(sql`${contactMessages.createdAt} >= ${monthStartISO} AND ${contactMessages.createdAt} < ${monthEndISO}`);

      const [subscriptionsCount] = await db.select({ count: count() })
        .from(newsletterSubscriptions)
        .where(sql`${newsletterSubscriptions.subscribedAt} >= ${monthStartISO} AND ${newsletterSubscriptions.subscribedAt} < ${monthEndISO}`);

      monthlyData.push({
        month: monthStart.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        events: eventsCount.count,
        publications: publicationsCount.count,
        discussions: discussionsCount.count,
        registrations: registrationsCount.count,
        contacts: contactsCount.count,
        subscriptions: subscriptionsCount.count,
        total: eventsCount.count + publicationsCount.count + discussionsCount.count + registrationsCount.count
      });
    }

    // Calculate summary statistics
    const totalVisitors = visitorData.reduce((sum, day) => sum + day.total, 0);
    const avgDailyVisitors = Math.round(totalVisitors / visitorData.length);
    const maxDailyVisitors = Math.max(...visitorData.map(day => day.total));
    const minDailyVisitors = Math.min(...visitorData.map(day => day.total));
    
    const totalActivities = monthlyData.reduce((sum, month) => sum + month.total, 0);
    const avgMonthlyActivities = Math.round(totalActivities / monthlyData.length);

    return NextResponse.json({ 
      success: true, 
      data: {
        visitors: visitorData,
        monthly: monthlyData,
        summary: {
          totalVisitors,
          avgDailyVisitors,
          maxDailyVisitors,
          minDailyVisitors,
          totalActivities,
          avgMonthlyActivities,
          timeRange: '6 bulan terakhir'
        }
      }
    });
  } catch (error) {
    console.error('Error fetching activity data:', error);
    return NextResponse.json({ error: 'Failed to fetch activity data' }, { status: 500 });
  }
} 