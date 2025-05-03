import Image from 'next/image';
import React from 'react';

const TujuanPage = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tujuan Kami</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
            Mendorong partisipasi politik anak muda Indonesia melalui edukasi yang relevan dan engaging.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose lg:prose-xl max-w-none mx-auto text-gray-700">
          <p className="mb-6">
            Generasi Melek Politik (Yayasan Partisipasi Muda) adalah organisasi non-profit yang tidak terafliasi dengan partai atau tokoh politik manapun dengan tujuan utama memberikan pendidikan politik untuk anak muda (17-25 tahun) dengan cara yang menyenangkan dan tidak &quot;berat&quot;.
          </p>
          <p>
            Kami ingin anak muda Indonesia sadar, terlibat, dan berkontribusi di politik praktis baik itu dalam ranah pemerintahan, bisnis, profesional, lingkungan, atau bahkan seni. Kami ingin anak muda Indonesia sadar bahwa politik bukan sekedar pemilihan umum, namun juga berisi kebijakan yang bisa berdampak langsung maupun tidak langsung ke kehidupan sehari-hari anak muda.
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <Image
            src="/images/placeholder-tujuan.jpg" // Placeholder image path
            alt="Placeholder Image for Tujuan Page"
            width={600}
            height={400}
            className="rounded-lg shadow-md object-cover"
          />
          {/* You can replace the src above with your actual image path later */}
        </div>
      </div>
    </>
  );
};

export default TujuanPage; 