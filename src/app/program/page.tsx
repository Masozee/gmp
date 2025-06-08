import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define program data (replace placeholders as needed)
const programs = [
  {
    slug: 'diskusi',
    title: 'Diskusi Publik',
    description: 'Wadah diskusi terbuka membahas isu-isu politik terkini yang relevan bagi anak muda.',
    image: '/images/program/placeholder-diskusi.jpg',
    link: '/program/diskusi'
  },
  {
    slug: 'temu-kandidat',
    title: 'Temu Kandidat',
    description: 'Memfasilitasi dialog antara anak muda dengan calon pemimpin atau pejabat publik.',
    image: '/images/program/placeholder-temu-kandidat.jpg',
    link: '/program/temu-kandidat'
  },
  {
    slug: 'academia-politica',
    title: 'Academia Politica',
    description: 'Program pendidikan politik mendalam bekerja sama dengan institusi pendidikan.',
    image: '/images/program/placeholder-academia.jpg',
    link: '/program/academia-politica'
  },
  {
    slug: 'council-gen-z',
    title: 'Council of Gen Z',
    description: 'Forum bagi Generasi Z untuk menyuarakan aspirasi dan gagasan politik mereka.',
    image: '/images/program/placeholder-council.jpg',
    link: '/program/council-gen-z'
  },
  {
    slug: 'class-of-climate-leaders',
    title: 'Class of Climate Leaders',
    description: 'Bootcamp kepemimpinan iklim untuk peserta terbaik Academia Politica, mempersiapkan mereka menjadi agen perubahan di komunitasnya.',
    image: '/images/program/placeholder-climate.jpg',
    link: '/program/class-of-climate-leaders'
  },
];

const ProgramPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative py-20 text-center bg-primary text-black"
      >
        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-black opacity-50"></div> */}
        {/* Content */}
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Program Kami</h1>
          <p className="text-lg md:text-xl text-gray-800 max-w-2xl mx-auto">
            Inisiatif kami untuk meningkatkan kesadaran dan partisipasi politik anak muda.
          </p>
        </div>
      </section>

      {/* Program List Section */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <Link key={program.slug} href={program.link} legacyBehavior>
              <a className="block bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
                <div className="relative w-full h-48">
                  <Image 
                    src={program.image} 
                    alt={program.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-primary mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{program.title}</h3>
                  <p className="text-gray-700 text-sm">
                    {program.description}
                  </p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProgramPage; 