import React from 'react';
import Image from 'next/image';

const TemuKandidatPage = () => {
  const pageTitle = "Temu Kandidat";

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative py-32 text-center bg-primary text-black"
      >
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{pageTitle}</h1>
          <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto mb-6">
            Wadah Anak Muda Menyuarakan Kepedulian terhadap Krisis Iklim kepada Calon Pemimpin Daerah.
          </p>
          
        </div>
      </section>

      {/* Section 1: Introduction (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/placeholder-intro.jpg" // Placeholder
              alt="Pengantar Temu Kandidat"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Ruang Demokrasi Inklusif</h2>
            <p className="text-gray-700 leading-relaxed">
              Salah satu tujuan utama Generasi Melek Politik (GMP) adalah menciptakan ruang demokrasi yang inklusif bagi kaum muda dengan menyediakan wadah untuk menyampaikan aspirasi mereka kepada pemerintah. Untuk mewujudkannya, GMP menginisiasi program <strong>&quot;Temu Kandidat&quot;</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Implementation (Text Left, Image Right) */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 md:order-last"> {/* Image on right */}
              <Image 
                src="/images/placeholder-lokasi.jpg" // Placeholder
                alt="Lokasi Pelaksanaan Temu Kandidat"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first"> {/* Text on left */}
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Pelaksanaan Program (2020-2021)</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Program berlangsung secara daring sepanjang tahun <strong>2020–2021</strong> di empat daerah strategis:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700">
                  <li>Provinsi Gorontalo dan Sulawesi Tengah</li>
                  <li>Provinsi Kalimantan Barat</li>
                  <li>Kabupaten Siak (Riau)</li>
                  <li>Kabupaten Sintang (Kalimantan Barat)</li>
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
              alt="Peserta Muda Temu Kandidat"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Dampak Langsung bagi Pemuda</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Temu Kandidat menjadi ruang bagi <strong>205 anak muda</strong> untuk menyampaikan kekhawatiran dan harapan mereka terkait krisis iklim di daerah masing-masing langsung kepada para calon kepala daerah.
            </p>
             <blockquote className="border-l-4 border-secondary pl-4 italic text-gray-600 text-sm">
                Contoh kandidat yang hadir: <strong>Husni Merza</strong> (Calon Wabup Siak 01) & <strong>Sujarwo</strong> (Calon Wabup Siak 02).
            </blockquote>
          </div>
        </div>
      </section>

      {/* Section 4: Reach (Text Left, Image Right) */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 md:order-last"> {/* Image on right */}
              <Image 
                src="/images/placeholder-streaming.jpg" // Placeholder
                alt="Live Streaming Temu Kandidat"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first"> {/* Text on left */}
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Menjangkau Lebih Luas</h2>
              <p className="text-gray-700 leading-relaxed">
                Untuk menjangkau lebih banyak anak muda di seluruh Indonesia, Temu Kandidat juga disiarkan secara <strong>live streaming</strong> di YouTube Majelis Lucu Indonesia, dengan total <strong>77.555 penonton</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

        {/* Section 5: Vision (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/placeholder-vision.jpg" // Placeholder
              alt="Visi Masa Depan Demokrasi Indonesia"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Visi ke Depan</h2>
            <p className="text-gray-700 leading-relaxed">
              GMP berharap Temu Kandidat dapat menjadi pionir dalam mengubah sistem demokrasi Indonesia, di mana budaya <strong>&quot;town hall meeting&quot;</strong> menjadi sesuatu yang lumrah. Ke depan, semakin banyak ruang seperti ini perlu diciptakan agar para kandidat politik dapat lebih mendengar dan memahami aspirasi anak muda, terutama terkait isu-isu krusial bagi masa depan mereka, seperti krisis iklim.
            </p>
          </div>
        </div>
        
      </section>
      
    </>
  );
};

export default TemuKandidatPage; 