import React from 'react';
import Image from 'next/image';
import MapWrapper from '../components/MapWrapper';

export const metadata = {
  title: 'Report | Partisipasi Muda',
  description: 'Laporan kegiatan dan pencapaian Generasi Melek Politik di seluruh Indonesia.',
};

const ReportPage = () => {
  // Sample achievements data
  const achievements = [
    {
      id: 1,
      title: '34',
      description: 'Provinsi di Indonesia',
      icon: '/icons/pin.png',
    },
    {
      id: 2,
      title: '250+',
      description: 'Kegiatan Terlaksana',
      icon: '/icons/communication.png',
    },
    {
      id: 3,
      title: '5000+',
      description: 'Peserta Teredukasi',
      icon: '/icons/global-network.png',
    },
    {
      id: 4,
      title: '100+',
      description: 'Mitra Kolaborasi',
      icon: '/icons/team-work.png',
    },
  ];

  // Sample publications data
  const publications = [
    {
      id: 1,
      title: 'Laporan Tahunan 2024',
      description: 'Laporan kegiatan dan pencapaian Generasi Melek Politik sepanjang tahun 2024.',
      image: '/images/report/pub-1.jpg',
      link: '#',
      date: 'Juni 2024',
    },
    {
      id: 2,
      title: 'Studi Kasus: Partisipasi Pemilih Muda',
      description: 'Analisis mendalam tentang pola partisipasi pemilih muda dalam Pemilu 2024.',
      image: '/images/report/pub-2.jpg',
      link: '#',
      date: 'April 2024',
    },
    {
      id: 3,
      title: 'Panduan Pendidikan Politik',
      description: 'Panduan praktis untuk pendidikan politik bagi generasi muda Indonesia.',
      image: '/images/report/pub-3.jpg',
      link: '#',
      date: 'Maret 2024',
    },
  ];

  return (
    <>
      {/* Hero Section with Pink Background */}
      <section className="bg-pink-600 py-32 text-white">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Laporan & Pencapaian
          </h1>
          <p className="text-lg text-pink-100 max-w-2xl mx-auto">
            Melihat dampak dan jangkauan program Generasi Melek Politik di seluruh Indonesia.
          </p>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pencapaian Kami</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-pink-100 rounded-full">
                  <Image 
                    src={item.icon} 
                    alt={item.title} 
                    width={32} 
                    height={32}
                  />
                </div>
                <h3 className="text-3xl font-bold text-pink-600 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Jangkauan Program</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Peta interaktif menunjukkan jangkauan program Generasi Melek Politik di seluruh Indonesia.
            Klik pada provinsi untuk melihat detail kegiatan.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <MapWrapper />
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Publikasi Kami</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publications.map((pub) => (
              <div key={pub.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image 
                    src={pub.image} 
                    alt={pub.title} 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-pink-600 mb-2">{pub.date}</p>
                  <h3 className="text-xl font-bold mb-2">{pub.title}</h3>
                  <p className="text-gray-600 mb-4">{pub.description}</p>
                  <a 
                    href={pub.link} 
                    className="inline-flex items-center text-pink-600 hover:text-pink-800"
                  >
                    Baca Selengkapnya
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ReportPage;
