import React from 'react';
import Partners from '@/app/components/Partners'; // Import the Partners component

export const metadata = {
  title: 'Mitra Strategis | Partisipasi Muda',
  description: 'Lihat organisasi dan institusi yang berkolaborasi dengan Generasi Melek Politik.',
};

const MitraStrategisPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-green-600 py-32 text-white">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Mitra Strategis Kami
          </h1>
          <p className="text-lg text-green-100">
            Bekerja sama untuk memperkuat partisipasi politik anak muda.
          </p>
        </div>
      </section>

      {/* Partners Component Section */}
      {/* Render the existing Partners component here */}
      <Partners />
    </>
  );
};

export default MitraStrategisPage; 