import { NextRequest, NextResponse } from 'next/server';
import { db, researchAttributes } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const attributes = await db.select().from(researchAttributes);
    
    return NextResponse.json(attributes);
  } catch (error) {
    console.error('Error fetching research attributes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch research attributes' },
      { status: 500 }
    );
  }
}