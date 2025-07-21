import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pageContent } from '@/lib/db/content-schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageKey = searchParams.get('pageKey');

    if (pageKey) {
      // Get specific page content
      const content = await db.select().from(pageContent).where(eq(pageContent.pageKey, pageKey)).get();
      
      if (!content) {
        return NextResponse.json({ error: 'Page content not found' }, { status: 404 });
      }
      
      return NextResponse.json(content);
    } else {
      // Get all page content
      const allContent = await db.select().from(pageContent).all();
      return NextResponse.json(allContent);
    }
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json({ error: 'Failed to fetch page content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageKey, pageName, pageUrl, heroTitle, heroSubtitle, heroBackgroundColor, heroBackgroundImage, sections } = body;

    if (!pageKey || !pageName || !pageUrl || !sections) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if page content already exists
    const existingContent = await db.select().from(pageContent).where(eq(pageContent.pageKey, pageKey)).get();

    if (existingContent) {
      // Update existing content
      const updatedContent = await db
        .update(pageContent)
        .set({
          pageName,
          pageUrl,
          heroTitle,
          heroSubtitle,
          heroBackgroundColor,
          heroBackgroundImage,
          sections: typeof sections === 'string' ? sections : JSON.stringify(sections),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(pageContent.pageKey, pageKey))
        .returning()
        .get();

      return NextResponse.json(updatedContent);
    } else {
      // Create new content
      const newContent = await db
        .insert(pageContent)
        .values({
          pageKey,
          pageName,
          pageUrl,
          heroTitle,
          heroSubtitle,
          heroBackgroundColor,
          heroBackgroundImage,
          sections: typeof sections === 'string' ? sections : JSON.stringify(sections),
        })
        .returning()
        .get();

      return NextResponse.json(newContent);
    }
  } catch (error) {
    console.error('Error creating/updating page content:', error);
    return NextResponse.json({ error: 'Failed to save page content' }, { status: 500 });
  }
} 