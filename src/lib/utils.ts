import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

const monthMap: { [key: string]: string } = {
  januari: 'January',
  februari: 'February',
  maret: 'March',
  april: 'April',
  mei: 'May',
  juni: 'June',
  juli: 'July',
  agustus: 'August',
  september: 'September',
  oktober: 'October',
  november: 'November',
  desember: 'December',
};

const indonesianMonths: { [key: number]: string } = {
  0: 'Januari',
  1: 'Februari',
  2: 'Maret',
  3: 'April',
  4: 'Mei',
  5: 'Juni',
  6: 'Juli',
  7: 'Agustus',
  8: 'September',
  9: 'Oktober',
  10: 'November',
  11: 'Desember'
};

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  let date: Date;
  
  // Handle DD/MM/YYYY format
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/').map(part => parseInt(part, 10));
    date = new Date(year, month - 1, day); // Month is 0-indexed in JS Date
  } 
  // Handle "DD Month YYYY" format
  else if (dateString.includes(' ')) {
    const parts = dateString.split(' ');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const monthName = parts[1].toLowerCase();
      const year = parseInt(parts[2], 10);
      const monthIndex = Object.keys(monthMap).indexOf(monthName);
      
      if (!isNaN(day) && !isNaN(year) && monthIndex !== -1) {
        date = new Date(year, monthIndex, day);
      } else {
        return dateString; // Return original if parsing fails
      }
    } else {
      return dateString; // Return original if format doesn't match
    }
  } 
  // Try default parsing
  else {
    date = new Date(dateString);
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return original if parsing fails
  }
  
  // Format as DD/Month/YYYY in Indonesian
  const day = date.getDate().toString().padStart(2, '0');
  const month = indonesianMonths[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

export function parseIndonesianDate(dateString: string): Date | null {
  if (!dateString) return null;
  const parts = dateString.trim().split(' ');
  if (parts.length !== 3) return null;

  const day = parts[0];
  const monthName = parts[1].toLowerCase();
  const year = parts[2];

  const englishMonth = monthMap[monthName];

  if (!englishMonth) return null; // Month name not recognized

  // Attempt to create a date object from the parsed parts
  const parsedDate = new Date(`${englishMonth} ${day}, ${year}`);

  // Check if the resulting date is valid
  if (isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}
