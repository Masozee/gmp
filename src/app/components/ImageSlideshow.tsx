'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Slide {
  image: string;
  description: string;
}

interface ImageSlideshowProps {
  slides: Slide[];
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Image */}
      <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
        <Image
          src={slides[currentSlide].image}
          alt={`Slide ${currentSlide + 1}`}
          fill
          className="object-cover"
        />
        {/* Description Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-6">
          <p className="text-lg text-white font-medium leading-relaxed">{slides[currentSlide].description}</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlideshow; 