import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { homepageSlides, partners, publications, events } from '@/lib/db/content-schema';
import { eq, desc, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Fetch homepage slides
    const slidesData = await db
      .select()
      .from(homepageSlides)
      .where(eq(homepageSlides.isActive, true))
      .orderBy(homepageSlides.order);

    // Transform slides data - include content for both image and map slides
    const slides = slidesData.map(slide => ({
      id: slide.id,
      type: slide.type,
      content: {
        image: slide.image,
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        buttonText: slide.buttonText,
        buttonLink: slide.buttonLink,
      },
    }));

    // Fetch partners
    const partnersData = await db
      .select()
      .from(partners)
      .orderBy(partners.order);

    // Fetch latest publications (limit to 3)
    const publikasiData = await db
      .select()
      .from(publications)
      .orderBy(desc(publications.createdAt))
      .limit(3);

    // Transform publikasi data
    const latestPublikasi = publikasiData.map(pub => ({
      title: pub.title,
      url: pub.slug,
      date: new Date(pub.createdAt).toLocaleDateString('id-ID') || '',
      category: pub.type,
      image: pub.image_url,
      content: pub.content || ''
    }));

    // Fetch upcoming events (limit to 3) - Get all events and filter in JavaScript
    const eventsData = await db
      .select()
      .from(events)
      .orderBy(events.date);

    // Filter and transform events data - get upcoming events only
    const today = new Date();
    const upcomingEvents = eventsData
      .filter(event => {
        if (!event.date) return false;
        // Parse Indonesian date format like "15 November 2024"
        const eventDate = parseIndonesianDate(event.date);
        return eventDate && eventDate >= today;
      })
      .slice(0, 3) // Limit to 3 events
      .map(event => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        address: event.address,
        description: event.description || '',
        en_description: event.enDescription || '',
        image: event.image || '/images/events/default-event.jpg',
        category: event.category || 'Event',
        registrationLink: '' // This field doesn't exist in the schema
      }));

    // Helper function to parse Indonesian dates
    function parseIndonesianDate(dateString: string): Date | null {
      if (!dateString) return null;
      
      // Handle range dates like "15-17 November 2024"
      if (dateString.includes('-')) {
        dateString = dateString.split('-')[0].trim();
      }
      
      const monthMap: { [key: string]: number } = {
        Januari: 0, Februari: 1, Maret: 2, April: 3, Mei: 4, Juni: 5,
        Juli: 6, Agustus: 7, September: 8, Oktober: 9, November: 10, Desember: 11
      };
      
      const parts = dateString.split(' ');
      if (parts.length !== 3) return null;
      
      const day = parseInt(parts[0], 10);
      const monthName = parts[1];
      const year = parseInt(parts[2], 10);
      const month = monthMap[monthName];
      
      if (isNaN(day) || isNaN(year) || month === undefined) return null;
      
      return new Date(year, month, day);
    }

    return NextResponse.json({
      success: true,
      data: {
        slides,
        partners: partnersData,
        latestPublikasi,
        upcomingEvents
      }
    });

  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch home data',
        data: {
          slides: [],
          partners: [],
          latestPublikasi: [],
          upcomingEvents: []
        }
      },
      { status: 500 }
    );
  }
} 