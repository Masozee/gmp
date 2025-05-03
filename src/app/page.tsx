// Remove 'use client' to make it a Server Component
// 'use client';

// Remove useEffect and useState imports
// import { useEffect, useState } from 'react';

// Import fs and path for reading file directly
import fs from 'fs';
import path from 'path';

// Import component and type (keep these)
import PublikasiTerbaru, { Publikasi } from './components/PublikasiTerbaru';

// Import other components (keep these)
import Hero from './components/Hero';
import MissionStatement from './components/MissionStatement';
import ParticipationInfo from './components/ParticipationInfo';
import EngagementBanner from './components/EngagementBanner';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import Partners from './components/Partners';
import NewsletterSignup from './components/NewsletterSignup';

// Helper function to parse Indonesian dates (keep this)
const monthMap: { [key: string]: number } = {
  Januari: 0, Februari: 1, Maret: 2, April: 3, Mei: 4, Juni: 5,
  Juli: 6, Agustus: 7, September: 8, Oktober: 9, November: 10, Desember: 11
};

function parseIndonesianDate(dateString: string): Date | null {
  if (!dateString) return null;
  const parts = dateString.split(' ');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const monthName = parts[1];
  const year = parseInt(parts[2], 10);
  const month = monthMap[monthName];

  if (isNaN(day) || isNaN(year) || month === undefined) return null;

  return new Date(year, month, day);
}

// Helper function to read and process publication data
function getLatestPublikasi(): Publikasi[] {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'publikasi.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const publikasiData = JSON.parse(jsonData);

    if (!Array.isArray(publikasiData)) {
      console.error('Error: publikasi.json does not contain a valid JSON array.');
      return [];
    }

    const sortedPublikasi = (publikasiData as Publikasi[])
      .map(p => ({ ...p, parsedDate: parseIndonesianDate(p.date) }))
      .filter(p => p.parsedDate !== null)
      .sort((a, b) => b.parsedDate!.getTime() - a.parsedDate!.getTime());

    return sortedPublikasi.slice(0, 3);

  } catch (error) {
    console.error("Failed to read or process publications:", error);
    return []; // Return empty array on error
  }
}

export default function Home() {
  // Remove state and useEffect
  // const [latestPublikasi, setLatestPublikasi] = useState<Publikasi[]>([]);
  // useEffect(() => { ... }, []);

  // Load data directly (runs on the server)
  const latestPublikasi = getLatestPublikasi();

  return (
    <main className="min-h-screen">
      <Hero />
      <MissionStatement />
      <ParticipationInfo />
      <EngagementBanner />
      {/* Pass data directly */}
      <PublikasiTerbaru publikasi={latestPublikasi} /> 
      <Partners />
      <TestimonialsCarousel />
      <NewsletterSignup />
    </main>
  );
}
