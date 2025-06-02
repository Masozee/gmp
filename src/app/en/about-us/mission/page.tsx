import Image from 'next/image';
import React from 'react';

const MissionPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative py-32 text-center bg-[#f06d98] text-white"
      >
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Our Mission</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
            Encouraging political participation of Indonesian youth through relevant and engaging education.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose lg:prose-xl max-w-none mx-auto text-gray-700">
          <p className="mb-6">
            Partisipasi Muda Foundation (YPM), widely known as &quot;Generasi Melek Politik&quot; (Politically Literate Generation), is a dynamic non-profit organization with the goal of building a generation of change-makers by empowering Indonesian youth aged 17-25 to participate in democracy and public policy formulation. We are not affiliated with any political party or political figure.
          </p>
          
          <h2 className="text-2xl font-bold text-center my-6">👉🏼How We Empower Indonesian Youth👈🏼</h2>
          
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-green-500 mr-2 font-bold">✅</span>
              <span>Educating Indonesian youth about politics and democracy in fun and engaging ways through @generasimelekpolitik.</span>
            </li>
            
            <li className="flex items-start">
              <span className="text-green-500 mr-2 font-bold">✅</span>
              <span>Equipping young people with understanding of public policy and important democratic soft skills—so they feel confident voicing their rights, aspirations, and concerns to the government.</span>
            </li>
            
            <li className="flex items-start">
              <span className="text-green-500 mr-2 font-bold">✅</span>
              <span>Building inclusive democratic spaces where young voices are heard, and bridging meaningful relationships between youth and policymakers.</span>
            </li>
            
            <li className="flex items-start">
              <span className="text-green-500 mr-2 font-bold">✅</span>
              <span>Inspiring and mentoring the next generation of young leaders to bring real change to their communities.</span>
            </li>
          </ul>
        </div>

        <div className="mt-12 flex justify-center">
          <Image
            src="/images/bg/about.jpg" // Placeholder image path
            alt="Placeholder Image for Mission Page"
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

export default MissionPage; 