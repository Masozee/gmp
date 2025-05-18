'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface Partner {
  name: string;
  logo: string;
  url: string;
}

const Partners = () => {
  const partners: Partner[] = [
    {
      name: 'Universitas Bakrie',
      logo: '/images/partner/bakrie.png',
      url: 'https://bakrie.ac.id'
    },
    {
      name: 'Climate and Land Use Alliance',
      logo: '/images/partner/climate.png',
      url: 'https://www.climateandlandusealliance.org'
    },
    {
      name: 'Greenpeace',
      logo: '/images/partner/greenpeace.png',
      url: 'https://www.greenpeace.org'
    },
    {
      name: 'International Republican Institute',
      logo: '/images/partner/iri.png',
      url: 'https://www.iri.org'
    },
    {
      name: 'Greenpeace 2',
      logo: '/images/partner/greenpeace.png',
      url: 'https://www.greenpeace.org'
    },
    {
      name: 'International Republican Institute 2',
      logo: '/images/partner/iri.png',
      url: 'https://www.iri.org'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLAnchorElement>(null);

  // Auto slide functionality with infinite loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current && slideRef.current) {
        const slideWidth = slideRef.current.offsetWidth + 24; // width + gap (6 tailwind units = 24px)
        const nextIndex = (currentIndex + 1) % partners.length;
        
        setCurrentIndex(nextIndex);
        
        // If we're at the last item and about to loop back
        if (nextIndex === 0) {
          // Ensure smooth transition back to the beginning
          containerRef.current.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        }
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex, partners.length]);

  // Scroll to current partner when index changes
  useEffect(() => {
    if (containerRef.current && slideRef.current) {
      const slideWidth = slideRef.current.offsetWidth + 24; // width + gap
      containerRef.current.scrollTo({
        left: currentIndex * slideWidth,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  return (
    <section className="py-12 bg-white text-gray-900 rounded-b-[40px]">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-center text-xl md:text-2xl font-bold mb-8">Mitra Strategis</h2>
        <div 
          ref={containerRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {partners.map((partner, index) => (
            <Link 
              href={partner.url} 
              key={partner.name}
              target="_blank" 
              rel="noopener noreferrer" 
              className="group h-full flex-shrink-0 snap-center"
              ref={index === 0 ? slideRef : null}
            >
              <div className="bg-white w-48 h-48 md:w-56 md:h-56 rounded-lg hover:bg-gray-50 transition-all duration-300 flex flex-col items-center justify-center flex-shrink-0 snap-center">
                <div className="flex-1 flex items-center justify-center w-full py-4">
                  <Image 
                    src={partner.logo} 
                    alt={`${partner.name} logo`} 
                    width={180} 
                    height={180} 
                    className="object-contain transition-all group-hover:scale-105"
                    style={{
                      maxHeight: '140px',
                      maxWidth: '140px',
                      width: '100%',
                      height: 'auto'
                    }}
                  />
                </div>
                <span className="text-center font-medium text-gray-800 group-hover:text-primary transition text-sm mt-4">
                  {partner.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners; 