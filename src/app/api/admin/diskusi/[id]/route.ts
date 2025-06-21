import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, db } from '@/lib/db';
import { discussions } from '@/lib/db/content-schema';
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

// GET - Get single discussion
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const discussionId = parseInt(id);

    if (isNaN(discussionId)) {
      return NextResponse.json({ error: 'Invalid discussion ID' }, { status: 400 });
    }

    const discussion = await db.select()
      .from(discussions)
      .where(eq(discussions.id, discussionId))
      .limit(1);

    if (discussion.length === 0) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: discussion[0] 
    });
  } catch (error) {
    console.error('Error fetching discussion:', error);
    return NextResponse.json({ error: 'Failed to fetch discussion' }, { status: 500 });
  }
}

// DELETE - Delete discussion
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const discussionId = parseInt(id);

    if (isNaN(discussionId)) {
      return NextResponse.json({ error: 'Invalid discussion ID' }, { status: 400 });
    }

    const deletedDiscussion = await db.delete(discussions)
      .where(eq(discussions.id, discussionId))
      .returning();

    if (deletedDiscussion.length === 0) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Discussion deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    return NextResponse.json({ error: 'Failed to delete discussion' }, { status: 500 });
  }
} 