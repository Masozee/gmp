import React from 'react';
import PartnersGrid from '../../components/PartnersGrid';

export const metadata = {
  title: 'Strategic Partners | Partisipasi Muda',
  description: 'See organizations and institutions that collaborate with Generasi Melek Politik.',
};

const StrategicPartnersPage = () => {
  return (
    <main>
      {/* Hero Section */}
      <div className="bg-[#f06d98] text-white">
        <div className="container max-w-7xl mx-auto px-4 py-32">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Strategic Partners</h1>
          <p className="text-xl max-w-3xl">
            We are grateful to our strategic partners who have supported and collaborated with Partisipasi Muda to strengthen youth political participation and advocate for positive change in Indonesia.
          </p>
        </div>
      </div>
      <PartnersGrid />
    </main>
  );
};

export default StrategicPartnersPage; 