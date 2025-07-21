import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, db } from '@/lib/db';
import { homepageSlides } from '@/lib/db/content-schema';
import { getSessionUser } from '@/lib/auth-utils';
import { eq } from 'drizzle-orm';

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

// GET - Get single homepage slide
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const slideId = parseInt(id);
    if (isNaN(slideId)) {
      return NextResponse.json(
        { error: 'Invalid slide ID' },
        { status: 400 }
      );
    }

    const [slide] = await db
      .select()
      .from(homepageSlides)
      .where(eq(homepageSlides.id, slideId));

    if (!slide) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ slide });
  } catch (error) {
    console.error('Error fetching homepage slide:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slide' },
      { status: 500 }
    );
  }
}

// PUT - Update homepage slide
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const slideId = parseInt(id);
    if (isNaN(slideId)) {
      return NextResponse.json(
        { error: 'Invalid slide ID' },
        { status: 400 }
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

    // Update slide
    const [updatedSlide] = await db
      .update(homepageSlides)
      .set({
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
        updatedAt: new Date().toISOString(),
      })
      .where(eq(homepageSlides.id, slideId))
      .returning();

    if (!updatedSlide) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ slide: updatedSlide });
  } catch (error) {
    console.error('Error updating homepage slide:', error);
    return NextResponse.json(
      { error: 'Failed to update slide' },
      { status: 500 }
    );
  }
}

// DELETE - Delete homepage slide
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const slideId = parseInt(id);
    if (isNaN(slideId)) {
      return NextResponse.json(
        { error: 'Invalid slide ID' },
        { status: 400 }
      );
    }

    // Delete slide
    const [deletedSlide] = await db
      .delete(homepageSlides)
      .where(eq(homepageSlides.id, slideId))
      .returning();

    if (!deletedSlide) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Slide deleted successfully',
      slide: deletedSlide 
    });
  } catch (error) {
    console.error('Error deleting homepage slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete slide' },
      { status: 500 }
    );
  }
}
