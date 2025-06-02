'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Import component and type
import PublikasiTerbaruEn, { Publikasi } from './components/PublikasiTerbaruEn';

// Import other components 
import HeroEn from './components/HeroEn';
import ParticipationInfoEn from './components/ParticipationInfoEn';
import EngagementBannerEn from './components/EngagementBannerEn';
import TestimonialsCarouselEn from './components/TestimonialsCarouselEn';
import PartnersEn from './components/PartnersEn';
import UpcomingEventsEn from './components/UpcomingEventsEn';

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
      <HeroEn />
      
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