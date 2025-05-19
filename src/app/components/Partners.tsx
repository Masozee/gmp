'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import partnersData from '../data/partners.json';

interface Partner {
  order: number;
  name: string;
  logo: string;
  url: string;
}

const Partners = () => {
  const partners: Partner[] = partnersData.partners;

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
              className="flex-shrink-0 snap-center"
              ref={index === 0 ? slideRef : null}
            >
              <Image 
                src={partner.logo} 
                alt={`${partner.name} logo`} 
                width={180} 
                height={180} 
                className="object-contain"
                style={{
                  maxHeight: '140px',
                  maxWidth: '140px',
                  width: '100%',
                  height: 'auto'
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners; 