import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, db } from '@/lib/db';
import { careers } from '@/lib/db/content-schema';
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

// GET - Get all careers
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allCareers = await db.select().from(careers).orderBy(desc(careers.createdAt));

    return NextResponse.json({ 
      success: true, 
      data: allCareers 
    });
  } catch (error) {
    console.error('Error fetching careers:', error);
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 });
  }
}

// POST - Create new career
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      type,
      location,
      duration,
      deadline,
      postedDate,
      poster,
      description,
      responsibilities,
      requirements,
      benefits,
      applyUrl,
      slug,
      isActive
    } = body;

    // Validation
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!description?.trim()) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    if (!postedDate) {
      return NextResponse.json({ error: 'Posted date is required' }, { status: 400 });
    }

    if (!type || !['internship', 'full-time', 'part-time', 'contract', 'volunteer'].includes(type)) {
      return NextResponse.json({ error: 'Valid type is required' }, { status: 400 });
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

    const newCareer = await db.insert(careers).values({
      title: title.trim(),
      type,
      location: location?.trim() || null,
      duration: duration?.trim() || null,
      deadline: deadline || null,
      postedDate,
      poster: poster?.trim() || null,
      description: description.trim(),
      responsibilities: responsibilities?.trim() || null,
      requirements: requirements?.trim() || null,
      benefits: benefits?.trim() || null,
      applyUrl: applyUrl?.trim() || null,
      slug: finalSlug,
      isActive: Boolean(isActive),
    }).returning();

    return NextResponse.json({ 
      success: true, 
      data: newCareer[0] 
    });
  } catch (error) {
    console.error('Error creating career:', error);
    return NextResponse.json({ error: 'Failed to create career' }, { status: 500 });
  }
}

// PUT - Update career
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
      type,
      location,
      duration,
      deadline,
      postedDate,
      poster,
      description,
      responsibilities,
      requirements,
      benefits,
      applyUrl,
      slug,
      isActive
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Career ID is required' }, { status: 400 });
    }

    // Validation
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!description?.trim()) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    if (!postedDate) {
      return NextResponse.json({ error: 'Posted date is required' }, { status: 400 });
    }

    if (!type || !['internship', 'full-time', 'part-time', 'contract', 'volunteer'].includes(type)) {
      return NextResponse.json({ error: 'Valid type is required' }, { status: 400 });
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

    const updatedCareer = await db.update(careers)
      .set({
        title: title.trim(),
        type,
        location: location?.trim() || null,
        duration: duration?.trim() || null,
        deadline: deadline || null,
        postedDate,
        poster: poster?.trim() || null,
        description: description.trim(),
        responsibilities: responsibilities?.trim() || null,
        requirements: requirements?.trim() || null,
        benefits: benefits?.trim() || null,
        applyUrl: applyUrl?.trim() || null,
        slug: finalSlug,
        isActive: Boolean(isActive),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(careers.id, parseInt(id)))
      .returning();

    if (updatedCareer.length === 0) {
      return NextResponse.json({ error: 'Career not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedCareer[0] 
    });
  } catch (error) {
    console.error('Error updating career:', error);
    return NextResponse.json({ error: 'Failed to update career' }, { status: 500 });
  }
} 