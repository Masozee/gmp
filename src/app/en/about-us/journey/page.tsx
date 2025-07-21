import React from 'react';
import Image from 'next/image';

const JourneyPage = () => {
  const timelineData = [
    {
      year: '2017',
      description: 'The idea of Generasi Melek Politik (GMP) was born from the concerns of founder, Neildeva Despendya, about politics in Indonesia that felt like a circus, where sensation was valued over substance. Even worse, political conversation felt locked behind gates—gates built with jargon, elitism, and complexity. As if politics were not for the people.',
      imageSrc: '/images/bg/atamerica.jpeg',
    },
    {
      year: '2017-2018',
      description: 'GMP began connecting with like-minded individuals who shared the vision and mission to make politics more enjoyable. Members were formed through indorelawan.org. The journey started by holding public discussions with collaborative funding and cash contributions, as well as creating educational content on social media.',
      imageSrc: '/images/bg/qlue.jpeg',
    },
    {
      year: '2018',
      description: 'Recognizing the importance of organizational legality, GMP legalized itself as Partisipasi Muda Foundation (YPM). We are currently registered with the Ministry of Law and Human Rights RI with number: 5018071931100892.',
      imageSrc: '/images/bg/kemkumham.jpeg',
    },
    {
      year: '2018-2019',
      description: 'YPM began launching the Academia Politica program to equip young people with understanding of public policy and important democratic soft skills. YPM participated in enlivening the 2019 General Election democratic festival by participating in discussion sessions of the Volunteer Festival from Indorelawan, watched by thousands of visitors.',
      imageSrc: '/images/bg/acpolui.jpeg',
    },
    {
      year: '2020-2021',
      description: 'Trusted to manage the first grant funding from donor institutions to launch the Candidate Meetings program, Indonesia\'s first digital town hall meeting. This program aimed to provide an inclusive space to bridge young people with regional head candidates in 4 cities/regencies/provinces vulnerable to climate crisis.',
      imageSrc: '/images/bg/temukandidat.jpeg',
    },
    {
      year: '2022-2024',
      description: 'Donor institution trust increased, so the flagship Academia Politica program returned with a focus on public policy in climate crisis issues. The program spread across 5 provinces in Indonesia.',
      imageSrc: '/images/bg/2024.jpeg',
    },
    {
      year: '2025-present',
      description: 'YPM continues the Academia Politica program focused on climate crisis issues with broader coverage, especially in eastern Indonesia. During this period, YPM also launched its first comprehensive research on young people\'s understanding of public civic space with respondents throughout Indonesia.',
      imageSrc: '/images/bg/DSC00229.jpg',
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
        <div className="relative container mx-auto px-4 max-w-7xl z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 !text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Our Journey</h1>
          <p className="text-lg md:text-xl !text-white max-w-2xl mx-auto">
          Starting from a volunteer community, we grew into a dynamic and impactful non-profit organization. Led by young people, to empower fellow young people.
          </p>
        </div>
      </section>

      {/* Two-column layout: left for timeline, right for text */}
      <div className="container mx-auto px-4 max-w-7xl py-16 flex flex-col md:flex-row gap-12 min-h-screen">
        {/* Left: Full Height Timeline */}
        <div className="md:w-1/2 w-full pr-2">
          <div className="relative">
            {/* Vertical line with accent */}
            <div className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-pink-400 via-pink-600 to-pink-400 h-full -translate-x-1/2 z-0" />
            <div className="flex flex-col gap-24 relative z-10">
              {timelineData.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-center relative group animate-fadeInUp"
                >
                  {/* Timeline Dot removed */}
                  {/* Single Card with Image and Description - Pink background with darker pink hover */}
                  <div className="bg-[#f06d98] hover:bg-[#d63384] rounded-2xl p-0 shadow-xl border border-pink-200 hover:border-pink-400 w-full max-w-2xl transition-all duration-300 ease-in-out">
                    <Image
                      src={item.imageSrc}
                      alt={`Journey ${item.year}`}
                      width={640}
                      height={320}
                      className="rounded-t-2xl object-cover w-full h-56 md:h-72 border-b border-pink-200 group-hover:border-pink-400"
                    />
                    <div className="p-8">
                      <h3 className="font-extrabold text-2xl mb-3 !text-white tracking-tight drop-shadow-sm transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{item.year}</h3>
                      <p className="text-lg !text-white leading-relaxed font-medium transition-colors duration-300">
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
        <div className="md:w-1/2 w-full md:sticky md:top-24 md:self-start h-fit flex flex-col justify-start space-y-6">
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