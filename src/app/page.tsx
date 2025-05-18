'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Import component and type
import PublikasiTerbaru, { Publikasi } from './components/PublikasiTerbaru';

// Import other components 
import Hero from './components/Hero';
import ParticipationInfo from './components/ParticipationInfo';
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
      <Hero />
      
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
