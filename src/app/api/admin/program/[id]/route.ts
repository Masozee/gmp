import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { programs } from '@/lib/db/content-schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const programId = parseInt(params.id);
    
    const program = await db
      .select()
      .from(programs)
      .where(eq(programs.id, programId))
      .limit(1);

    if (program.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      program: program[0]
    });
  } catch (error) {
    console.error('Error fetching program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch program' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const programId = parseInt(params.id);
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

    const result = await db
      .update(programs)
      .set({
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
        updatedAt: new Date().toISOString(),
      })
      .where(eq(programs.id, programId));

    return NextResponse.json({
      success: true,
      message: 'Program updated successfully'
    });
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update program' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const programId = parseInt(params.id);

    const result = await db
      .delete(programs)
      .where(eq(programs.id, programId));

    return NextResponse.json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete program' },
      { status: 500 }
    );
  }
} 