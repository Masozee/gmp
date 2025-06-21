import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, db } from '@/lib/db';
import { discussions } from '@/lib/db/content-schema';
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

// GET - Get all discussions
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allDiscussions = await db.select().from(discussions).orderBy(desc(discussions.createdAt));

    return NextResponse.json({ 
      success: true, 
      data: allDiscussions 
    });
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json({ error: 'Failed to fetch discussions' }, { status: 500 });
  }
}

// POST - Create new discussion
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      image,
      date,
      description,
      content,
      isActive
    } = body;

    // Validation
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
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

    const newDiscussion = await db.insert(discussions).values({
      title: title.trim(),
      slug: finalSlug,
      image: image?.trim() || null,
      date,
      description: description?.trim() || null,
      content: content?.trim() || null,
      isActive: Boolean(isActive),
    }).returning();

    return NextResponse.json({ 
      success: true, 
      data: newDiscussion[0] 
    });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json({ error: 'Failed to create discussion' }, { status: 500 });
  }
}

// PUT - Update discussion
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
      slug,
      image,
      date,
      description,
      content,
      isActive
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Discussion ID is required' }, { status: 400 });
    }

    // Validation
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
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

    const updatedDiscussion = await db.update(discussions)
      .set({
        title: title.trim(),
        slug: finalSlug,
        image: image?.trim() || null,
        date,
        description: description?.trim() || null,
        content: content?.trim() || null,
        isActive: Boolean(isActive),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(discussions.id, parseInt(id)))
      .returning();

    if (updatedDiscussion.length === 0) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedDiscussion[0] 
    });
  } catch (error) {
    console.error('Error updating discussion:', error);
    return NextResponse.json({ error: 'Failed to update discussion' }, { status: 500 });
  }
} 