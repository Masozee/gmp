'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import for the map component to avoid SSR issues
const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
        <p className="text-gray-500">Loading interactive map...</p>
      </div>
    </div>
  )
});

interface Slide {
  id: number;
  type: 'map' | 'image';
  content?: {
    image?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
  };
}

const slides: Slide[] = [
  {
    id: 1,
    type: 'map'
  },
  {
    id: 2,
    type: 'image',
    content: {
      image: '/images/bg/creative-christians-HN6uXG7GzTE-unsplash.jpg',
      title: 'Membangun Generasi Pembawa Perubahan',
      subtitle: 'Yayasan Partisipasi Muda',
      description: 'Memberdayakan anak muda Indonesia untuk berpartisipasi aktif dalam demokrasi dan perumusan kebijakan publik melalui pendidikan politik yang menyenangkan dan relevan.',
      buttonText: 'Pelajari Lebih Lanjut',
      buttonLink: '/tentang-kami/tujuan'
    }
  },
  {
    id: 3,
    type: 'image',
    content: {
      image: '/images/bg/duy-pham-Cecb0_8Hx-o-unsplash.jpg',
      title: 'Academia Politica',
      subtitle: 'Generasi Melek Politik',
      description: 'Sebuah lokakarya berbasis role-playing yang membekali peserta dengan pemahaman mendalam tentang kepemimpinan, pembuatan kebijakan, dan advokasi iklim.',
      buttonText: 'Lihat Program Kami',
      buttonLink: '/program/academia-politica'
    }
  }
];

const VerticalSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasCompletedAllSlides, setHasCompletedAllSlides] = useState(false);
  const [isMouseInSlideshow, setIsMouseInSlideshow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);
  const isScrolling = useRef(false);

  const handleWheel = useCallback((e: WheelEvent) => {
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    
    // Only handle scroll if mouse is within the slideshow area AND slideshow is in view
    if (isMouseInSlideshow && rect.top <= 0 && rect.bottom > 0) {
      const now = Date.now();
      
      // Prevent multiple rapid scroll events (debounce)
      if (isScrolling.current || now - lastScrollTime.current < 800) {
        e.preventDefault();
        return;
      }
      
      lastScrollTime.current = now;
      isScrolling.current = true;
      
      // Reset scrolling flag after a delay
      setTimeout(() => {
        isScrolling.current = false;
      }, 800);
      
      if (e.deltaY > 0) {
        // Scrolling down
        if (currentSlide < slides.length - 1) {
          // Not on last slide - change to next slide and prevent normal scroll
          e.preventDefault();
          setCurrentSlide(prev => {
            const newSlide = prev + 1;
            if (newSlide === slides.length - 1) {
              setHasCompletedAllSlides(true);
            }
            return newSlide;
          });
        } else {
          // On last slide - allow scroll to continue to next section
          setHasCompletedAllSlides(true);
          // Don't prevent default, let the page scroll naturally to next section
        }
      } else {
        // Scrolling up
        if (currentSlide > 0) {
          // Not on first slide - change to previous slide and prevent normal scroll
          e.preventDefault();
          setCurrentSlide(prev => prev - 1);
          setHasCompletedAllSlides(false);
        } else {
          // On first slide - only allow scroll up if slideshow is at the very top
          if (rect.top < 0) {
            // Slideshow is partially scrolled, prevent scroll up to keep user in slideshow
            e.preventDefault();
          }
          // If rect.top >= 0, allow normal scroll up to go above slideshow
        }
      }
    }
  }, [currentSlide, isMouseInSlideshow]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    
    // Only handle keys when the slideshow is in view AND mouse is in slideshow
    if (isMouseInSlideshow && rect.top <= 0 && rect.bottom > 0) {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        if (currentSlide < slides.length - 1) {
          e.preventDefault();
          setCurrentSlide(prev => {
            const newSlide = prev + 1;
            if (newSlide === slides.length - 1) {
              setHasCompletedAllSlides(true);
            }
            return newSlide;
          });
        }
      } else if (e.key === 'ArrowUp') {
        if (currentSlide > 0) {
          e.preventDefault();
          setCurrentSlide(prev => prev - 1);
          setHasCompletedAllSlides(false);
        }
      }
    }
  }, [currentSlide, isMouseInSlideshow]);

  const handleMouseEnter = useCallback(() => {
    setIsMouseInSlideshow(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsMouseInSlideshow(false);
  }, []);

  useEffect(() => {
    // Use wheel event for better control
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleKeyDown]);

  const slideVariants = {
    enter: {
      opacity: 0,
      y: 50,
    },
    center: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -50,
    }
  };

  const renderSlideContent = (slide: Slide) => {
    if (slide.type === 'map') {
      return (
        <div className="w-full h-full">
          <InteractiveMap />
        </div>
      );
    }

    if (slide.type === 'image' && slide.content) {
      return (
        <div className="relative w-full h-full">
          <Image
            src={slide.content.image!}
            alt={slide.content.title || 'Slide image'}
            fill
            style={{ objectFit: 'cover' }}
            priority={slide.id === 1}
            quality={90}
          />
          <div 
            className="absolute inset-0" 
            style={{ 
              background: "linear-gradient(360deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.9) 100%)"
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-6 max-w-7xl text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {slide.content.subtitle && (
                  <p className="text-lg md:text-xl mb-2 text-primary font-semibold">
                    {slide.content.subtitle}
                  </p>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight !text-white">
                  {slide.content.title}
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto !text-white">
                  {slide.content.description}
                </p>
                {slide.content.buttonText && slide.content.buttonLink && (
                  <Link 
                    href={slide.content.buttonLink}
                    className="bg-primary text-black hover:bg-pink-500 hover:text-white px-8 py-3 rounded-full font-bold text-lg inline-block transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    {slide.content.buttonText}
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen overflow-hidden"
    >
      <div className="sticky top-0 w-full h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {renderSlideContent(slides[currentSlide])}
          </motion.div>
        </AnimatePresence>
        
        {/* Slide indicators */}
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-50">
          <div className="flex flex-col space-y-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  if (index === slides.length - 1) {
                    setHasCompletedAllSlides(true);
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white text-center"
          >
            <p className="text-sm mb-2 !text-white">
              {currentSlide === slides.length - 1 
                ? "Scroll untuk ke bagian selanjutnya" 
                : "Scroll untuk slide berikutnya"
              }
            </p>
            <div className="w-6 h-10 border-2 border-white rounded-full mx-auto relative">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white rounded-full absolute left-1/2 top-2 transform -translate-x-1/2"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VerticalSlideshow; 