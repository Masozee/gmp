import React from 'react';
import Image from 'next/image';

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

      {/* Section 1: Buy Me a Coffee - Text on left, Image on right */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-green-700">Dukung Kami</h2>
            <div className="prose prose-lg">
              <p>
                Dukung upaya kami dalam meningkatkan literasi politik di Indonesia melalui donasi Anda.
                Setiap kontribusi akan membantu kami mengembangkan program-program edukasi politik yang
                inklusif dan berkualitas.
              </p>
              <p className="font-semibold">
                Anda dapat mendukung kami dengan cara yang mudah melalui platform Buy Me a Coffee.
                Scan QR code di samping atau klik tombol di bawah ini.
              </p>
              <a 
                href="https://www.buymeacoffee.com/partisipasimuda" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                ☕ Buy Me a Coffee
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 border-8 border-yellow-400 rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/images/qr.png" 
                alt="Buy Me a Coffee QR Code" 
                width={240} 
                height={240}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Current Text - Image on left, Text on right */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-green-700">Kolaborasi Bersama</h2>
            <div className="prose prose-lg">
              <p>
                Generasi Melek Politik terbuka kepada individu, organisasi, ataupun
                perusahaan yang ingin memperbaiki ekosistem politik Indonesia.
              </p>
              <p>
                Generasi Melek Politik juga terbuka dengan penawaran kerjasama untuk
                kampanye digital, event digital, maupun program yang dilakukan
                secara offline.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/images/bg/about.jpg" 
                alt="Kolaborasi Bersama" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Contact Info - Text on left, Image on right */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-green-700">Hubungi Kami</h2>
            <div className="prose prose-lg">
              <p>
                Jika Anda ingin bertanya tentang kerjasama atau memiliki ide kolaborasi,
                jangan ragu untuk menghubungi kami secara langsung melalui WhatsApp atau email.
              </p>
              <p className="font-semibold mt-6">
                Silahkan hubungi kami melalui:
              </p>
              <div className="flex flex-col gap-3 mt-4">
                <a 
                  href="https://wa.me/6281234567890" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
                <a 
                  href="mailto:admin@partisipasimuda.org" 
                  className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  admin@partisipasimuda.org
                </a>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/images/bg/about.jpg" 
                alt="Hubungi Kami" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DonasiPage; 