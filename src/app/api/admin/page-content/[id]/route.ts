import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pageContent } from '@/lib/db/content-schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const content = await db.select().from(pageContent).where(eq(pageContent.id, id)).get();
    
    if (!content) {
      return NextResponse.json({ error: 'Page content not found' }, { status: 404 });
    }
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json({ error: 'Failed to fetch page content' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { pageKey, pageName, pageUrl, heroTitle, heroSubtitle, heroBackgroundColor, heroBackgroundImage, sections } = body;

    if (!pageKey || !pageName || !pageUrl || !sections) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedContent = await db
      .update(pageContent)
      .set({
        pageKey,
        pageName,
        pageUrl,
        heroTitle,
        heroSubtitle,
        heroBackgroundColor,
        heroBackgroundImage,
        sections: typeof sections === 'string' ? sections : JSON.stringify(sections),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(pageContent.id, id))
      .returning()
      .get();

    if (!updatedContent) {
      return NextResponse.json({ error: 'Page content not found' }, { status: 404 });
    }

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating page content:', error);
    return NextResponse.json({ error: 'Failed to update page content' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const deletedContent = await db
      .delete(pageContent)
      .where(eq(pageContent.id, id))
      .returning()
      .get();

    if (!deletedContent) {
      return NextResponse.json({ error: 'Page content not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Page content deleted successfully' });
  } catch (error) {
    console.error('Error deleting page content:', error);
    return NextResponse.json({ error: 'Failed to delete page content' }, { status: 500 });
  }
} 