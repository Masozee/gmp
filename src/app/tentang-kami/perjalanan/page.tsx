import React from 'react';
import Image from 'next/image';

const PerjalananPage = () => {
  const timelineData = [
    {
      year: '2017',
      description: 'Gagasan Generasi Melek Politik (GMP) lahir dari keresahan Pilkada DKI Jakarta 2017 yang dipenuhi narasi SARA. Co-founder mencari anggota awal melalui indorelawan.org.',
      imageSrc: '/images/perjalanan/placeholder-2017.jpg',
    },
    {
      year: '2017-2018',
      description: 'GMP mengadakan diskusi publik dengan modal minim (Rp 0), berkolaborasi dengan berbagai tempat sebagai venue.',
      imageSrc: '/images/perjalanan/placeholder-2017-18.jpg',
    },
    {
      year: '2018',
      description: 'Organisasi resmi dilegalkan menjadi Yayasan Partisipasi Muda, terdaftar di Kemenkumham RI (No: 5018071931100892).',
      imageSrc: '/images/perjalanan/placeholder-2018.jpg',
    },
    {
      year: '2018-2019',
      description: 'Berkolaborasi mengembangkan diskusi, meluncurkan Academia Politik (bersama Universitas Indonesia) dan Kongres Millennial (bersama Universitas Bakrie).',
      imageSrc: '/images/perjalanan/placeholder-2018-19.jpg',
    },
    {
      year: '2020',
      description: 'Dipercaya oleh lembaga donor untuk menjalankan Temu Kandidat, digital townhall meeting pertama di Indonesia bertema kebijakan lingkungan.',
      imageSrc: '/images/perjalanan/placeholder-2020.jpg',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative py-32 text-center bg-[#f06d98] text-white"
      >
        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-black opacity-50"></div> */}
        {/* Content */}
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Perjalanan Kami</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
            Menelusuri langkah Yayasan Partisipasi Muda dari awal hingga kini.
          </p>
        </div>
      </section>

      {/* Horizontal Timeline Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Title moved inside the container if preferred, or remove if redundant with hero */}
        {/* <h2 className="text-3xl font-bold mb-12 text-center text-primary">Timeline</h2> */}
        
        <div className="flex overflow-x-auto space-x-8 pb-8 scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-200">
          {/* Timeline Items */}
          {timelineData.map((item, index) => (
            <div key={index} className="flex-shrink-0 w-72 bg-white rounded-lg shadow-lg overflow-hidden">
              <Image 
                src={item.imageSrc} 
                alt={`Perjalanan ${item.year}`}
                width={288} // Corresponds to w-72
                height={160} // Aspect ratio 16:9 (adjust as needed)
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-primary mb-2">{item.year}</h3>
                <p className="text-sm text-gray-700 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PerjalananPage; 