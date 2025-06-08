import React from 'react';
import Image from 'next/image';
import TemuKandidatMapWrapper from '@/components/TemuKandidatMapWrapper';

const TemuKandidatPage = () => {
  const pageTitle = "Temu Kandidat";

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-32 text-center bg-primary text-black">
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{pageTitle}</h1>
          <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto">
            Memberdayakan anak muda Indonesia di daerah yang rentan terhadap perubahan iklim dengan ruang demokratis yang aman untuk menyuarakan kekhawatiran mereka kepada calon Kepala Daerah dalam Pilkada dan Pemilu.
          </p>
        </div>
      </section>

      {/* Section 1: Introduction */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/placeholder-intro.jpg"
              alt="Pengantar Temu Kandidat"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Digital Town Hall Meeting Pertama di Indonesia</h2>
            <p className="text-gray-700 leading-relaxed">
              Sebuah wadah penyambung aspirasi antara orang muda dengan kandidat pemimpin daerah. Program ini mewujudkan salah satu tujuan Yayasan Partisipasi Muda (YPM) untuk menciptakan ruang demokrasi yang inklusif.
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
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Jangkauan Program</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Temu Kandidat berlangsung secara daring selama pandemi tahun 2020-2021 di 4 kota/kabupaten/provinsi yang rentan terhadap perubahan iklim, yaitu:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700">
                <li>Provinsi Gorontalo</li>
                <li>Provinsi Sulawesi Tengah</li>
                <li>Kabupaten Sintang, Provinsi Kalimantan Barat</li>
                <li>Kabupaten Siak, Provinsi Riau</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

              {/* Section 3: Impact */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/placeholder-peserta.jpg"
              alt="Peserta Muda Temu Kandidat"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Penerima Manfaat</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sebanyak 205 aktivis lokal telah terlibat dalam menyuarakan isu-isu perubahan iklim di daerah kepada calon kepala daerah selama Pilkada 2020.
            </p>
            <blockquote className="border-l-4 border-secondary pl-4 italic text-gray-600 text-sm">
              Contoh kandidat yang hadir: <strong>Husni Merza</strong> (Calon Wabup Siak 01) & <strong>Sujarwo</strong> (Calon Wabup Siak 02).
            </blockquote>
          </div>
        </div>
      </section>
    </>
  );
};

export default TemuKandidatPage; 