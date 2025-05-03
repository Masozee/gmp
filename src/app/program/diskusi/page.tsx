'use client'; // Add use client for state and effects

import React, { useState, useEffect } from 'react'; // Import hooks
import Link from 'next/link';
import Image from 'next/image';

// Remove require
// const pastEventsData = require('@/data/diskusi.json'); 

// Define interface for a single past event object
interface PastEvent {
  title: string;
  slug: string; // Changed from url to slug
  image: string;
  date: string;
  description: string; // Seems to be context/location
}

// Remove static data assertion
// const pastEvents = pastEventsData as PastEvent[];

const DiskusiPage = () => {
  const programTitle = "Diskusi Publik";
  const programHeroDescription = "Wadah diskusi terbuka membahas isu-isu politik terkini yang relevan bagi anak muda.";
  // Remove unused variable
  // const programHeroImage = "/images/program/hero-diskusi-placeholder.jpg"; 

  // Add state for events, loading, and errors
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch('/data/diskusi.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPastEvents(data as PastEvent[]); // Assume data matches the interface
      } catch (e) {
        console.error("Failed to load discussion events:", e);
        setError("Gagal memuat data diskusi.");
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);

  return (
    <>
      {/* Hero Section (General Program Info) */}
      <section 
        className="relative py-32 text-center bg-sky-500 text-white"
      >
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{programTitle}</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
            {programHeroDescription}
          </p>
        </div>
      </section>

      {/* Past Events List Section */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <h2 className="text-3xl font-bold mb-12 text-center text-primary">Dokumentasi Kegiatan</h2>
        
        {/* Handle Loading and Error States */}
        {isLoading && <div className="text-center">Memuat kegiatan...</div>}
        {error && <div className="text-center text-red-600">Error: {error}</div>}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">Belum ada dokumentasi kegiatan.</p>
            ) : (
              pastEvents.map((event, index) => (
                <Link key={index} href={`/program/diskusi/${event.slug}`} legacyBehavior>
                  <a className="block bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="relative w-full h-48">
                      <Image 
                        src={event.image} 
                        alt={event.title}
                        fill // Use fill instead of layout
                        style={{ objectFit: 'cover' }} // Add objectFit style
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{event.title}</h3> {/* Add line-clamp */}
                      <p className="text-sm text-gray-600 mb-1">{event.date}</p>
                      <p className="text-sm text-gray-700 mb-4 flex-grow line-clamp-3">{event.description}</p> {/* Add line-clamp */}
                      <span className="text-sm text-primary hover:text-primary-dark font-semibold mt-auto">
                        Lihat Detail →
                      </span>
                    </div>
                  </a>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DiskusiPage; 