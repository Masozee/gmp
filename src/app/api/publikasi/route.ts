import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper function to parse Indonesian dates
const monthMap: { [key: string]: number } = {
  Januari: 0, Februari: 1, Maret: 2, April: 3, Mei: 4, Juni: 5,
  Juli: 6, Agustus: 7, September: 8, Oktober: 9, November: 10, Desember: 11
};

interface Publikasi {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
  category: string;
  url: string;
}

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

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'publikasi.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const publikasiData = JSON.parse(jsonData);

    if (!Array.isArray(publikasiData)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 500 });
    }

    // Create objects with parsed dates for sorting
    const publikasiWithDates = publikasiData
      .map((item: Publikasi) => {
        const parsedDate = parseIndonesianDate(item.date);
        if (!parsedDate) return null;
        return {
          data: item,
          timestamp: parsedDate.getTime()
        };
      })
      .filter((item): item is { data: Publikasi; timestamp: number } => item !== null);
    
    // Sort by timestamp (descending) and take top 3
    const sortedData = publikasiWithDates
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3)
      .map(item => item.data);

    return NextResponse.json(sortedData);
  } catch (error) {
    console.error("Failed to read or process publications:", error);
    return NextResponse.json({ error: 'Failed to fetch publikasi data' }, { status: 500 });
  }
} 