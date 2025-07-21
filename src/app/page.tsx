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

interface HomeData {
  slides: any[];
  partners: any[];
  latestPublikasi: Publikasi[];
  upcomingEvents: any[];
}

export default function Home() {
  const [homeData, setHomeData] = useState<HomeData>({
    slides: [],
    partners: [],
    latestPublikasi: [],
    upcomingEvents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all home data from the home API endpoint
    async function fetchHomeData() {
      try {
        const response = await fetch('/api/home');
        if (!response.ok) {
          throw new Error('Failed to fetch home data');
        }
        const result = await response.json();
        setHomeData(result.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
        setHomeData({
          slides: [],
          partners: [],
          latestPublikasi: [],
          upcomingEvents: []
        });
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <VerticalSlideshow slides={homeData.slides} />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <Partners partners={homeData.partners} />
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
        <PublikasiTerbaru publikasi={homeData.latestPublikasi} /> 
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
        <UpcomingEvents events={homeData.upcomingEvents} />
      </motion.div>
    </main>
  );
}
