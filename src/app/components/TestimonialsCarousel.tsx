'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Through Partisipasi Muda's workshops, I finally understood how policies directly affect my daily life. Now I actively participate in local community discussions.",
    name: "Indira Putri",
    role: "Mahasiswa, Universitas Indonesia",
    image: "/images/testimonials/adriansyah.png"
  },
  {
    id: 2,
    quote: "The political literacy materials provided by Yayasan Partisipasi Muda are engaging and easy to understand. I've shared them with my entire campus community.",
    name: "Ahmad Rizal",
    role: "Aktivis Muda, Bandung",
    image: "/images/testimonials/alya.png"
  },
  {
    id: 3,
    quote: "Before attending these programs, I felt disconnected from politics. Now I see how every decision affects our future, and I'm motivated to make my voice heard.",
    name: "Siti Rahma",
    role: "Guru SMA, Surabaya",
    image: "/images/testimonials/jumpa.png"
  },
  {
    id: 4,
    quote: "The interactive approach to political education makes complex concepts accessible. I've gained confidence to engage in meaningful political discussions.",
    name: "Budi Santoso",
    role: "Pemilih Pemula, Jakarta",
    image: "/images/testimonials/kristina.png"
  },
  {
    id: 5,
    quote: "Participating in Partisipasi Muda's workshops changed my perspective on civic engagement. I now understand that my participation matters in shaping Indonesia's future.",
    name: "Maya Anggraini",
    role: "Penggerak Komunitas, Yogyakarta",
    image: "/images/testimonials/ridho.png"
  }
];

const TestimonialsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  
  const stopSlideTimer = useCallback(() => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = null;
    }
  }, []);

  const startSlideTimer = useCallback(() => {
    stopSlideTimer();
    slideInterval.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % testimonials.length);
    }, 5000);
  }, [stopSlideTimer]);

  useEffect(() => {
    startSlideTimer();
    return () => stopSlideTimer();
  }, [startSlideTimer, stopSlideTimer]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    startSlideTimer();
  };

  return (
    <section className="py-16 md:py-24 bg-[#59caf5] text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-12 text-center">Suara dari Peserta Kami</h2>
        
        <div className="relative">
          {/* Testimonials Carousel */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-blue-700/50 rounded-lg p-8 md:p-10 text-center">
                    <div className="mb-6 mx-auto w-20 h-20 relative rounded-full overflow-hidden border-4 border-white">
                      <Image 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/testimonials/default-avatar.jpg';
                        }}
                      />
                    </div>
                    <blockquote className="text-xl md:text-2xl italic mb-6 font-light">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>
                    <p className="font-heading font-bold text-lg">{testimonial.name}</p>
                    <p className="text-blue-100">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 mx-1 rounded-full focus:outline-none ${
                  index === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel; 