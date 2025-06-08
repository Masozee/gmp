'use client'; // Add use client for state and effects

import React, { useState, useEffect } from 'react'; // Import hooks
import Link from 'next/link';
import Image from 'next/image';

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
      {/* Hero Section (General Program Info) */}
      <section className="relative py-32 text-center bg-primary text-black">
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
            Class of Climate Leaders
          </h1>
          <p className="text-lg md:text-xl text-gray-800 max-w-2xl mx-auto">
            Sebuah bootcamp kepemimpinan iklim untuk peserta terbaik Academia Politica, yang mempersiapkan mereka untuk menjadi agen perubahan di komunitasnya. 🌱🌍
          </p>
        </div>
      </section>

      {/* Program Overview Section */}
      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-primary" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Tentang Program</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Tentang Program</h3>
              <p className="text-gray-700 mb-4">
                Class of Climate Leaders adalah bootcamp kepemimpinan iklim eksklusif untuk peserta terbaik Academia Politica. Program ini dirancang untuk mempersiapkan mereka menjadi agen perubahan di komunitasnya.
              </p>
              <p className="text-gray-700">
                Hasil pembelajaran dari CCL akan dipraktekkan langsung pada rangkaian aktivitas Council of Gen Z, memberikan kesempatan nyata untuk mengimplementasikan pengetahuan yang telah diperoleh.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Materi yang Diajarkan</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary font-semibold mr-2">📋</span>
                  <div>
                    <strong>Public Policy 101</strong>
                    <p className="text-sm text-gray-600">Dasar-dasar kebijakan publik dan proses pembuatan kebijakan</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-semibold mr-2">🌍</span>
                  <div>
                    <strong>Climate Change 101</strong>
                    <p className="text-sm text-gray-600">Pemahaman mendalam tentang perubahan iklim dan dampaknya</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-semibold mr-2">🎤</span>
                  <div>
                    <strong>Public Speaking 101</strong>
                    <p className="text-sm text-gray-600">Keterampilan komunikasi dan berbicara di depan umum</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default ClassOfClimateLeadersPage; 