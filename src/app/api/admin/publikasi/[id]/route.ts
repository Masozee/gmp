import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, db } from '@/lib/db';
import { publications } from '@/lib/db/content-schema';
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

// GET - Get single publication
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid publication ID' }, { status: 400 });
    }

    const publication = await db.select().from(publications).where(eq(publications.id, id));
    
    if (publication.length === 0) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: publication[0] 
    });
  } catch (error) {
    console.error('Error fetching publication:', error);
    return NextResponse.json({ error: 'Failed to fetch publication' }, { status: 500 });
  }
}

// PUT - Update publication
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid publication ID' }, { status: 400 });
    }

    const body = await request.json();
    const {
      title,
      title_en,
      slug,
      slug_en,
      type,
      author,
      author_en,
      date,
      description,
      description_en,
      content,
      content_en,
      image_url,
      pdf_url,
      order
    } = body;

    // Validate required fields
    if (!title || !slug || !type || !author || !date || !content) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, slug, type, author, date, content' 
      }, { status: 400 });
    }

    const updateData = {
      title,
      slug,
      type,
      author,
      date,
      description: description || '',
      content,
      image_url: image_url || null,
      pdf_url: pdf_url || null,
      order: order || 1,
      updatedAt: new Date().toISOString(),
      // English fields (optional)
      title_en: title_en || null,
      slug_en: slug_en || null,
      author_en: author_en || null,
      description_en: description_en || null,
      content_en: content_en || null,
    };

    const updatedPublication = await db.update(publications)
      .set(updateData)
      .where(eq(publications.id, id))
      .returning();

    if (updatedPublication.length === 0) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedPublication[0],
      message: 'Publication updated successfully' 
    });
  } catch (error) {
    console.error('Error updating publication:', error);
    return NextResponse.json({ error: 'Failed to update publication' }, { status: 500 });
  }
}

// DELETE - Delete publication
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid publication ID' }, { status: 400 });
    }

    const deletedPublication = await db.delete(publications)
      .where(eq(publications.id, id))
      .returning();

    if (deletedPublication.length === 0) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Publication deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting publication:', error);
    return NextResponse.json({ error: 'Failed to delete publication' }, { status: 500 });
  }
} 