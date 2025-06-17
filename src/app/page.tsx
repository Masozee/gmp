'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Import component and type
import PublikasiTerbaru, { Publikasi } from './components/PublikasiTerbaru';

// Import other components 
// import Hero from './components/Hero'; // Preserved for later use
import ParticipationInfo from './components/ParticipationInfo';
import dynamic from 'next/dynamic';

// Dynamic import for client-side only components
const VerticalSlideshow = dynamic(() => import('./components/VerticalSlideshow'), {
  ssr: false,
  loading: () => (
    <section className="relative w-full h-screen overflow-hidden bg-gray-100">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
          <p className="text-gray-500">Loading slideshow...</p>
        </div>
      </div>
    </section>
  )
});


import EngagementBanner from './components/EngagementBanner';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import Partners from './components/Partners';
import UpcomingEvents from './components/UpcomingEvents';

// Animation variants for section transitions
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.8,
      ease: "easeInOut"
    }
  }
};

export default function Home() {
  const [latestPublikasi, setLatestPublikasi] = useState<Publikasi[]>([]);

  useEffect(() => {
    // Fetch publikasi data from an API endpoint
    async function fetchPublikasi() {
      try {
        const response = await fetch('/api/publikasi');
        if (!response.ok) {
          throw new Error('Failed to fetch publikasi data');
        }
        const data = await response.json();
        setLatestPublikasi(data);
      } catch (error) {
        console.error('Error fetching publikasi:', error);
        setLatestPublikasi([]);
      }
    }

    fetchPublikasi();
  }, []);

  return (
    <main className="min-h-screen">
      <VerticalSlideshow />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <Partners />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <ParticipationInfo />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <EngagementBanner />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <PublikasiTerbaru publikasi={latestPublikasi} /> 
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <TestimonialsCarousel />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <UpcomingEvents />
      </motion.div>
    </main>
  );
}
