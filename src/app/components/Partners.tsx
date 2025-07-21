'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface Partner {
  id: number;
  order: number;
  name: string;
  logo: string;
  url: string | null;
}

interface PartnersProps {
  partners?: Partner[];
}

const Partners = ({ partners: propPartners }: PartnersProps) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  // Use provided partners or fetch from API as fallback
  useEffect(() => {
    if (propPartners && propPartners.length > 0) {
      setPartners(propPartners);
      setLoading(false);
    } else {
      const fetchPartners = async () => {
        try {
          const response = await fetch('/api/content/partners');
          if (response.ok) {
            const data = await response.json();
            setPartners(data.partners || []);
          }
        } catch (error) {
          console.error('Failed to fetch partners:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPartners();
    }
  }, [propPartners]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Auto slide functionality with infinite loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current && slideRef.current && partners.length > 0) {
        const nextIndex = (currentIndex + 1) % partners.length;
        setCurrentIndex(nextIndex);
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

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Always enable arrows for infinite scroll
  useEffect(() => {
    setCanScrollLeft(partners.length > 1);
    setCanScrollRight(partners.length > 1);
  }, [partners]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && partners.length > 1) {
      scrollRight();
    }
    if (isRightSwipe && partners.length > 1) {
      scrollLeft();
    }
  };

  // Navigation functions
  const scrollLeft = () => {
    if (containerRef.current && slideRef.current && partners.length > 0) {
      const newIndex = currentIndex === 0 ? partners.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
    }
  };

  const scrollRight = () => {
    if (containerRef.current && slideRef.current && partners.length > 0) {
      const newIndex = currentIndex === partners.length - 1 ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-white text-gray-900 rounded-b-[40px]">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-center text-xl md:text-2xl font-bold mb-8">Mitra Strategis</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[140px] h-[140px] bg-gray-200 animate-pulse rounded" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white text-gray-900 rounded-b-[40px]">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-center text-xl md:text-2xl font-bold mb-8">Mitra Strategis</h2>
        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 mr-4 ${
              canScrollLeft 
                ? 'hover:bg-gray-50 hover:shadow-xl text-gray-700 hover:text-gray-900' 
                : 'opacity-50 cursor-not-allowed text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div 
            ref={containerRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
          {partners.map((partner, index) => {
            const PartnerContent = (
              <Image 
                src={partner.logo} 
                alt={`${partner.name} logo`} 
                width={180} 
                height={180} 
                className="object-contain grayscale hover:grayscale-0 transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: '140px',
                  maxWidth: '140px',
                  width: '100%',
                  height: 'auto'
                }}
              />
            );

            return (
              <div 
                key={partner.id}
                className="flex-shrink-0 snap-center"
                ref={index === 0 ? slideRef : null}
              >
                {partner.url ? (
                  <Link 
                    href={partner.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {PartnerContent}
                  </Link>
                ) : (
                  PartnerContent
                )}
              </div>
            );
          })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 ml-4 ${
              canScrollRight 
                ? 'hover:bg-gray-50 hover:shadow-xl text-gray-700 hover:text-gray-900' 
                : 'opacity-50 cursor-not-allowed text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Partners; 