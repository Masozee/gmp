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

interface PublikasiWithParsedDate extends Publikasi {
  parsedDate: Date | null;
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

    const sortedPublikasi = publikasiData
      .map((p: Publikasi) => ({ 
        ...p, 
        parsedDate: parseIndonesianDate(p.date) 
      } as PublikasiWithParsedDate))
      .filter((p: PublikasiWithParsedDate) => p.parsedDate !== null)
      .sort((a: PublikasiWithParsedDate, b: PublikasiWithParsedDate) => 
        b.parsedDate!.getTime() - a.parsedDate!.getTime()
      )
      .slice(0, 3)
      .map(({ parsedDate, ...rest }: PublikasiWithParsedDate) => rest);

    return NextResponse.json(sortedPublikasi);
  } catch (error) {
    console.error("Failed to read or process publications:", error);
    return NextResponse.json({ error: 'Failed to fetch publikasi data' }, { status: 500 });
  }
} 