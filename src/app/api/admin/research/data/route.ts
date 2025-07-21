import { NextRequest, NextResponse } from 'next/server';
import { db, researchData } from '@/lib/db';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '1000');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = db.select().from(researchData).orderBy(desc(researchData.id));
    
    if (limit > 0) {
      query = query.limit(limit).offset(offset);
    }
    
    const data = await query;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching research data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch research data' },
      { status: 500 }
    );
  }
}