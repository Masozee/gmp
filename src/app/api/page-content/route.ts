import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pageContent } from '@/lib/db/content-schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageKey = searchParams.get('pageKey');

    if (!pageKey) {
      return NextResponse.json({ error: 'pageKey parameter is required' }, { status: 400 });
    }

    // Get page content by pageKey
    const content = await db
      .select()
      .from(pageContent)
      .where(eq(pageContent.pageKey, pageKey))
      .get();
    
    if (!content) {
      return NextResponse.json({ error: 'Page content not found' }, { status: 404 });
    }

    if (!content.isActive) {
      return NextResponse.json({ error: 'Page content is not active' }, { status: 404 });
    }
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json({ error: 'Failed to fetch page content' }, { status: 500 });
  }
} 