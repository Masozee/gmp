import React from 'react';
import Image from 'next/image';
import MapWrapper from '../../components/MapWrapper';

export const metadata = {
  title: 'Reports | Partisipasi Muda',
  description: 'Activity reports and achievements of Generasi Melek Politik throughout Indonesia.',
};

const ReportsPage = () => {
  // Sample achievements data
  const achievements = [
    {
      id: 1,
      title: '34',
      description: 'Provinces in Indonesia',
      icon: '/icons/pin.png',
    },
    {
      id: 2,
      title: '250+',
      description: 'Activities Completed',
      icon: '/icons/communication.png',
    },
    {
      id: 3,
      title: '5000+',
      description: 'Participants Educated',
      icon: '/icons/global-network.png',
    },
    {
      id: 4,
      title: '100+',
      description: 'Collaboration Partners',
      icon: '/icons/team-work.png',
    },
  ];

  // Single publication data
  const publication = {
    id: 1,
    title: 'Understanding Youth Engagement and Civic Space in Indonesia',
    description: 'This study investigates how young Indonesians (ages 18-25) navigate shrinking civic space, including their perceptions of safe and youth-friendly public spaces, the challenges they face in accessing them, and their views on government responsiveness. By analyzing both politically engaged youth and those outside formal activism, this research offers a comprehensive understanding of how democratic backsliding is lived, interpreted, and resisted at the grassroots level.',
    image: '/images/bg/creative-christians-HN6uXG7GzTE-unsplash.jpg',
    link: '#',
    date: 'May 2025',
  };

  return (
    <>
      {/* Hero Section with Pink Background */}
      <section className="bg-[#f06d98] py-32 text-white">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl font-heading">
            Reports & Achievements
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Viewing the impact and reach of Generasi Melek Politik programs throughout Indonesia.
          </p>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-extrabold text-center mb-12 font-heading">Our Achievements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-[#f06d98]/10 rounded-full">
                  <Image 
                    src={item.icon} 
                    alt={item.title} 
                    width={32} 
                    height={32}
                  />
                </div>
                <h3 className="text-3xl font-extrabold text-[#f06d98] mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-extrabold text-center mb-6 font-heading">Program Reach</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Interactive map showing the reach of Generasi Melek Politik programs throughout Indonesia.
            Click on provinces to see activity details.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <MapWrapper />
          </div>
        </div>
      </section>

      {/* Single Publication Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-extrabold text-center mb-12 font-heading">Our Publications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] w-full">
              <Image 
                src={publication.image} 
                alt={publication.title} 
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <p className="text-sm text-[#f06d98] mb-2">{publication.date}</p>
              <h3 className="text-3xl font-extrabold mb-4">{publication.title}</h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">{publication.description}</p>
              <a 
                href={publication.link} 
                className="inline-flex items-center text-[#f06d98] hover:text-[#f06d98]/80 font-medium text-lg"
              >
                Read More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReportsPage; 