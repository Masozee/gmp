import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { publications } from '@/lib/db/content-schema';
import { desc } from 'drizzle-orm';

interface Publikasi {
  id: number;
  title: string;
  title_en: string | null;
  url: string;
  slug_en: string | null;
  date: string;
  count: string;
  image: string | null;
  type: string;
  pdf_url: string | null;
  author: string;
  author_en: string | null;
  order: number;
  content: string;
  content_en: string | null;
  description: string | null;
  description_en: string | null;
}

export async function GET() {
  try {
    // Fetch all publications from database
    const publikasiData = await db
      .select()
      .from(publications)
      .orderBy(desc(publications.createdAt));

    // Transform data to match the expected interface
    const transformedData = publikasiData.map(pub => ({
      id: pub.id,
      title: pub.title,
      title_en: pub.title_en,
      url: pub.slug,
      slug_en: pub.slug_en,
      date: pub.date,
      count: pub.count,
      image: pub.image_url,
      type: pub.type,
      pdf_url: pub.pdf_url,
      author: pub.author,
      author_en: pub.author_en,
      order: pub.order,
      content: pub.content,
      content_en: pub.content_en,
      description: pub.description,
      description_en: pub.description_en
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Failed to fetch publications from database:", error);
    return NextResponse.json({ error: 'Failed to fetch publikasi data' }, { status: 500 });
  }
} 