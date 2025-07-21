import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { socialMediaSettings } from '@/lib/db/content-schema';
import { eq, asc } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema
const socialMediaSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Valid URL is required'),
  displayName: z.string().min(1, 'Display name is required'),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

// GET - Fetch all social media settings
export async function GET() {
  try {
    const settings = await db
      .select()
      .from(socialMediaSettings)
      .orderBy(asc(socialMediaSettings.order));

    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching social media settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social media settings' },
      { status: 500 }
    );
  }
}

// POST - Create new social media setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = socialMediaSchema.parse(body);

    const result = await db
      .insert(socialMediaSettings)
      .values({
        platform: validatedData.platform,
        url: validatedData.url,
        displayName: validatedData.displayName,
        isActive: validatedData.isActive,
        order: validatedData.order,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Social media setting created successfully'
    });
  } catch (error) {
    console.error('Error creating social media setting:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create social media setting' },
      { status: 500 }
    );
  }
} 