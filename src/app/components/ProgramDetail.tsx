import React from 'react';
import Image from 'next/image';

interface ProgramDetailProps {
  title: string;
  heroImage: string;
  content: React.ReactNode; // Allow passing JSX/HTML for content
  galleryImages?: string[]; // Optional image gallery
}

const ProgramDetail: React.FC<ProgramDetailProps> = ({ 
  title, 
  content,
  galleryImages = [] // Default to empty array
}) => {
  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative py-32 text-center bg-sky-500 text-white"
      >
        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-black opacity-60"></div> */}
        {/* Content */}
        <div className="relative container mx-auto px-4 z-10 flex flex-col justify-center items-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          {/* Optional: Add a subtitle here if needed */}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose lg:prose-xl max-w-none mx-auto text-gray-700">
          {content}
        </div>

        {/* Optional Image Gallery */}
        {galleryImages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center text-secondary">Galeri Kegiatan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((imgSrc, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                  <Image 
                    src={imgSrc} 
                    alt={`${title} gallery image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProgramDetail; 