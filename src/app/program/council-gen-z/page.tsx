import React from 'react';
import ProgramDetail from '../../components/ProgramDetail';

const CouncilGenZPage = () => {
  const programData = {
    title: 'Council of Gen Z',
    heroImage: '/images/program/hero-council-placeholder.jpg', // Placeholder
    galleryImages: [] // Placeholder
  };

  const content = (
    <>
      <p>
        Council of Gen Z adalah sebuah forum eksklusif yang didedikasikan untuk memberdayakan suara Generasi Z dalam lanskap politik Indonesia. Kami menyediakan platform bagi anak muda untuk berkolaborasi, merumuskan gagasan, dan mengadvokasi isu-isu yang penting bagi generasi mereka.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Fokus Utama</h2>
      <p>
         Fokus kami meliputi advokasi kebijakan, pengembangan kepemimpinan muda, riset isu-isu generasi Z, dan pembangunan jaringan antar aktivis muda.
      </p>
      {/* Add more specific content about Council of Gen Z here */}
    </>
  );

  return (
    <ProgramDetail 
      title={programData.title} 
      heroImage={programData.heroImage}
      content={content}
      galleryImages={programData.galleryImages}
    />
  );
};

export default CouncilGenZPage; 