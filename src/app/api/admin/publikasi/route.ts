import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, db } from '@/lib/db';
import { publications } from '@/lib/db/content-schema';
import { getSessionUser } from '@/lib/auth-utils';
import { eq, desc, asc } from 'drizzle-orm';

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

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// GET - List all publications
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allPublications = await db.select().from(publications).orderBy(asc(publications.order));
    
    return NextResponse.json({ 
      success: true, 
      data: allPublications 
    });
  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json({ error: 'Failed to fetch publications' }, { status: 500 });
  }
}

// POST - Create new publication
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'date', 'type', 'author', 'content', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Generate slug if not provided
    const slug = body.slug || generateSlug(body.title);

    // Check if slug already exists
    const existingPublication = await db.select().from(publications).where(eq(publications.slug, slug));
    if (existingPublication.length > 0) {
      return NextResponse.json({ error: 'A publication with this slug already exists' }, { status: 400 });
    }

    // Get the highest order number and increment
    const lastPublication = await db.select({ order: publications.order }).from(publications).orderBy(desc(publications.order)).limit(1);
    const nextOrder = (lastPublication[0]?.order || 0) + 1;

    const newPublication = await db.insert(publications).values({
      slug,
      title: body.title,
      date: body.date,
      count: body.count || '0',
      image_url: body.image_url,
      type: body.type,
      pdf_url: body.pdf_url,
      author: body.author,
      description: body.description,
      order: body.order || nextOrder,
      content: body.content,
    }).returning();

    return NextResponse.json({ 
      success: true, 
      data: newPublication[0] 
    });
  } catch (error) {
    console.error('Error creating publication:', error);
    return NextResponse.json({ error: 'Failed to create publication' }, { status: 500 });
  }
}

// PUT - Update publication
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Publication ID is required' }, { status: 400 });
    }

    // If slug is being updated, check for conflicts
    if (updateData.slug) {
      const existingPublication = await db.select().from(publications)
        .where(eq(publications.slug, updateData.slug));
      
      if (existingPublication.length > 0 && existingPublication[0].id !== id) {
        return NextResponse.json({ error: 'A publication with this slug already exists' }, { status: 400 });
      }
    }

    const updatedPublication = await db.update(publications)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(publications.id, id))
      .returning();

    if (updatedPublication.length === 0) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedPublication[0] 
    });
  } catch (error) {
    console.error('Error updating publication:', error);
    return NextResponse.json({ error: 'Failed to update publication' }, { status: 500 });
  }
} 