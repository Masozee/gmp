'use client'; // Need client component for state

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import publicationsData from '@/data/publikasi.json';
import { slugify } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button

// Define type (can be shared or redefined here)
interface Publication {
  title: string;
  url: string;
  date: string;
  count: string;
  image: string | null;
  type: string; // Used for filtering
  pdf_url: string | null;
  content: string;
}

const publications: Publication[] = publicationsData as Publication[];

// Helper function to format dates as "05 June 2025" style
function formatPublicationDate(dateString: string): string {
  if (!dateString) return '';
  
  // English month names
  const englishMonths: { [key: number]: string } = {
    0: 'January', 1: 'February', 2: 'March', 3: 'April',
    4: 'May', 5: 'June', 6: 'July', 7: 'August',
    8: 'September', 9: 'October', 10: 'November', 11: 'December'
  };
  
  let date: Date;
  
  // Handle DD/MM/YYYY format
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    date = new Date(year, month - 1, day); // Month is 0-indexed in JS Date
  } else {
    // Fallback to default parsing
    date = new Date(dateString);
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return original if parsing fails
  }
  
  // Format as "05 June 2025" style
  const day = date.getDate().toString().padStart(2, '0');
  const month = englishMonths[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

// --- Metadata is static for this page, keep it outside the component ---
// export const metadata = {
//   title: 'Publications | Partisipasi Muda',
//   description: 'Collection of publications from Partisipasi Muda (Generasi Melek Politik).',
// };
// If you need dynamic metadata based on filters, this needs adjustment, but likely not needed for list page


export default function PublicationsPage() {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'article', 'survey'
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Articles', value: 'artikel' },
    { label: 'Research', value: 'riset' },
    { label: 'Impact', value: 'dampak' },
  ];

  const filteredPublications = publications.filter((pub) => {
    // Filter by type
    const typeMatch = activeFilter === 'all' || pub.type.toLowerCase() === activeFilter;
    
    // Filter by search query
    const searchMatch = searchQuery === '' || 
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      pub.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && searchMatch;
  });

  return (
    <>
      {/* Hero Section */}
      <section className="bg-green-500 py-32 text-white">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
            Our Publications
          </h1>
          <p className="text-lg text-white">
            Explore articles, reports, and survey results from Partisipasi Muda.
          </p>
        </div>
      </section>

      {/* Main Content Section with Filters */}
      <section className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Search and Filter Row */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Filter Dropdown */}
          <div className="relative w-full md:w-48 order-2 md:order-1">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative flex-grow max-w-full md:max-w-md order-1 md:order-2">
            <input
              type="text"
              placeholder="Search publications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Publication Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPublications.length > 0 ? (
            filteredPublications.map((pub) => {
              const slug = slugify(pub.title);
              return (
                <div 
                  key={slug} 
                  className="block overflow-hidden rounded-2xl shadow-lg bg-[#f06d98] transition-all duration-300 hover:bg-[#ffe066] hover:shadow-xl hover:-translate-y-1 active:bg-[#ffe066] focus:bg-[#ffe066] group"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    {pub.image ? (
                      <Image
                        src={pub.image}
                        alt={pub.title}
                        layout="fill"
                        objectFit="cover"
                        unoptimized
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {/* Category first */}
                    <span className="mb-2 inline-block rounded bg-[#ffe066] px-2 py-0.5 text-xs font-medium text-black group-hover:bg-[#f06d98] group-hover:text-white">
                      {pub.type.charAt(0).toUpperCase() + pub.type.slice(1)}
                    </span>
                    
                    {/* Title second (as a link) - removed line-clamp-2 to show full title */}
                    <Link href={`/en/publications/${slug}`}>
                      <h2 className="mb-3 text-lg font-semibold text-white group-hover:text-black hover:underline" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
                        {pub.title}
                      </h2>
                    </Link>
                    
                    {/* Content snippet */}
                    <p className="mb-3 text-sm text-white line-clamp-3 group-hover:text-black">
                      {pub.content.substring(0, 150)}...
                    </p>
                    
                    <div className="flex justify-between items-center">
                      {/* Date third - formatted as dd/mmmm/yyyy */}
                      <p className="text-xs text-white group-hover:text-black">{formatPublicationDate(pub.date)}</p>
                      
                      {/* View counter fourth */}
                      <div className="text-xs text-white group-hover:text-black">
                        <span className="inline-flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {pub.count} views
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No publications match your search criteria.
            </p>
          )}
        </div>
      </section>
    </>
  );
} 