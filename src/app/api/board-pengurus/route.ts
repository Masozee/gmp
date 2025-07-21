import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { boardMembers, organizationStaff } from '@/lib/db/content-schema';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Fetch active board members ordered by order then created date
    const boardMembersData = await db
      .select()
      .from(boardMembers)
      .where(eq(boardMembers.isActive, true))
      .orderBy(asc(boardMembers.order), asc(boardMembers.createdAt));

    // Fetch active organization staff ordered by order then created date
    const staffData = await db
      .select()
      .from(organizationStaff)
      .where(eq(organizationStaff.isActive, true))
      .orderBy(asc(organizationStaff.order), asc(organizationStaff.createdAt));

    // Format data for frontend
    const formattedBoardMembers = boardMembersData.map(member => ({
      id: member.id,
      name: member.name,
      position: member.position,
      title: member.position, // Compatibility with existing frontend
      photo: member.photo || '/images/team/default-avatar.jpg',
      bio: member.bio,
      order: member.order
    }));

    const formattedStaff = staffData.map(staff => ({
      id: staff.id,
      name: staff.name,
      position: staff.position,
      title: staff.position, // Compatibility with existing frontend
      photo: staff.photo || '/images/team/default-avatar.jpg',
      bio: staff.bio,
      email: staff.email,
      socialMedia: staff.socialMedia ? JSON.parse(staff.socialMedia) : {},
      order: staff.order
    }));

    return NextResponse.json({
      boardMembers: formattedBoardMembers,
      staff: formattedStaff
    });
  } catch (error) {
    console.error('Error fetching board and pengurus data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch board and pengurus data' },
      { status: 500 }
    );
  }
}