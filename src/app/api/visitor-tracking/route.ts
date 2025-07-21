import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { visitorTracking, publications, events } from '@/lib/db/content-schema';
import { eq, and, desc, count, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Helper function to generate session ID
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// POST endpoint to track visitor actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, contentId, contentTitle, actionType, sessionId } = body;

    // Validate required fields
    if (!contentType || !contentId || !contentTitle || !actionType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate enum values
    if (!['publikasi', 'acara'].includes(contentType)) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    if (!['view', 'download'].includes(actionType)) {
      return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
    }

    // Get client information
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';
    const ipAddress = getClientIP(request);
    const finalSessionId = sessionId || generateSessionId();

    // For view actions, check if we already have a recent view from the same session
    // to avoid counting page refreshes as multiple views
    if (actionType === 'view') {
      const recentView = await db.select()
        .from(visitorTracking)
        .where(
          and(
            eq(visitorTracking.contentType, contentType),
            eq(visitorTracking.contentId, contentId),
            eq(visitorTracking.actionType, 'view'),
            eq(visitorTracking.sessionId, finalSessionId),
            sql`datetime(${visitorTracking.createdAt}) > datetime('now', '-5 minutes')`
          )
        )
        .limit(1);

      if (recentView.length > 0) {
        return NextResponse.json({ 
          success: true, 
          message: 'View already recorded recently',
          sessionId: finalSessionId
        });
      }
    }

    // Insert tracking record
    await db.insert(visitorTracking).values({
      contentType,
      contentId,
      contentTitle,
      actionType,
      userAgent,
      ipAddress,
      referrer,
      sessionId: finalSessionId,
    });

    // Update count in publications table if it's a publikasi
    if (contentType === 'publikasi') {
      // Get current count and increment
      const [currentPub] = await db.select({ count: publications.count })
        .from(publications)
        .where(eq(publications.slug, contentId))
        .limit(1);

      if (currentPub) {
        const newCount = parseInt(currentPub.count) + 1;
        await db.update(publications)
          .set({ count: newCount.toString() })
          .where(eq(publications.slug, contentId));
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Visitor action tracked successfully',
      sessionId: finalSessionId
    });

  } catch (error) {
    console.error('Error tracking visitor action:', error);
    return NextResponse.json({ error: 'Failed to track visitor action' }, { status: 500 });
  }
}

// GET endpoint to retrieve visitor statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType');
    const contentId = searchParams.get('contentId');
    const actionType = searchParams.get('actionType');
    const timeRange = searchParams.get('timeRange') || '30'; // days

    // Build conditions
    const conditions = [];
    
    if (contentType && ['publikasi', 'acara'].includes(contentType)) {
      conditions.push(eq(visitorTracking.contentType, contentType));
    }
    
    if (contentId) {
      conditions.push(eq(visitorTracking.contentId, contentId));
    }
    
    if (actionType && ['view', 'download'].includes(actionType)) {
      conditions.push(eq(visitorTracking.actionType, actionType));
    }

    // Add time range filter
    if (timeRange !== 'all') {
      conditions.push(
        sql`datetime(${visitorTracking.createdAt}) > datetime('now', '-${timeRange} days')`
      );
    }

    // Build and execute query
    const baseQuery = db.select({
      contentType: visitorTracking.contentType,
      contentId: visitorTracking.contentId,
      contentTitle: visitorTracking.contentTitle,
      actionType: visitorTracking.actionType,
      count: count()
    }).from(visitorTracking);

    const results = await (conditions.length > 0 
      ? baseQuery.where(and(...conditions))
      : baseQuery)
      .groupBy(
        visitorTracking.contentType,
        visitorTracking.contentId,
        visitorTracking.contentTitle,
        visitorTracking.actionType
      )
      .orderBy(desc(count()));

    // If requesting specific content, also get daily breakdown
    let dailyBreakdown = null;
    if (contentType && contentId) {
      dailyBreakdown = await db.select({
        date: sql`date(${visitorTracking.createdAt})`.as('date'),
        actionType: visitorTracking.actionType,
        count: count()
      })
      .from(visitorTracking)
      .where(
        and(
          eq(visitorTracking.contentType, contentType),
          eq(visitorTracking.contentId, contentId),
          sql`datetime(${visitorTracking.createdAt}) > datetime('now', '-${timeRange} days')`
        )
      )
      .groupBy(
        sql`date(${visitorTracking.createdAt})`,
        visitorTracking.actionType
      )
      .orderBy(desc(sql`date(${visitorTracking.createdAt})`));
    }

    return NextResponse.json({
      success: true,
      data: results,
      dailyBreakdown
    });

  } catch (error) {
    console.error('Error fetching visitor statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch visitor statistics' }, { status: 500 });
  }
} 