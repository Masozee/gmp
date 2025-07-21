'use client'; // Need client component for state

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { slugify } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button

// Define type (can be shared or redefined here)
interface Publication {
  id: number;
  title: string;
  title_en: string | null;
  url: string;
  slug_en: string | null;
  date: string;
  count: string;
  image: string | null;
  type: string; // Used for filtering
  pdf_url: string | null;
  author: string;
  author_en: string | null;
  order: number;
  content: string;
  content_en: string | null;
  description: string | null;
  description_en: string | null;
}

// Helper function to format dates as "05 Juni 2025" style
function formatPublicationDate(dateString: string): string {
  if (!dateString) return '';
  
  // Indonesian month names
  const indonesianMonths: { [key: number]: string } = {
    0: 'Januari', 1: 'Februari', 2: 'Maret', 3: 'April',
    4: 'Mei', 5: 'Juni', 6: 'Juli', 7: 'Agustus',
    8: 'September', 9: 'Oktober', 10: 'November', 11: 'Desember'
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
  
  // Format as "05 Juni 2025" style
  const day = date.getDate().toString().padStart(2, '0');
  const month = indonesianMonths[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

// --- Metadata is static for this page, keep it outside the component ---
// export const metadata = {
//   title: 'Publikasi | Partisipasi Muda',
//   description: 'Kumpulan publikasi dari Partisipasi Muda (Generasi Melek Politik).',
// };
// If you need dynamic metadata based on filters, this needs adjustment, but likely not needed for list page


export default function PublikasiPage() {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'article', 'survey'
  const [searchQuery, setSearchQuery] = useState('');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  const filterOptions = [
    { label: 'Semua', value: 'all' },
    { label: 'Artikel', value: 'artikel' },
    { label: 'Riset', value: 'riset' },
    { label: 'Dampak', value: 'dampak' },
  ];

  // Fetch publications from API
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('/api/publikasi');
        if (!response.ok) {
          throw new Error('Failed to fetch publications');
        }
        const data = await response.json();
        setPublications(data);
      } catch (error) {
        console.error('Error fetching publications:', error);
        setPublications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  const filteredPublications = publications.filter((pub: Publication) => {
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
      <section className="py-32 text-white" style={{backgroundColor: 'var(--success)'}}>
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl !text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
            Publikasi Kami
          </h1>
          <p className="text-lg !text-white">
            Jelajahi artikel, laporan, dan hasil survei dari Partisipasi Muda.
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:border-transparent bg-white cursor-pointer"
              style={{'--tw-ring-color': 'var(--success)'} as React.CSSProperties}
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
              placeholder="Cari publikasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{'--tw-ring-color': 'var(--success)'} as React.CSSProperties}
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
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="block overflow-hidden rounded-2xl shadow-lg bg-gray-200 animate-pulse">
                <div className="h-48 w-full bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2 w-16"></div>
                  <div className="h-6 bg-gray-300 rounded mb-3 w-full"></div>
                  <div className="h-4 bg-gray-300 rounded mb-1 w-full"></div>
                  <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-gray-300 rounded w-20"></div>
                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredPublications.length > 0 ? (
            filteredPublications.map((pub: Publication) => {
              const slug = slugify(pub.title);
              return (
                <div 
                  key={slug} 
                  className="flex flex-col overflow-hidden rounded-2xl shadow-lg bg-[#f06d98] transition-all duration-300 hover:bg-[#ffe066] hover:shadow-xl active:bg-[#ffe066] focus:bg-[#ffe066] group"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    {pub.image ? (
                      <Image
                        src={pub.image}
                        alt={pub.title}
                        layout="fill"
                        objectFit="cover"
                        unoptimized
                        className=""
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col h-full">
                    {/* Category first */}
                    <span className="mb-2 inline-block rounded bg-[#ffe066] px-2 py-1 text-xs font-medium text-black group-hover:bg-[#f06d98] group-hover:text-white w-fit">
                      {pub.type.charAt(0).toUpperCase() + pub.type.slice(1)}
                    </span>
                    
                    {/* Title second (as a link) */}
                    <Link href={`/publikasi/${slug}`}>
                      <h1 className=" text-lg font-semibold text-white group-hover:text-white hover:underline" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
                        {pub.title}
                      </h1>
                    </Link>
                    
                    {/* Date and view count at bottom - always at bottom */}
                    <div className="mt-auto pt-4 border-t border-white/20 group-hover:border-white/20">
                      <div className="flex justify-between items-center text-xs">
                        {/* Date - formatted as dd/mmmm/yyyy */}
                        <p className="text-white group-hover:text-white">{formatPublicationDate(pub.date)}</p>
                        
                        {/* View counter */}
                        <div>
                          <span className="inline-flex items-center text-white group-hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-white group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {pub.count} kali dilihat
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Tidak ada publikasi yang cocok dengan filter ini.
            </p>
          )}
        </div>
      </section>
    </>
  );
} 