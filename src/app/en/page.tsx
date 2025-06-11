'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Import component and type
import PublikasiTerbaruEn, { Publikasi } from './components/PublikasiTerbaruEn';

// Import other components 
import ParticipationInfoEn from './components/ParticipationInfoEn';
import EngagementBannerEn from './components/EngagementBannerEn';
import TestimonialsCarouselEn from './components/TestimonialsCarouselEn';
import PartnersEn from './components/PartnersEn';
import UpcomingEventsEn from './components/UpcomingEventsEn';

// Dynamic import for client-side only components
const InteractiveMap = dynamic(() => import('../components/InteractiveMap'), {
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

export default function HomeEn() {
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
      <InteractiveMap />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <PartnersEn />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <ParticipationInfoEn />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <EngagementBannerEn />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <PublikasiTerbaruEn publikasi={latestPublikasi} /> 
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <TestimonialsCarouselEn />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <UpcomingEventsEn />
      </motion.div>
    </main>
  );
} 