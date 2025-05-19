import React from 'react';
import PartnersGrid from '../components/PartnersGrid';

export const metadata = {
  title: 'Mitra Strategis | Partisipasi Muda',
  description: 'Lihat organisasi dan institusi yang berkolaborasi dengan Generasi Melek Politik.',
};

const MitraStrategisPage = () => {
  return (
    <main>
      {/* Hero Section */}
      <div className="bg-[#f06d98] text-white">
        <div className="container max-w-7xl mx-auto px-4 py-32">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Mitra Strategis</h1>
          <p className="text-xl max-w-3xl">
            Kami berterima kasih kepada para mitra strategis yang telah mendukung dan berkolaborasi bersama Partisipasi Muda untuk memperkuat partisipasi politik anak muda dan memperjuangkan perubahan positif di Indonesia.
          </p>
        </div>
      </div>
      <PartnersGrid />
    </main>
  );
};

export default MitraStrategisPage; 