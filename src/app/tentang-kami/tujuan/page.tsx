import Image from 'next/image';
import React from 'react';
import ImageSlideshow from '@/app/components/ImageSlideshow';

const TujuanPage = () => {
  const slides = [
    {
      image: "/images/bg/about.jpg",
      description: "Mengedukasi anak muda Indonesia tentang politik dan demokrasi dengan cara yang seru dan menarik melalui @generasimelekpolitik."
    },
    {
      image: "/images/bg/about.jpg",
      description: "Membekali anak muda dengan pemahaman kebijakan publik dan keterampilan lunak demokrasi yang penting."
    },
    {
      image: "/images/bg/about.jpg",
      description: "Membangun ruang demokrasi yang inklusif di mana suara anak muda didengar."
    },
    {
      image: "/images/bg/about.jpg",
      description: "Menjembatani hubungan yang bermakna antara pemuda dan pembuat kebijakan."
    },
    {
      image: "/images/bg/about.jpg",
      description: "Menginspirasi dan mendampingi generasi pemimpin muda berikutnya untuk membawa perubahan nyata di komunitasnya."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative py-32 text-center bg-[#f06d98] text-white"
      >
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Tujuan Kami</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
          Memberdayakan anak muda Indonesia untuk berpartisipasi dalam demokrasi dan perumusan kebijakan publik.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose lg:prose-xl max-w-none mx-auto text-gray-700">
          <p className="mb-6">
            Yayasan Partisipasi Muda (YPM), yang dikenal luas sebagai &quot;Generasi Melek Politik&quot;, adalah organisasi nirlaba yang dinamis dengan tujuan membangun generasi pembawa perubahan melalui pemberdayaan orang muda Indonesia umur 17-25 tahun untuk berpartisipasi dalam demokrasi dan perumusan kebijakan publik. Kami tidak terafiliasi dengan partai atau tokoh politik manapun.
          </p>
          
          <h2 className="text-2xl font-bold text-center my-6">👉🏼Cara Kami Memberdayakan Orang Muda Indonesia👈🏼</h2>
          
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-green-500 mr-2 font-bold">✅</span>
              <span>Mengedukasi anak muda Indonesia tentang politik dan demokrasi dengan cara yang seru dan menarik melalui @generasimelekpolitik.</span>
            </li>
            
            <li className="flex items-start">
              <span className="text-green-500 mr-2 font-bold">✅</span>
              <span>Membekali anak muda dengan pemahaman kebijakan publik dan keterampilan lunak demokrasi yang penting—agar mereka percaya diri menyuarakan hak, aspirasi, dan kegelisahannya kepada pemerintah.</span>
            </li>
            
            <li className="flex items-start">
              <span className="text-green-500 mr-2 font-bold">✅</span>
              <span>Membangun ruang demokrasi yang inklusif di mana suara anak muda didengar, serta menjembatani hubungan yang bermakna antara pemuda dan pembuat kebijakan.</span>
            </li>
            
            <li className="flex items-start">
              <span className="text-green-500 mr-2 font-bold">✅</span>
              <span>Menginspirasi dan mendampingi generasi pemimpin muda berikutnya untuk membawa perubahan nyata di komunitasnya.</span>
            </li>
          </ul>
        </div>

        <div className="mt-12">
          <ImageSlideshow slides={slides} />
        </div>
      </div>
    </>
  );
};

export default TujuanPage; 