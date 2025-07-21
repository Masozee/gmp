import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { socialMediaSettings } from '@/lib/db/content-schema';
import { eq, asc } from 'drizzle-orm';

// GET - Fetch active social media settings (public endpoint)
export async function GET() {
  try {
    const settings = await db
      .select({
        id: socialMediaSettings.id,
        platform: socialMediaSettings.platform,
        url: socialMediaSettings.url,
        displayName: socialMediaSettings.displayName,
        order: socialMediaSettings.order,
      })
      .from(socialMediaSettings)
      .where(eq(socialMediaSettings.isActive, true))
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