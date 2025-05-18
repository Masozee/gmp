import React from 'react';
import ProgramDetail from '../../components/ProgramDetail';

const AcademiaPoliticaPage = () => {
  const programData = {
    title: 'Academia Politica',
    heroImage: '/images/program/hero-academia-placeholder.jpg', // Placeholder
    galleryImages: [] // Placeholder
  };

  const content = (
    <>
      <p>
        Bekerja sama dengan institusi pendidikan terkemuka, Academia Politica menawarkan program pendidikan politik yang lebih mendalam dan terstruktur. Program ini dirancang untuk membekali peserta dengan pengetahuan teoritis dan keterampilan praktis dalam analisis politik dan kebijakan.
      </p>
       <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Kurikulum</h2>
      <p>
        Kurikulum kami mencakup topik-topik seperti sistem politik Indonesia, pembuatan kebijakan publik, hubungan internasional, komunikasi politik, dan partisipasi warga negara. Pembelajaran dilakukan melalui kuliah, diskusi, studi kasus, dan simulasi.
      </p>
       {/* Add more specific content about Academia Politica here */}
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

export default AcademiaPoliticaPage; 