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

// --- Metadata is static for this page, keep it outside the component ---
// export const metadata = {
//   title: 'Publications | Partisipasi Muda',
//   description: 'Collection of publications from Partisipasi Muda (Generasi Melek Politik).',
// };
// If you need dynamic metadata based on filters, this needs adjustment, but likely not needed for list page


export default function PublicationsPage() {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'article', 'survey'

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Articles', value: 'artikel' },
    { label: 'Research', value: 'riset' },
    { label: 'Impact', value: 'dampak' },
  ];

  const filteredPublications = publications.filter((pub) => {
    if (activeFilter === 'all') return true;
    return pub.type.toLowerCase() === activeFilter;
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
        {/* Filter Buttons */}
        <div className="mb-8 flex justify-center space-x-2 md:space-x-4">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={activeFilter === option.value ? 'default' : 'outline'}
              onClick={() => setActiveFilter(option.value)}
              className="transition-colors duration-200"
            >
              {option.label}
            </Button>
          ))}
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
                    
                    {/* Title second (as a link) */}
                    <Link href={`/en/publications/${slug}`}>
                      <h2 className="mb-3 line-clamp-2 text-lg font-semibold text-white group-hover:text-black hover:underline" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
                        {pub.title}
                      </h2>
                    </Link>
                    
                    {/* Content snippet */}
                    <p className="mb-3 text-sm text-white line-clamp-3 group-hover:text-black">
                      {pub.content.substring(0, 150)}...
                    </p>
                    
                    <div className="flex justify-between items-center">
                      {/* Date third */}
                      <p className="text-xs text-white group-hover:text-black">{pub.date}</p>
                      
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
              No publications match this filter.
            </p>
          )}
        </div>
      </section>
    </>
  );
} 