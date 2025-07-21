import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { socialMediaSettings } from '@/lib/db/content-schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema
const socialMediaUpdateSchema = z.object({
  platform: z.string().min(1, 'Platform is required').optional(),
  url: z.string().url('Valid URL is required').optional(),
  displayName: z.string().min(1, 'Display name is required').optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

// GET - Fetch specific social media setting
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const setting = await db
      .select()
      .from(socialMediaSettings)
      .where(eq(socialMediaSettings.id, id))
      .limit(1);

    if (setting.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Social media setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: setting[0]
    });
  } catch (error) {
    console.error('Error fetching social media setting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social media setting' },
      { status: 500 }
    );
  }
}

// PUT - Update social media setting
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = socialMediaUpdateSchema.parse(body);

    // Check if setting exists
    const existing = await db
      .select()
      .from(socialMediaSettings)
      .where(eq(socialMediaSettings.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Social media setting not found' },
        { status: 404 }
      );
    }

    // Update the setting
    const result = await db
      .update(socialMediaSettings)
      .set({
        ...validatedData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(socialMediaSettings.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Social media setting updated successfully'
    });
  } catch (error) {
    console.error('Error updating social media setting:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update social media setting' },
      { status: 500 }
    );
  }
}

// DELETE - Delete social media setting
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    // Check if setting exists
    const existing = await db
      .select()
      .from(socialMediaSettings)
      .where(eq(socialMediaSettings.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Social media setting not found' },
        { status: 404 }
      );
    }

    // Delete the setting
    await db
      .delete(socialMediaSettings)
      .where(eq(socialMediaSettings.id, id));

    return NextResponse.json({
      success: true,
      message: 'Social media setting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting social media setting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete social media setting' },
      { status: 500 }
    );
  }
} 