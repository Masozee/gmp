import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, db } from '@/lib/db';
import { partners } from '@/lib/db/content-schema';
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

// GET - Fetch single partner
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const partnerId = parseInt(params.id);
    if (isNaN(partnerId)) {
      return NextResponse.json({ error: 'Invalid partner ID' }, { status: 400 });
    }

    const partner = await db.select().from(partners).where(eq(partners.id, partnerId)).limit(1);

    if (partner.length === 0) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: partner[0]
    });
  } catch (error) {
    console.error('Error fetching partner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update partner
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const partnerId = parseInt(params.id);
    if (isNaN(partnerId)) {
      return NextResponse.json({ error: 'Invalid partner ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, logo, url, order } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!logo?.trim()) {
      return NextResponse.json({ error: 'Logo is required' }, { status: 400 });
    }

    if (!order || order <= 0) {
      return NextResponse.json({ error: 'Valid order is required' }, { status: 400 });
    }

    const updatedPartner = await db.update(partners)
      .set({
        name: name.trim(),
        logo: logo.trim(),
        url: url?.trim() || null,
        order: parseInt(order),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(partners.id, partnerId))
      .returning();

    if (updatedPartner.length === 0) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedPartner[0]
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    
    // Handle unique constraint violation for order
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'Order number already exists. Please use a different order number.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete partner
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const partnerId = parseInt(params.id);
    if (isNaN(partnerId)) {
      return NextResponse.json({ error: 'Invalid partner ID' }, { status: 400 });
    }

    const deletedPartner = await db.delete(partners)
      .where(eq(partners.id, partnerId))
      .returning();

    if (deletedPartner.length === 0) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Partner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 