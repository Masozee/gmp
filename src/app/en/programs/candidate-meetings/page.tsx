import React from 'react';
import Image from 'next/image';
import TemuKandidatMapWrapper from '@/components/TemuKandidatMapWrapper';

const CandidateMeetingsPage = () => {
  const pageTitle = "Candidate Meetings";

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative py-32 text-center bg-primary text-black"
      >
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{pageTitle}</h1>
          <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto">
            Empowering Indonesian youth in regions vulnerable to climate change with a safe democratic space to voice their concerns to Regional Head candidates in local and general elections.
          </p>
          
        </div>
      </section>

      {/* Section 1: Introduction (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/placeholder-intro.jpg" // Placeholder
              alt="Introduction to Candidate Meetings"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Indonesia's First Digital Town Hall Meeting</h2>
            <p className="text-gray-700 leading-relaxed">
              A platform connecting aspirations between young people and regional leader candidates. This program realizes one of the goals of Partisipasi Muda Foundation (YPM) to create an inclusive democratic space.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Implementation */}
      <section className="bg-gray-50">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          <div className="w-full md:w-1/2 md:order-last">
            <TemuKandidatMapWrapper className="w-full h-full min-h-[600px]" />
          </div>
          <div className="w-full md:w-1/2 md:order-first flex items-center">
            <div className="container mx-auto px-4 py-8 md:py-16 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Program Reach</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Candidate Meetings were conducted online during the pandemic in 2020-2021 in 4 cities/regencies/provinces vulnerable to climate change, namely:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700">
                <li>Gorontalo Province</li>
                <li>Central Sulawesi Province</li>
                <li>Sintang Regency, West Kalimantan Province</li>
                <li>Siak Regency, Riau Province</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

       {/* Section 3: Impact (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/placeholder-peserta.jpg" // Placeholder
              alt="Young Participants in Candidate Meetings"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Beneficiaries</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A total of 205 local activists were involved in voicing climate change issues in their regions to regional head candidates during the 2020 local elections.
            </p>
            <blockquote className="border-l-4 border-secondary pl-4 italic text-gray-600 text-sm">
              Example of attending candidates: <strong>Husni Merza</strong> (Siak Deputy Regent Candidate 01) & <strong>Sujarwo</strong> (Siak Deputy Regent Candidate 02).
            </blockquote>
          </div>
        </div>
      </section>
      
    </>
  );
};

export default CandidateMeetingsPage; 