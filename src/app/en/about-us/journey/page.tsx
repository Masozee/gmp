import React from 'react';
import Image from 'next/image';

const JourneyPage = () => {
  const timelineData = [
    {
      year: '2017',
      description: 'The idea of Generasi Melek Politik (GMP) was born from concerns about the 2017 Jakarta Regional Election filled with SARA narratives. Co-founders sought initial members through indorelawan.org.',
      imageSrc: '/images/bg/about.jpg',
    },
    {
      year: '2017-2018',
      description: 'GMP held public discussions with minimal budget (Rp 0), collaborating with various venues as locations.',
      imageSrc: '/images/bg/about.jpg',
    },
    {
      year: '2018',
      description: 'The organization was officially legalized as Partisipasi Muda Foundation, registered with the Ministry of Law and Human Rights RI (No: 5018071931100892).',
      imageSrc: '/images/bg/about.jpg',
    },
    {
      year: '2018-2019',
      description: 'Collaborated to develop discussions, launched Academia Politica (with University of Indonesia) and Millennial Congress (with Bakrie University).',
      imageSrc: '/images/bg/about.jpg',
    },
    {
      year: '2020',
      description: 'Trusted by donor institutions to run Candidate Meetings, Indonesia\'s first digital townhall meeting themed on environmental policy.',
      imageSrc: '/images/bg/about.jpg',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative py-32 text-center bg-[#f06d98] text-white"
      >
        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-black opacity-50"></div> */}
        {/* Content */}
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Our Journey</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
            Tracing the steps of Partisipasi Muda Foundation from the beginning to now.
          </p>
        </div>
      </section>

      {/* Two-column layout: left for timeline, right for text */}
      <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row gap-12">
        {/* Left: Scrollable Timeline */}
        <div className="md:w-2/3 w-full max-h-[80vh] overflow-y-auto pr-2">
          <div className="relative">
            {/* Vertical line with accent */}
            <div className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-pink-400 via-yellow-300 to-pink-400 h-full -translate-x-1/2 z-0" />
            <div className="flex flex-col gap-24 relative z-10">
              {timelineData.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-center relative group animate-fadeInUp"
                >
                  {/* Timeline Dot */}
                  <div className="hidden md:block absolute left-1/2 top-8 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="w-6 h-6 rounded-full bg-white border-4 border-yellow-400 shadow-lg" />
                  </div>
                  {/* Single Card with Image and Description */}
                  <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-0 shadow-xl border border-gray-100 transition-all duration-300 hover:bg-yellow-300 hover:text-black cursor-pointer w-full max-w-2xl">
                    <Image
                      src={item.imageSrc}
                      alt={`Journey ${item.year}`}
                      width={640}
                      height={320}
                      className="rounded-t-2xl object-cover w-full h-56 md:h-72 border-b border-gray-100"
                    />
                    <div className="p-8">
                      <h3 className="font-extrabold text-2xl mb-3 text-pink-500 group-hover:text-black tracking-tight drop-shadow-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{item.year}</h3>
                      <p className="text-lg text-gray-700 group-hover:text-black leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right: Section Title and Description (sticky on desktop) */}
        <div className="md:w-1/3 w-full md:sticky md:top-32 h-fit flex flex-col justify-start space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">It all started with a question:</h2>
          <p className="text-xl italic font-medium text-pink-500">
            What if politics could feel more humane?
          </p>
          
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Born from frustration and hope, Partisipasi Muda Foundation began as a small dream in 2017—to open the doors of politics and policy formulation for Indonesian youth who felt marginalized from this conversation.
            </p>
            
            <p className="text-lg text-gray-700">
              We started without followers, without an office, and without a roadmap—just a few people with shared passion and belief that young people deserve a seat at the negotiating table. Inspired by young leaders worldwide and driven by creativity and civic engagement spirit, we were determined to make democracy more accessible, more relevant, and inclusive.
            </p>
            
            <p className="text-lg text-gray-700">
              From café meetings to classrooms, from digital campaigns to policy workshops, our mission has always been the same: empowering Indonesian youth to participate in shaping the future of their communities and their country.
            </p>
            
            <p className="text-lg font-bold text-gray-800">
              We've come a long way—but our journey has just begun.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default JourneyPage; 