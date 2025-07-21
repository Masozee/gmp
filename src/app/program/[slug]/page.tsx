import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Program } from '@/lib/db/content-schema';

interface ProgramSection {
  id: string;
  title: string;
  content: string;
  image?: string;
  imagePosition: 'left' | 'right';
  backgroundColor?: 'white' | 'gray';
}

async function getProgram(slug: string): Promise<Program | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/program`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      const program = data.programs.find((p: Program) => p.slug === slug && p.isActive);
      return program || null;
    }
  } catch (error) {
    console.error('Error fetching program:', error);
  }
  
  return null;
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const program = await getProgram(resolvedParams.slug);

  if (!program) {
    notFound();
  }

  let sections: ProgramSection[] = [];
  if (program.content) {
    try {
      sections = JSON.parse(program.content);
    } catch (error) {
      console.error('Error parsing program content:', error);
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-32 text-center bg-primary text-black">
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 !text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
            {program.title}
          </h1>
          {program.subtitle && (
            <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto mb-6 !text-white">
              {program.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Program Content Sections */}
      {sections.map((section, index) => (
        <section 
          key={section.id} 
          className={section.backgroundColor === 'gray' ? 'bg-gray-50 py-16' : 'container mx-auto px-4 py-16 max-w-6xl'}
        >
          <div className={section.backgroundColor === 'gray' ? 'container mx-auto px-4 max-w-6xl' : ''}>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Image */}
              <div className={`w-full md:w-1/2 ${section.imagePosition === 'right' ? 'md:order-last' : ''}`}>
                {section.image && (
                  <Image 
                    src={section.image}
                    alt={section.title}
                    width={500}
                    height={400}
                    className="rounded-lg shadow-md object-cover w-full"
                  />
                )}
              </div>
              
              {/* Content */}
              <div className={`w-full md:w-1/2 ${section.imagePosition === 'right' ? 'md:order-first' : ''}`}>
                {section.title && (
                  <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
                    {section.title}
                  </h2>
                )}
                <div 
                  className="text-gray-700 leading-relaxed prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br/>') }}
                />
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

// Generate static params for all active programs
export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/program`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.programs
        .filter((program: Program) => program.isActive)
        .map((program: Program) => ({
          slug: program.slug,
        }));
    }
  } catch (error) {
    console.error('Error generating static params:', error);
  }
  
  return [];
} 