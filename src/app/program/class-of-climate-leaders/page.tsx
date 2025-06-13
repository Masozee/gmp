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
      <section className="relative py-32 text-center bg-primary text-black">
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 !text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
            Class of Climate Leaders
          </h1>
          <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto mb-8 !text-white">
            Sebuah bootcamp kepemimpinan iklim untuk peserta terbaik Academia Politica, yang mempersiapkan mereka untuk menjadi agen perubahan di komunitasnya.
          </p>
         
        </div>
      </section>

      {/* Section 1: Program Overview (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/program/DSC08852-a.jpg"
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

      {/* Section 2: Curriculum (Text Left, Image Right) */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 md:order-last">
              <Image 
                src="/images/program/DSC08852-a.jpg"
                alt="Materi Pembelajaran Climate Leaders"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first">
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Materi yang Diajarkan</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-2 flex-shrink-0">
                    <span className="text-black font-bold text-lg">📋</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Public Policy 101</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Memahami dasar-dasar kebijakan publik, proses pembuatan kebijakan, dan bagaimana mengadvokasi perubahan kebijakan yang berpihak pada lingkungan dan generasi muda.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-secondary rounded-full p-2 flex-shrink-0">
                    <span className="text-white font-bold text-lg">🌍</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Climate Change 101</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Pemahaman mendalam tentang sains perubahan iklim, dampaknya terhadap Indonesia, dan solusi-solusi inovatif yang dapat diterapkan di tingkat lokal dan nasional.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-accent rounded-full p-2 flex-shrink-0">
                    <span className="text-white font-bold text-lg">🎤</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Public Speaking 101</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Mengembangkan keterampilan komunikasi publik yang efektif, storytelling untuk isu lingkungan, dan teknik presentasi yang mempengaruhi audiens.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </>
  );
};

export default ClassOfClimateLeadersPage; 