import React from 'react';
import Image from 'next/image';

const CandidateMeetingsPage = () => {
  const pageTitle = "Candidate Meetings";

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative py-32 text-center bg-primary text-black"
      >
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{pageTitle}</h1>
          <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto mb-6">
            A Platform for Young People to Voice Their Concerns About Climate Crisis to Regional Leader Candidates.
          </p>
          
        </div>
      </section>

      {/* Section 1: Introduction (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/placeholder-intro.jpg" // Placeholder
              alt="Introduction to Candidate Meetings"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Inclusive Democratic Space</h2>
            <p className="text-gray-700 leading-relaxed">
              One of the main goals of Generasi Melek Politik (GMP) is to create an inclusive democratic space for young people by providing a platform to convey their aspirations to the government. To achieve this, GMP initiated the <strong>&quot;Candidate Meetings&quot;</strong> program.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Implementation (Text Left, Image Right) */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 md:order-last"> {/* Image on right */}
              <Image 
                src="/images/placeholder-lokasi.jpg" // Placeholder
                alt="Candidate Meetings Implementation Location"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first"> {/* Text on left */}
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Program Implementation (2020-2021)</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                The program was conducted online throughout <strong>2020–2021</strong> in four strategic regions:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700">
                  <li>Gorontalo and Central Sulawesi Provinces</li>
                  <li>West Kalimantan Province</li>
                  <li>Siak Regency (Riau)</li>
                  <li>Sintang Regency (West Kalimantan)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

       {/* Section 3: Impact (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/placeholder-peserta.jpg" // Placeholder
              alt="Young Participants in Candidate Meetings"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Direct Impact on Youth</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Candidate Meetings became a space for <strong>205 young people</strong> to convey their concerns and hopes regarding climate crisis in their respective regions directly to regional head candidates.
            </p>
             <blockquote className="border-l-4 border-secondary pl-4 italic text-gray-600 text-sm">
                Example of attending candidates: <strong>Husni Merza</strong> (Siak Deputy Regent Candidate 01) & <strong>Sujarwo</strong> (Siak Deputy Regent Candidate 02).
            </blockquote>
          </div>
        </div>
      </section>

      {/* Section 4: Reach (Text Left, Image Right) */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 md:order-last"> {/* Image on right */}
              <Image 
                src="/images/placeholder-streaming.jpg" // Placeholder
                alt="Live Streaming Candidate Meetings"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first"> {/* Text on left */}
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Reaching Wider Audience</h2>
              <p className="text-gray-700 leading-relaxed">
                To reach more young people across Indonesia, Candidate Meetings were also broadcast <strong>live streaming</strong> on Majelis Lucu Indonesia YouTube, with a total of <strong>77,555 viewers</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

        {/* Section 5: Vision (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/placeholder-vision.jpg" // Placeholder
              alt="Vision for Indonesia's Democratic Future"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Future Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              GMP hopes that Candidate Meetings can become a pioneer in transforming Indonesia's democratic system, where <strong>&quot;town hall meeting&quot;</strong> culture becomes commonplace. Moving forward, more spaces like this need to be created so that political candidates can better listen to and understand young people's aspirations, especially regarding crucial issues for their future, such as climate crisis.
            </p>
          </div>
        </div>
        
      </section>
      
    </>
  );
};

export default CandidateMeetingsPage; 