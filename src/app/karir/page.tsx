import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import karirData from '@/data/karir.json';

export const metadata: Metadata = {
  title: 'Karir - Yayasan Partisipasi Muda',
  description: 'Kesempatan magang dan relawan di Yayasan Partisipasi Muda untuk anak muda yang ingin berkontribusi pada isu-isu politik dan demokrasi di Indonesia.',
};

// Using the data directly for type checking

export default function KarirPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Group karir data by type
  const internships = karirData.filter((item) => item.type === 'internship');
  const volunteers = karirData.filter((item) => item.type === 'volunteer');

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-[#f06d98] text-white">
        <div className="container max-w-7xl mx-auto px-4 py-32">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Karir</h1>
          <p className="text-xl max-w-3xl">
            Bergabunglah dengan Yayasan Partisipasi Muda untuk berkontribusi dalam memperjuangkan 
            partisipasi politik anak muda dan memperkuat demokrasi Indonesia.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Internships Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Magang</h2>
          <p className="mb-8 text-gray-600 max-w-3xl">
            Dapatkan pengalaman berharga bekerja dengan tim kami melalui program magang yang dirancang untuk 
            mengembangkan kemampuan profesional sambil berkontribusi pada isu-isu yang penting.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {internships.map((job) => (
              <div 
                key={job.id} 
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 bg-white"
              >
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                  Magang
                </span>
                <h3 className="text-xl font-bold mb-2 text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{job.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-3">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-sm text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.duration}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Deadline: {formatDate(job.deadline)}
                  </span>
                </div>
                
                <Link 
                  href={`/karir/${job.id}`} 
                  className="inline-block px-4 py-2 rounded-full bg-[#ffe066] text-black font-medium hover:bg-[#f06d98] hover:text-white transition-colors duration-300"
                >
                  Selengkapnya
                </Link>
              </div>
            ))}
          </div>
        </section>
        
        {/* Volunteers Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Relawan</h2>
          <p className="mb-8 text-gray-600 max-w-3xl">
            Menjadi relawan adalah cara berarti untuk berkontribusi pada misi kami. Kami menawarkan berbagai 
            kesempatan bagi Anda yang ingin mendukung perubahan positif untuk demokrasi Indonesia.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {volunteers.map((job) => (
              <div 
                key={job.id} 
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 bg-white"
              >
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                  Relawan
                </span>
                <h3 className="text-xl font-bold mb-2 text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{job.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-3">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-sm text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.duration}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Deadline: {formatDate(job.deadline)}
                  </span>
                </div>
                
                <Link 
                  href={`/karir/${job.id}`} 
                  className="inline-block px-4 py-2 rounded-full bg-[#ffe066] text-black font-medium hover:bg-[#f06d98] hover:text-white transition-colors duration-300"
                >
                  Selengkapnya
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
} 