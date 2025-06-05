import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper function to parse Indonesian dates
const monthMap: { [key: string]: number } = {
  Januari: 0, Februari: 1, Maret: 2, April: 3, Mei: 4, Juni: 5,
  Juli: 6, Agustus: 7, September: 8, Oktober: 9, November: 10, Desember: 11
};

interface Publikasi {
  id: string;
  title: string;
  url: string;
  date: string;
  count: string;
  image: string;
  type: string;
  pdf_url: string | null;
  author: string;
  order: number;
  content: string;
}

// Parse date in multiple formats
function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  
  // Handle DD/MM/YYYY format
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/').map(part => parseInt(part, 10));
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month - 1, day); // Month is 0-indexed in JS Date
    }
  }
  
  // Handle "DD Month YYYY" format with Indonesian month names
  if (dateString.includes(' ')) {
    const parts = dateString.split(' ');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const monthName = parts[1];
      const year = parseInt(parts[2], 10);
      const month = monthMap[monthName];

      if (!isNaN(day) && !isNaN(year) && month !== undefined) {
        return new Date(year, month, day);
      }
    }
  }
  
  // Fallback to default parsing
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
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
        const parsedDate = parseDate(item.date);
        if (!parsedDate) {
          console.warn(`Could not parse date: ${item.date} for publication: ${item.title}`);
          return null;
        }
        return {
          data: item,
          timestamp: parsedDate.getTime()
        };
      })
      .filter((item): item is { data: Publikasi; timestamp: number } => item !== null);
    
    // First try to sort by order field if available
    if (publikasiWithDates.length > 0 && publikasiWithDates[0].data.order !== undefined) {
      const sortedByOrder = [...publikasiWithDates]
        .sort((a, b) => (a.data.order || 999) - (b.data.order || 999))
        .slice(0, 3)
        .map(item => item.data);
      
      return NextResponse.json(sortedByOrder);
    }
    
    // Fallback to date sorting if order is not available
    const sortedByDate = publikasiWithDates
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3)
      .map(item => item.data);

    return NextResponse.json(sortedByDate);
  } catch (error) {
    console.error("Failed to read or process publications:", error);
    return NextResponse.json({ error: 'Failed to fetch publikasi data' }, { status: 500 });
  }
} 