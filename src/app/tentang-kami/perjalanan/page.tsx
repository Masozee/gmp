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

      {/* Two-column layout: left for timeline, right for text */}
      <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row gap-12">
        {/* Left: Scrollable Timeline */}
        <div className="md:w-2/3 w-full max-h-[80vh] overflow-y-auto pr-2">
          <div className="relative">
            {/* Vertical line with accent */}
            <div className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-pink-400 via-yellow-300 to-pink-400 h-full -translate-x-1/2 z-0" />
            <div className="flex flex-col gap-24 relative z-10">
              {timelineData.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-center relative group animate-fadeInUp"
                >
                  {/* Timeline Dot */}
                  <div className="hidden md:block absolute left-1/2 top-8 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="w-6 h-6 rounded-full bg-white border-4 border-yellow-400 shadow-lg" />
                  </div>
                  {/* Single Card with Image and Description */}
                  <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-0 shadow-xl border border-gray-100 transition-all duration-300 hover:bg-yellow-300 hover:text-black cursor-pointer w-full max-w-2xl">
                    <Image
                      src={item.imageSrc}
                      alt={`Perjalanan ${item.year}`}
                      width={640}
                      height={320}
                      className="rounded-t-2xl object-cover w-full h-56 md:h-72 border-b border-gray-100"
                    />
                    <div className="p-8">
                      <h3 className="font-extrabold text-2xl mb-3 text-primary group-hover:text-black tracking-tight drop-shadow-sm">{item.year}</h3>
                      <p className="text-lg text-gray-700 group-hover:text-black leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right: Section Title and Description (sticky on desktop) */}
        <div className="md:w-1/3 w-full md:sticky md:top-32 h-fit flex flex-col justify-start">
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
            Yayasan Partisipasi Muda (YPM) telah menempuh perjalanan yang penuh tantangan dan inspirasi sejak berdiri pada tahun 2017. Berawal dari keresahan terhadap narasi SARA dalam Pilkada DKI Jakarta, YPM lahir sebagai wadah bagi anak muda untuk terlibat aktif dalam pendidikan politik yang inklusif dan menyenangkan. Melalui berbagai diskusi publik, kolaborasi dengan universitas ternama, hingga pelaksanaan program-program inovatif seperti Academia Politica dan Temu Kandidat, YPM terus berupaya membangun budaya demokrasi yang sehat dan partisipatif di Indonesia. Setiap fase perjalanan ini menandai komitmen kami untuk memastikan suara anak muda didengar, diakui, dan mampu memberikan dampak nyata bagi masa depan bangsa.
          </p>
        </div>
      </div>
    </>
  );
};

export default PerjalananPage; 