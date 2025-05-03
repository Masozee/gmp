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
