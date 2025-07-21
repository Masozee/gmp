import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { programs } from '@/lib/db/content-schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const programsData = await db
      .select()
      .from(programs)
      .orderBy(programs.order, desc(programs.createdAt));

    return NextResponse.json({
      success: true,
      programs: programsData
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      titleEn,
      subtitle,
      subtitleEn,
      description,
      descriptionEn,
      slug,
      heroImage,
      content,
      contentEn,
      isActive,
      order
    } = body;

    // Validate required fields
    if (!title || !description || !slug) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and slug are required' },
        { status: 400 }
      );
    }

    const result = await db.insert(programs).values({
      title,
      titleEn,
      subtitle,
      subtitleEn,
      description,
      descriptionEn,
      slug,
      heroImage,
      content,
      contentEn,
      isActive: isActive ?? true,
      order: order ?? 0,
    });

    return NextResponse.json({
      success: true,
      message: 'Program created successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create program' },
      { status: 500 }
    );
  }
} 