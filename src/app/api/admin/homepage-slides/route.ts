import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, db } from '@/lib/db';
import { homepageSlides } from '@/lib/db/content-schema';
import { getSessionUser } from '@/lib/auth-utils';
import { desc, eq, asc } from 'drizzle-orm';

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

// GET - Fetch all homepage slides
export async function GET() {
  try {
    const slides = await db
      .select()
      .from(homepageSlides)
      .orderBy(asc(homepageSlides.order));

    return NextResponse.json({ slides });
  } catch (error) {
    console.error('Error fetching homepage slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slides' },
      { status: 500 }
    );
  }
}

// POST - Create new homepage slide
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      type,
      order,
      title,
      subtitle,
      description,
      image,
      buttonText,
      buttonLink,
      title_en,
      subtitle_en,
      description_en,
      buttonText_en,
      buttonLink_en,
      isActive
    } = body;

    // Validate required fields
    if (!type || !order) {
      return NextResponse.json(
        { error: 'Type and order are required' },
        { status: 400 }
      );
    }

    // Create slide
    const [newSlide] = await db
      .insert(homepageSlides)
      .values({
        type,
        order,
        title: title || null,
        subtitle: subtitle || null,
        description: description || null,
        image: image || null,
        buttonText: buttonText || null,
        buttonLink: buttonLink || null,
        title_en: title_en || null,
        subtitle_en: subtitle_en || null,
        description_en: description_en || null,
        buttonText_en: buttonText_en || null,
        buttonLink_en: buttonLink_en || null,
        isActive: isActive ?? true,
      })
      .returning();

    return NextResponse.json({ slide: newSlide }, { status: 201 });
  } catch (error) {
    console.error('Error creating homepage slide:', error);
    return NextResponse.json(
      { error: 'Failed to create slide' },
      { status: 500 }
    );
  }
}

// PUT - Update homepage slide
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Slide ID is required' }, { status: 400 });
    }

    // Validation for image slides
    if (updateData.type === 'image') {
      if (updateData.title !== undefined && !updateData.title?.trim()) {
        return NextResponse.json({ error: 'Title is required for image slides' }, { status: 400 });
      }
      if (updateData.image !== undefined && !updateData.image?.trim()) {
        return NextResponse.json({ error: 'Image is required for image slides' }, { status: 400 });
      }
    }

    const updatedSlide = await db.update(homepageSlides)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(homepageSlides.id, id))
      .returning();

    if (updatedSlide.length === 0) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedSlide[0] 
    });
  } catch (error) {
    console.error('Error updating homepage slide:', error);
    return NextResponse.json({ error: 'Failed to update homepage slide' }, { status: 500 });
  }
}
