import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { boardMembers, organizationStaff } from '@/lib/db/content-schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = parseInt(params.id);

    if (!type || (type !== 'board' && type !== 'staff')) {
      return NextResponse.json(
        { error: 'Type parameter is required and must be "board" or "staff"' },
        { status: 400 }
      );
    }

    let data;
    if (type === 'board') {
      const result = await db
        .select()
        .from(boardMembers)
        .where(eq(boardMembers.id, id));
      data = result[0];
    } else {
      const result = await db
        .select()
        .from(organizationStaff)
        .where(eq(organizationStaff.id, id));
      data = result[0];
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Pengurus not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching pengurus:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pengurus' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { type, name, position, bio, photo, email, socialMedia, order, isActive } = body;
    const id = parseInt(params.id);

    if (!type || (type !== 'board' && type !== 'staff')) {
      return NextResponse.json(
        { error: 'Type parameter is required and must be "board" or "staff"' },
        { status: 400 }
      );
    }

    let updatedData;
    if (type === 'board') {
      const result = await db
        .update(boardMembers)
        .set({
          name,
          position,
          bio,
          photo,
          order: order || 0,
          isActive: isActive ?? true,
          updatedAt: new Date().toISOString()
        })
        .where(eq(boardMembers.id, id))
        .returning();
      updatedData = result[0];
    } else {
      const result = await db
        .update(organizationStaff)
        .set({
          name,
          position,
          bio,
          photo,
          email,
          socialMedia: socialMedia ? JSON.stringify(socialMedia) : null,
          order: order || 0,
          isActive: isActive ?? true,
          updatedAt: new Date().toISOString()
        })
        .where(eq(organizationStaff.id, id))
        .returning();
      updatedData = result[0];
    }

    if (!updatedData) {
      return NextResponse.json(
        { error: 'Pengurus not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Error updating pengurus:', error);
    return NextResponse.json(
      { error: 'Failed to update pengurus' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = parseInt(params.id);

    if (!type || (type !== 'board' && type !== 'staff')) {
      return NextResponse.json(
        { error: 'Type parameter is required and must be "board" or "staff"' },
        { status: 400 }
      );
    }

    let deletedData;
    if (type === 'board') {
      const result = await db
        .delete(boardMembers)
        .where(eq(boardMembers.id, id))
        .returning();
      deletedData = result[0];
    } else {
      const result = await db
        .delete(organizationStaff)
        .where(eq(organizationStaff.id, id))
        .returning();
      deletedData = result[0];
    }

    if (!deletedData) {
      return NextResponse.json(
        { error: 'Pengurus not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Pengurus deleted successfully' });
  } catch (error) {
    console.error('Error deleting pengurus:', error);
    return NextResponse.json(
      { error: 'Failed to delete pengurus' },
      { status: 500 }
    );
  }
}