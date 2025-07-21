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

interface VerticalSlideshowProps {
  slides?: Slide[];
}

const VerticalSlideshow = ({ slides: propSlides }: VerticalSlideshowProps) => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasCompletedAllSlides, setHasCompletedAllSlides] = useState(false);
  const [isMouseInSlideshow, setIsMouseInSlideshow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);
  const isScrolling = useRef(false);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  
  // New scroll accumulation system
  const scrollAccumulator = useRef(0);
  const scrollThreshold = 80; // Minimum scroll distance to trigger slide change
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const resetAccumulatorTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    
    // Only handle scroll if mouse is within the slideshow area AND slideshow is in view
    if (isMouseInSlideshow && rect.top <= 0 && rect.bottom > 0) {
      const now = Date.now();
      
      // Prevent multiple rapid slide changes
      if (isScrolling.current) {
        e.preventDefault();
        return;
      }
      
      // Accumulate scroll delta
      scrollAccumulator.current += Math.abs(e.deltaY);
      
      // Clear previous timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Clear previous reset timeout
      if (resetAccumulatorTimeout.current) {
        clearTimeout(resetAccumulatorTimeout.current);
      }
      
            // Set timeout to process accumulated scroll
      scrollTimeout.current = setTimeout(() => {
        // Check if accumulated scroll exceeds threshold
        if (scrollAccumulator.current >= scrollThreshold) {
          const direction = e.deltaY > 0 ? 'down' : 'up';
          
          // Prevent rapid slide changes
          isScrolling.current = true;
          lastScrollTime.current = now;
          
          // Reset scrolling flag after delay
          setTimeout(() => {
            isScrolling.current = false;
          }, 600);
          
          if (direction === 'down') {
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
              // Reset accumulator to allow natural scrolling
              scrollAccumulator.current = 0;
              return; // Exit early to allow natural scroll
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
              } else {
                // If rect.top >= 0, allow normal scroll up to go above slideshow
                scrollAccumulator.current = 0;
                return; // Exit early to allow natural scroll
              }
            }
          }
          
          // Reset accumulator after slide change
          scrollAccumulator.current = 0;
        } else {
          // If threshold not met, check if we should allow natural scrolling
          const direction = e.deltaY > 0 ? 'down' : 'up';
          
          // Allow natural scrolling on last slide (down) or first slide when at top (up)
          if ((direction === 'down' && currentSlide === slides.length - 1) || 
              (direction === 'up' && currentSlide === 0 && rect.top >= 0)) {
            scrollAccumulator.current = 0;
            return; // Exit early to allow natural scroll
          }
          
          // Otherwise prevent default and continue accumulating
          e.preventDefault();
          
          // Reset accumulator after a delay if no more scrolling
          resetAccumulatorTimeout.current = setTimeout(() => {
            scrollAccumulator.current = 0;
          }, 100);
        }
      }, 30); // Small delay to accumulate scroll events
      
      // Check if we should prevent default during accumulation
      const direction = e.deltaY > 0 ? 'down' : 'up';
      
      // Don't prevent default if we're on last slide scrolling down or first slide scrolling up at top
      if ((direction === 'down' && currentSlide === slides.length - 1) || 
          (direction === 'up' && currentSlide === 0 && rect.top >= 0)) {
        // Allow natural scrolling
        return;
      }
      
      // Otherwise prevent default during accumulation
      e.preventDefault();
    }
  }, [currentSlide, isMouseInSlideshow, slides.length]);

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

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const container = containerRef.current;
    if (!container || !isMobile) return;

    touchEndY.current = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 30; // Reduced for more responsive swiping

    // Prevent rapid swipes
    const now = Date.now();
    if (isScrolling.current || now - lastScrollTime.current < 600) { // Reduced timeout
      return;
    }

    if (Math.abs(deltaY) > minSwipeDistance) {
      lastScrollTime.current = now;
      isScrolling.current = true;

      setTimeout(() => {
        isScrolling.current = false;
      }, 600); // Reduced timeout

      if (deltaY > 0) {
        // Swiping up (next slide)
        if (currentSlide < slides.length - 1) {
          setCurrentSlide(prev => {
            const newSlide = prev + 1;
            if (newSlide === slides.length - 1) {
              setHasCompletedAllSlides(true);
            }
            return newSlide;
          });
        } else {
          setHasCompletedAllSlides(true);
        }
      } else {
        // Swiping down (previous slide)
        if (currentSlide > 0) {
          setCurrentSlide(prev => prev - 1);
          setHasCompletedAllSlides(false);
        }
      }
    }
  }, [currentSlide, isMobile, slides.length]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use provided slides or fetch from API as fallback
  useEffect(() => {
    if (propSlides && propSlides.length > 0) {
      setSlides(propSlides);
      setLoading(false);
    } else {
      const fetchSlides = async () => {
        try {
          const response = await fetch('/api/admin/homepage-slides');
          if (response.ok) {
            const data = await response.json();
            const activeSlides = data.slides
              .filter((slide: any) => slide.isActive)
              .sort((a: any, b: any) => a.order - b.order)
              .map((slide: any) => ({
                id: slide.id,
                type: slide.type,
                content: {
                  image: slide.image,
                  title: slide.title,
                  subtitle: slide.subtitle,
                  description: slide.description,
                  buttonText: slide.buttonText,
                  buttonLink: slide.buttonLink,
                },
              }));
            setSlides(activeSlides);
          }
        } catch (error) {
          console.error('Error fetching slides:', error);
          // Fallback to default slides if API fails
          setSlides([
            { 
              id: 1, 
              type: 'map',
              content: {
                image: '/images/report/pub-1.jpg',
                title: 'Understanding Youth Engagement and Civic Space in Indonesia',
                subtitle: 'Laporan Survei Keterlibatan Sipil Anak Muda',
                description: 'Jelajahi data survei tentang keterlibatan sipil anak muda Indonesia. Hover pada peta untuk melihat statistik per wilayah.',
                buttonText: 'Lihat Laporan Lengkap',
                buttonLink: '/ruang-sipil'
              }
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
            }
          ]);
        } finally {
          setLoading(false);
        }
      };

      fetchSlides();
    }
  }, [propSlides]);

  useEffect(() => {
    // Use wheel event for better control on desktop
    if (!isMobile) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }
    window.addEventListener('keydown', handleKeyDown);
    
    // Add touch events for mobile
    if (isMobile && containerRef.current) {
      const container = containerRef.current;
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        if (!isMobile) {
          window.removeEventListener('wheel', handleWheel);
        }
        window.removeEventListener('keydown', handleKeyDown);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
        
        // Clean up timeouts
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
        if (resetAccumulatorTimeout.current) {
          clearTimeout(resetAccumulatorTimeout.current);
        }
      };
    }
    
    return () => {
      if (!isMobile) {
        window.removeEventListener('wheel', handleWheel);
      }
      window.removeEventListener('keydown', handleKeyDown);
      
      // Clean up timeouts
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      if (resetAccumulatorTimeout.current) {
        clearTimeout(resetAccumulatorTimeout.current);
      }
    };
  }, [handleWheel, handleKeyDown, handleTouchStart, handleTouchEnd, isMobile]);

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
          <InteractiveMap cardContent={slide.content} />
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
                    className="bg-primary-dark hover:bg-[#e5b64e] text-[#4c3c1a] hover:text-[#4c3c1a] px-8 py-3 rounded-full font-bold text-lg inline-block transition duration-300 ease-in-out transform hover:scale-105"
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

  // Show loading state
  if (loading || slides.length === 0) {
    return (
      <section className="relative w-full h-screen overflow-hidden bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
            <p className="text-gray-500">Loading slideshow...</p>
          </div>
        </div>
      </section>
    );
  }

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
        
        {/* Slide indicators - responsive positioning */}
        <div className={`absolute z-50 ${
          isMobile 
            ? 'bottom-20 left-1/2 transform -translate-x-1/2' 
            : 'right-6 top-1/2 transform -translate-y-1/2'
        }`}>
          <div className={`flex space-y-3 ${isMobile ? 'flex-row space-x-3 space-y-0' : 'flex-col'}`}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  if (index === slides.length - 1) {
                    setHasCompletedAllSlides(true);
                  }
                }}
                className={`${isMobile ? 'w-5 h-5' : 'w-3 h-3'} rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                } ${isMobile ? 'touch-manipulation min-w-[20px] min-h-[20px]' : ''}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Scroll indicator - hide on mobile when indicators are at bottom */}
        {!isMobile && (
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
        )}

        {/* Mobile swipe indicator */}
        {isMobile && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <p className="text-xs text-white/80 text-center">
              {currentSlide === slides.length - 1 
                ? "Swipe up untuk ke bagian selanjutnya" 
                : "Swipe untuk slide berikutnya"
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VerticalSlideshow; 