import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { boardMembers, organizationStaff } from '@/lib/db/content-schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // 'board', 'staff', or 'all'

    let boardMembersData = [];
    let staffData = [];

    if (type === 'board' || type === 'all') {
      boardMembersData = await db
        .select()
        .from(boardMembers)
        .orderBy(desc(boardMembers.order), desc(boardMembers.createdAt));
    }

    if (type === 'staff' || type === 'all') {
      staffData = await db
        .select()
        .from(organizationStaff)
        .orderBy(desc(organizationStaff.order), desc(organizationStaff.createdAt));
    }

    // Combine and format data
    const combinedData = [
      ...boardMembersData.map(member => ({
        ...member,
        type: 'board' as const,
        department: 'Dewan Pengurus',
        email: '', // Board members don't have email in schema
        phone: '',
        location: '',
        joinDate: member.createdAt,
        status: member.isActive ? 'active' : 'inactive',
        socialMedia: {} // Board members don't have social media in schema
      })),
      ...staffData.map(staff => ({
        ...staff,
        type: 'staff' as const,
        department: 'Tim Manajemen',
        phone: '',
        location: '',
        joinDate: staff.createdAt,
        status: staff.isActive ? 'active' : 'inactive',
        socialMedia: staff.socialMedia ? JSON.parse(staff.socialMedia) : {}
      }))
    ];

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('Error fetching pengurus data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pengurus data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, position, bio, photo, email, socialMedia, order, isActive } = body;

    if (type === 'board') {
      const newBoardMember = await db
        .insert(boardMembers)
        .values({
          name,
          position,
          bio,
          photo,
          order: order || 0,
          isActive: isActive ?? true
        })
        .returning();

      return NextResponse.json(newBoardMember[0], { status: 201 });
    } else if (type === 'staff') {
      const newStaff = await db
        .insert(organizationStaff)
        .values({
          name,
          position,
          bio,
          photo,
          email,
          socialMedia: socialMedia ? JSON.stringify(socialMedia) : null,
          order: order || 0,
          isActive: isActive ?? true
        })
        .returning();

      return NextResponse.json(newStaff[0], { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "board" or "staff"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating pengurus:', error);
    return NextResponse.json(
      { error: 'Failed to create pengurus' },
      { status: 500 }
    );
  }
}