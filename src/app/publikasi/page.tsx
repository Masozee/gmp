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
//   title: 'Publikasi | Partisipasi Muda',
//   description: 'Kumpulan publikasi dari Partisipasi Muda (Generasi Melek Politik).',
// };
// If you need dynamic metadata based on filters, this needs adjustment, but likely not needed for list page


export default function PublikasiPage() {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'article', 'survey'

  const filterOptions = [
    { label: 'Semua', value: 'all' },
    { label: 'Artikel', value: 'artikel' },
    { label: 'Riset', value: 'riset' },
    { label: 'Dampak', value: 'dampak' },
  ];

  const filteredPublications = publications.filter((pub) => {
    if (activeFilter === 'all') return true;
    return pub.type.toLowerCase() === activeFilter;
  });

  return (
    <>
      {/* Hero Section */}
      <section className="bg-sky-500 py-32 text-white">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Publikasi Kami
          </h1>
          <p className="text-lg text-pink-100">
            Jelajahi artikel, laporan, dan hasil survei dari Partisipasi Muda.
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
                <Link 
                  key={slug} 
                  href={`/publikasi/${slug}`} 
                  className="block overflow-hidden rounded-2xl shadow-xl bg-[#f06d98] transition-all duration-300 hover:bg-[#ffe066] active:bg-[#ffe066] focus:bg-[#ffe066] group"
                >
                  <div className="relative h-48 w-full">
                    {pub.image ? (
                      <Image
                        src={pub.image}
                        alt={pub.title}
                        layout="fill"
                        objectFit="cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="mb-1 inline-block rounded bg-[#f06d98] px-2 py-0.5 text-xs font-medium text-white group-hover:bg-[#ffe066] group-hover:text-black group-active:bg-[#ffe066] group-active:text-black group-focus:bg-[#ffe066] group-focus:text-black">
                      {pub.type.charAt(0).toUpperCase() + pub.type.slice(1)}
                    </span>
                    <h2 className="mb-2 mt-1 line-clamp-2 text-lg font-semibold text-white group-hover:text-black group-active:text-black group-focus:text-black">
                      {pub.title}
                    </h2>
                    <p className="text-sm text-pink-100 group-hover:text-black group-active:text-black group-focus:text-black">{pub.date}</p>
                  </div>
                </Link>
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