import React from 'react';

export const metadata = {
  title: 'Donasi & Kolaborasi | Partisipasi Muda',
  description: 'Dukung Generasi Melek Politik dalam memperbaiki ekosistem politik Indonesia melalui donasi atau kolaborasi.',
};

const DonasiPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-green-600 py-32 text-white">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Donasi & Kolaborasi
          </h1>
          <p className="text-lg text-green-100">
            Mari bersama membangun masa depan politik Indonesia yang lebih baik.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
        <div className="prose prose-lg mx-auto lg:prose-xl">
          <p>
            Generasi Melek Politik terbuka kepada individu, organisasi, ataupun
            perusahaan yang ingin memperbaiki ekosistem politik Indonesia.
          </p>
          <p>
            Generasi Melek Politik juga terbuka dengan penawaran kerjasama untuk
            kampanye digital, event digital, maupun program yang dilakukan
            secara offline.
          </p>
          <p className="font-semibold">
            Silahkan kirim tawaran kontribusi/kerjasama Anda ke:
            <br />
            <a href="mailto:admin@partisipasimuda.org" className="text-pink-600 hover:underline">
              admin@partisipasimuda.org
            </a>
          </p>
        </div>
      </section>
    </>
  );
};

export default DonasiPage; 