"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PageContent } from '@/lib/db/content-schema';
import ImageSlideshow from '@/app/components/ImageSlideshow';

interface PageSection {
  id: string;
  type: 'text' | 'image' | 'text_image' | 'list' | 'slideshow';
  title?: string;
  content?: string;
  image?: string;
  imageAlt?: string;
  items?: string[];
  slides?: Array<{
    image: string;
    description?: string;
    alt?: string;
  }>;
}

interface DynamicPageRendererProps {
  pageKey: string;
  fallbackContent?: React.ReactNode;
}

export default function DynamicPageRenderer({ pageKey, fallbackContent }: DynamicPageRendererProps) {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const response = await fetch(`/api/page-content?pageKey=${pageKey}`);
        if (response.ok) {
          const data = await response.json();
          setPageContent(data);
        } else if (response.status === 404) {
          // Page content not found, use fallback
          setError('Page content not found');
        } else {
          setError('Failed to fetch page content');
        }
      } catch (error) {
        console.error('Error fetching page content:', error);
        setError('Failed to fetch page content');
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, [pageKey]);

  const renderSection = (section: PageSection) => {
    switch (section.type) {
      case 'text':
        return (
          <div key={section.id} className="mb-6">
            {section.title && (
              <h2 className="text-2xl font-bold text-center my-6">{section.title}</h2>
            )}
            {section.content && (
              <p className="mb-6 text-gray-700 leading-relaxed">
                {section.content}
              </p>
            )}
          </div>
        );

      case 'image':
        return (
          <div key={section.id} className="mb-6">
            {section.title && (
              <h2 className="text-2xl font-bold text-center my-6">{section.title}</h2>
            )}
            {section.image && (
              <div className="flex justify-center">
                <Image
                  src={section.image}
                  alt={section.imageAlt || 'Section image'}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-md object-cover"
                />
              </div>
            )}
          </div>
        );

      case 'text_image':
        return (
          <div key={section.id} className="mb-8">
            {section.title && (
              <h2 className="text-2xl font-bold text-center my-6">{section.title}</h2>
            )}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {section.image && (
                <div className="w-full md:w-1/2">
                  <Image
                    src={section.image}
                    alt={section.imageAlt || 'Section image'}
                    width={500}
                    height={400}
                    className="rounded-lg shadow-md object-cover w-full"
                  />
                </div>
              )}
              {section.content && (
                <div className="w-full md:w-1/2">
                  <p className="text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'list':
        return (
          <div key={section.id} className="mb-6">
            {section.title && (
              <h2 className="text-2xl font-bold text-center my-6">{section.title}</h2>
            )}
            {section.items && section.items.length > 0 && (
              <ul className="space-y-4">
                {section.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">✅</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case 'slideshow':
        return (
          <div key={section.id} className="mb-8">
            {section.title && (
              <h2 className="text-2xl font-bold text-center my-6">{section.title}</h2>
            )}
            {section.slides && section.slides.length > 0 && (
              <ImageSlideshow 
                slides={section.slides.map(slide => ({
                  image: slide.image,
                  description: slide.description || ''
                }))} 
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !pageContent) {
    return fallbackContent || (
      <div className="text-center py-8">
        <p className="text-gray-600">Content not available</p>
      </div>
    );
  }

  let sections: PageSection[] = [];
  try {
    sections = JSON.parse(pageContent.sections);
  } catch (error) {
    console.error('Error parsing sections:', error);
    return fallbackContent || (
      <div className="text-center py-8">
        <p className="text-gray-600">Error loading content</p>
      </div>
    );
  }

  const heroStyle = pageContent.heroBackgroundImage
    ? {
        backgroundImage: `url(${pageContent.heroBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        backgroundColor: pageContent.heroBackgroundColor || '#f06d98',
      };

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative py-32 text-center text-white"
        style={heroStyle}
      >
        {pageContent.heroBackgroundImage && (
          <div className="absolute inset-0 bg-black opacity-50"></div>
        )}
        <div className="relative container mx-auto px-4 z-10">
          {pageContent.heroTitle && (
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
              {pageContent.heroTitle}
            </h1>
          )}
          {pageContent.heroSubtitle && (
            <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
              {pageContent.heroSubtitle}
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose lg:prose-xl max-w-none mx-auto">
          {sections.map(renderSection)}
        </div>
      </div>
    </>
  );
} 