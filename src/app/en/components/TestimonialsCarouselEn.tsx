'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import testimonialsData from '@/data/testimoni.json';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  age: number;
  school: string;
  image: string;
}

const TestimonialsCarouselEn = () => {
  const [testimonials] = useState<Testimonial[]>(testimonialsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  
  // Auto-scroll functionality wrapped in useCallback
  const startAutoScroll = useCallback(() => {
    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change slides every 5 seconds
  }, [testimonials.length]);
  
  useEffect(() => {
    startAutoScroll();
    
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [startAutoScroll]);
  
  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };
  
  const handleMouseLeave = () => {
    startAutoScroll();
  };

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    // Pause auto-scroll on touch
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) {
      // Resume auto-scroll
      startAutoScroll();
      return;
    }
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Swipe left - next slide
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }
    if (isRightSwipe) {
      // Swipe right - previous slide
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
    }

    // Resume auto-scroll after touch interaction
    setTimeout(() => {
      startAutoScroll();
    }, 1000);
  };
  
  // Get testimonials for current view (4 at a time, looping through all)
  const getVisibleTestimonials = () => {
    const visibleItems = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visibleItems.push(testimonials[index]);
    }
    return visibleItems;
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-main text-center">What Those Impacted Say</h2>
          
          <div 
            className="relative"
            ref={carouselRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {getVisibleTestimonials().map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="bg-white p-6 rounded-lg shadow-md h-full hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-center mb-4">
                    <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                      <Image 
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="rounded-full object-cover border-2 border-primary"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/testimonials/default-avatar.jpg';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.age} years old, {testimonial.school}</p>
                    </div>
                  </div>
                  
                  <div className="text-gray-700 text-sm flex-grow">
                    <svg className="w-5 h-5 text-primary mb-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                      <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
                    </svg>
                    <p className="italic">{testimonial.quote}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation dots */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => {
                // Group indicators by 4
                if (index % 4 === 0) {
                  const isActive = currentIndex >= index && currentIndex < index + 4;
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        isActive ? 'bg-primary w-5' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to testimonials ${index + 1}-${Math.min(index + 4, testimonials.length)}`}
                    />
                  );
                }
                return null;
              }).filter(Boolean)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarouselEn; 