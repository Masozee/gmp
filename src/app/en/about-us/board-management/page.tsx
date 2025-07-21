import React from 'react';
import Image from 'next/image';
import boardData from '@/data/board.json'; 
import pengurusData from '@/data/pengurus-gmp.json';

// Define interfaces for type safety
interface Member {
  name: string;
  photo: string;
  title?: string;
  position?: string;
}

const BoardManagementPage = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Board & Management</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
            Meet the team behind Partisipasi Muda Foundation.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        
        {/* Board Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-pink-500" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Board of Trustees & Supervisors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {boardData.map((member: Member, index: number) => (
              <div key={`board-${index}`} className="bg-white rounded-lg shadow-lg text-center overflow-hidden flex flex-col border border-gray-100 transition-all duration-300 hover:border-yellow-300">
                <div className="relative w-full h-80">
                    <Image 
                        src={member.photo}
                        alt={member.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-all duration-300"
                    />
                </div>
                <div className="p-4 mt-auto">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-semibold text-base text-black">{member.name}</span>
                    <span className="font-semibold text-base text-black">{member.title || member.position}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pengurus Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center text-pink-500" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Daily Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {pengurusData.map((member: Member, index: number) => (
                 <div key={`pengurus-${index}`} className="bg-white rounded-lg shadow-lg text-center overflow-hidden flex flex-col border border-gray-100 transition-all duration-300 hover:border-yellow-300">
                     <div className="relative w-full h-80">
                        <Image 
                            src={member.photo}
                            alt={member.name}
                            fill
                            style={{ objectFit: 'cover' }}
                             className="transition-all duration-300"
                        />
                    </div>
                    <div className="p-4 mt-auto">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold text-base text-black">{member.name}</span>
                      <span className="font-semibold text-base text-black">{member.position || member.title}</span>
                    </div>
                    </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
};

export default BoardManagementPage; 