'use client'; // Add use client for state and effects

import React, { useState, useEffect } from 'react'; // Import hooks
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Define interface for a single past event object
interface PastEvent {
  title: string;
  slug: string; // Changed from url to slug
  image: string;
  date: string;
  description: string; // Seems to be context/location
}

const ClassOfClimateLeadersPage = () => {
  const programTitle = "Class of Climate Leaders";
  const programHeroDescription = "Sebuah bootcamp kepemimpinan iklim untuk peserta terbaik Academia Politica, yang mempersiapkan mereka untuk menjadi agen perubahan di komunitasnya. 🌱🌍";

  // Add state for events, loading, and errors
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch('/data/class-of-climate-leaders.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPastEvents(data as PastEvent[]); // Assume data matches the interface
      } catch (e) {
        console.error("Failed to load climate leaders events:", e);
        setError("Gagal memuat data kegiatan.");
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-32 text-center text-black" style={{ backgroundColor: '#59caf5' }}>
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 !text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
            Class of Climate Leaders
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 !text-white">
            Sebuah bootcamp kepemimpinan iklim untuk peserta terbaik Academia Politica, yang mempersiapkan mereka untuk menjadi agen perubahan di komunitasnya.
          </p>
         
        </div>
      </section>

      {/* Section 1: Program Overview (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/bg/IMG_3042.png"
              alt="Class of Climate Leaders Workshop"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Tentang Program</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Class of Climate Leaders adalah bootcamp kepemimpinan iklim eksklusif yang dirancang khusus untuk peserta terbaik dari program Academia Politica. Program ini mempersiapkan generasi muda untuk menjadi pemimpin yang tidak hanya memahami tantangan perubahan iklim, tetapi juga mampu mengambil tindakan nyata di komunitasnya.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Melalui pendekatan pembelajaran yang komprehensif, peserta akan dibekali dengan pengetahuan mendalam tentang kebijakan publik, sains perubahan iklim, dan keterampilan komunikasi yang efektif untuk memimpin perubahan positif.
            </p>
            <div className="flex items-center gap-2 text-primary font-semibold">
              <span>🎯</span>
              <span>Hasil pembelajaran langsung dipraktikkan dalam Council of Gen Z</span>
            </div>
          </div>
        </div>
      </section>

      
    </>
  );
};

export default ClassOfClimateLeadersPage; 