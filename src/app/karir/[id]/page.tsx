import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import karirData from '@/data/karir.json';
import { notFound } from 'next/navigation';

// Using karirData directly for type checking

interface KarirDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate metadata for this page
export async function generateMetadata({ params }: KarirDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const karir = karirData.find((item) => item.id === id);

  if (!karir) {
    return {
      title: 'Lowongan Tidak Ditemukan - Yayasan Partisipasi Muda',
    };
  }

  return {
    title: `${karir.title} - Karir - Yayasan Partisipasi Muda`,
    description: karir.description,
  };
}

export default async function KarirDetailPage({ params }: KarirDetailPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const karir = karirData.find((item) => item.id === id);

  // If the karir with the specified ID doesn't exist, show a 404 page
  if (!karir) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Function to get badge color based on type
  const getBadgeClass = (type: string) => {
    return type === 'internship' 
      ? 'bg-blue-100 text-blue-800'
      : 'bg-green-100 text-green-800';
  };

  // Function to get badge text based on type
  const getBadgeText = (type: string) => {
    return type === 'internship' ? 'Magang' : 'Relawan';
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-[#f06d98] text-white">
        <div className="container max-w-7xl mx-auto px-4 py-32">
          <Link 
            href="/karir"
            className="inline-flex items-center text-white mb-6 hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Karir
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{karir.title}</h1>
          <span className={`inline-block px-3 py-1 ${getBadgeClass(karir.type)} rounded-full text-sm font-medium`}>
            {getBadgeText(karir.type)}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - Main content */}
          <div className="md:w-2/3">
            {/* Description */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Deskripsi</h2>
              <div className="text-gray-700 mb-4 whitespace-pre-line">{karir.description}</div>
            </section>

            {/* Responsibilities - Only show if not empty */}
            {karir.responsibilities && karir.responsibilities.trim() !== '' && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Tanggung Jawab</h2>
                <div className="text-gray-700 whitespace-pre-line">{karir.responsibilities}</div>
              </section>
            )}

            {/* Requirements - Only show if not empty */}
            {karir.requirements && karir.requirements.trim() !== '' && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Persyaratan</h2>
                <div className="text-gray-700 whitespace-pre-line">{karir.requirements}</div>
              </section>
            )}

            {/* Benefits - Only show if not empty */}
            {karir.benefits && karir.benefits.trim() !== '' && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Manfaat</h2>
                <div className="text-gray-700 whitespace-pre-line">{karir.benefits}</div>
              </section>
            )}
          </div>

          {/* Right column - Info card */}
          <div className="md:w-1/3">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-4 text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Informasi Lowongan</h3>
              
              <div className="space-y-4">
                {karir.location && karir.location !== '-' && (
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Lokasi</p>
                      <p className="text-gray-600">{karir.location}</p>
                    </div>
                  </div>
                )}

                {karir.duration && karir.duration !== '-' && (
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Durasi</p>
                      <p className="text-gray-600">{karir.duration}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Tanggal Posting</p>
                    <p className="text-gray-600">{formatDate(karir.posted_date)}</p>
                  </div>
                </div>

                {karir.deadline && karir.deadline !== '-' && (
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Deadline Pendaftaran</p>
                      <p className="text-gray-600">{formatDate(karir.deadline)}</p>
                    </div>
                  </div>
                )}
              </div>

              {karir.apply_url ? (
                <a 
                  href={karir.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full bg-[#f06d98] text-white hover:bg-pink-600 font-bold py-3 px-4 rounded-full transition duration-300 block text-center"
                >
                  Daftar Sekarang
                </a>
              ) : (
                <button className="mt-6 w-full bg-[#f06d98] text-white hover:bg-pink-600 font-bold py-3 px-4 rounded-full transition duration-300">
                  Daftar Sekarang
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 