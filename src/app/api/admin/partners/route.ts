import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, db } from '@/lib/db';
import { partners } from '@/lib/db/content-schema';
import { getSessionUser } from '@/lib/auth-utils';
import { asc } from 'drizzle-orm';

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

// GET - Fetch all partners
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allPartners = await db.select().from(partners).orderBy(asc(partners.order));

    return NextResponse.json({
      success: true,
      data: allPartners
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new partner
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const newPartner = await db.insert(partners).values({
      name: name.trim(),
      logo: logo.trim(),
      url: url?.trim() || null,
      order: parseInt(order),
    }).returning();

    return NextResponse.json({ 
      success: true, 
      data: newPartner[0] 
    });
  } catch (error) {
    console.error('Error creating partner:', error);
    
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