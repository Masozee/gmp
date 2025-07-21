'use client';

import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamic import for client-side only components
const ReportInteractiveMap = dynamic(() => import('../../components/ReportInteractiveMap'), {
  ssr: false,
  loading: () => (
    <section className="relative w-full h-screen overflow-hidden bg-gray-100">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
          <p className="text-gray-500">Loading interactive map...</p>
        </div>
      </div>
    </section>
  )
});

const CivicSpacePage = () => {

  // Single publication data
  const publication = {
    id: 1,
    title: 'Understanding Youth Engagement and Civic Space in Indonesia',
    description: 'This study investigates how young Indonesians (ages 18-25) navigate shrinking civic space, including their perceptions of safe and youth-friendly public spaces, the challenges they face in accessing them, and their views on government responsiveness. By analyzing both politically engaged youth and those outside formal activism, this research offers a comprehensive understanding of how democratic backsliding is lived, interpreted, and resisted at the grassroots level.',
    image: '/images/bg/creative-christians-HN6uXG7GzTE-unsplash.jpg',
    link: '#',
    date: 'May 2025',
  };

  return (
    <>
      {/* Hero Section with Pink Background */}
      <section className="bg-[#f06d98] py-32 text-white">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl font-heading">
            Civic Space & Impact
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Exploring the impact and reach of Generasi Melek Politik programs across Indonesia.
          </p>
        </div>
      </section>

      {/* Full Screen Interactive Map */}
      <ReportInteractiveMap />

      {/* Single Publication Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-extrabold text-center mb-12 font-heading">Our Publications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] w-full">
              <Image 
                src={publication.image} 
                alt={publication.title} 
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <p className="text-sm text-[#f06d98] mb-2">{publication.date}</p>
              <h3 className="text-3xl font-extrabold mb-4">{publication.title}</h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">{publication.description}</p>
              <a 
                href={publication.link} 
                className="inline-flex items-center text-[#f06d98] hover:text-[#f06d98]/80 font-medium text-lg"
              >
                Read More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CivicSpacePage;