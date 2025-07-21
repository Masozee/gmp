import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { slugify, parseIndonesianDate } from '@/lib/utils';
import type { Metadata } from 'next';
import PublicationClientComponent from './PublicationClientComponent';
import { db } from '@/lib/db';
import { publications } from '@/lib/db/content-schema';
import { eq } from 'drizzle-orm';

// Define a type for the publication data
interface Publication {
  id: number;
  title: string;
  title_en: string | null;
  slug: string;
  slug_en: string | null;
  date: string;
  count: string;
  image_url: string | null;
  type: string;
  pdf_url: string | null;
  content: string;
  content_en: string | null;
  author: string;
  author_en: string | null;
  description: string | null;
  description_en: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Define the PageProps interface matching Next.js 15 type definition
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

// Find publication by English slug or regular slug
async function getPublicationBySlug(slug: string): Promise<Publication | undefined> {
  try {
    // First try to find by English slug
    let result = await db
      .select()
      .from(publications)
      .where(eq(publications.slug_en, slug))
      .limit(1);
    
    // If not found by English slug, try regular slug
    if (!result[0]) {
      result = await db
        .select()
        .from(publications)
        .where(eq(publications.slug, slug))
        .limit(1);
    }
    
    return result[0];
  } catch (error) {
    console.error('Error fetching publication:', error);
    return undefined;
  }
}

// Get all publications for related items and static params
async function getAllPublications(): Promise<Publication[]> {
  try {
    const result = await db
      .select()
      .from(publications)
      .orderBy(publications.order);
    
    return result;
  } catch (error) {
    console.error('Error fetching publications:', error);
    return [];
  }
}

// Format date to DD MMMM YYYY format
function formatPublicationDate(dateString: string): string {
  if (!dateString) return '';
  
  // English month names
  const englishMonths: { [key: number]: string } = {
    0: 'January', 1: 'February', 2: 'March', 3: 'April',
    4: 'May', 5: 'June', 6: 'July', 7: 'August',
    8: 'September', 9: 'October', 10: 'November', 11: 'December'
  };
  
  let date: Date;
  
  // Handle DD/MM/YYYY format
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    date = new Date(year, month - 1, day); // Month is 0-indexed in JS Date
  } else {
    // Fallback to default parsing
    date = new Date(dateString);
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return original if parsing fails
  }
  
  // Format as "05 June 2025" style
  const day = date.getDate().toString().padStart(2, '0');
  const month = englishMonths[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

// Generate static paths for all publications (include both regular and English slugs)
export async function generateStaticParams() {
  try {
    const allPublications = await getAllPublications();
    const params = [];
    
    // Add regular slugs
    allPublications.forEach((pub) => {
      params.push({ slug: pub.slug });
      // Add English slugs if they exist
      if (pub.slug_en) {
        params.push({ slug: pub.slug_en });
      }
    });
    
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate dynamic metadata
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const publication = await getPublicationBySlug(slug);

  if (!publication) {
    return {
      title: 'Publication Not Found',
    };
  }

  const parsedDate = parseIndonesianDate(publication.date);
  
  // Use English fields if available, fallback to Indonesian
  const title = publication.title_en || publication.title;
  const description = publication.description_en || publication.description || publication.content_en || publication.content;

  const metadata: Metadata = {
    title: `${title} | Publication | Partisipasi Muda`,
    description: description.substring(0, 160),
    openGraph: {
      title: title,
      description: description.substring(0, 160),
      images: publication.image_url ? [publication.image_url] : [],
      url: `/en/publications/${slug}`,
      type: 'article',
      // Add publishedTime directly if date is valid and type is article
      ...(parsedDate && { article: { published_time: parsedDate.toISOString() } }),
    },
  };

  return metadata;
}

// Helper to clean and format publication content
function cleanAndFormatPublicationContent(content: string, title: string, date: string): (string | React.ReactNode)[] {
  let cleaned = content;
  // Remove repeated title and date (case-insensitive, with or without extra whitespace)
  const patterns = [
    new RegExp(title.replace(/[.*+?^${}()|[\\]/g, '\\$&'), 'gi'),
    new RegExp(date.replace(/[.*+?^${}()|[\\]/g, '\\$&'), 'gi'),
  ];
  patterns.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, '');
  });
  // Remove multiple consecutive newlines
  cleaned = cleaned.replace(/\n{2,}/g, '\n\n');
  // Trim leading/trailing whitespace and newlines
  cleaned = cleaned.trim();

  // Split by escaped double quotes (\\") and alternate between normal and bold
  const parts = cleaned.split(/(\\"[^\\\"]+\\")/g);
  return parts.map((part, idx) => {
    if (/^\\\".*\\\"$/.test(part)) {
      return <b key={idx}>{part.replace(/\\\"/g, '')}</b>;
    }
    return part;
  });
}

// Detail Page Component
export default async function PublicationDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const currentSlug = resolvedParams.slug;
  const publication = await getPublicationBySlug(currentSlug);

  if (!publication) {
    notFound();
  }

  // Find related publications (exclude current one, take first 3)
  const allPublications = await getAllPublications();
  const relatedPublications = allPublications
    .filter((pub) => pub.slug !== currentSlug && pub.slug_en !== currentSlug)
    .slice(0, 3);

  // Use English fields if available, fallback to Indonesian
  const title = publication.title_en || publication.title;
  const content = publication.content_en || publication.content;
  const author = publication.author_en || publication.author;

  return (
    <>
      {/* Hero Section */}
      <section className="py-32 text-center text-white" style={{backgroundColor: 'var(--success)'}}>
        <div className="container mx-auto px-4 flex flex-col items-center justify-center max-w-7xl">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl !text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{title}</h1>
          <p className="mb-6 text-lg !text-white">{formatPublicationDate(publication.date)}</p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <article className="prose prose-lg mx-auto max-w-4xl lg:prose-xl prose-p:text-justify">
          {publication.image_url && (
            <div className="relative my-8 h-64 w-full md:h-96">
              <Image
                src={publication.image_url}
                alt={`Featured image for ${title}`}
                fill
                style={{ objectFit: 'contain' }}
                unoptimized
                priority
              />
            </div>
          )}

          <div className="whitespace-pre-line text-justify leading-relaxed !text-justify">
            {cleanAndFormatPublicationContent(content, title, publication.date)}
          </div>

          <PublicationClientComponent 
            publication={publication} 
            currentSlug={currentSlug} 
          />

          <div className="mt-12 text-center">
            <Link href="/en/publications" className="text-green-600 hover:underline">
              &larr; Back to Publications
            </Link>
          </div>
        </article>
      </section>

      {/* Related Publications Section */}
      {relatedPublications.length > 0 && (
        <section className="bg-gray-100 py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl text-green-600" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
              Other Publications
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPublications.map((relatedPub) => {
                return (
                  <div 
                    key={relatedPub.slug} 
                    className="flex flex-col overflow-hidden rounded-2xl shadow-lg bg-[#f06d98] transition-all duration-300 hover:bg-[#ffe066] hover:shadow-xl hover:-translate-y-1 active:bg-[#ffe066] focus:bg-[#ffe066] group"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      {relatedPub.image_url ? (
                        <Image
                          src={relatedPub.image_url}
                          alt={relatedPub.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          unoptimized
                          className="transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col h-full">
                      {/* Category first */}
                      <span className="mb-2 inline-block rounded bg-[#ffe066] px-2 py-1 text-xs font-medium text-black group-hover:bg-[#f06d98] group-hover:text-white w-fit">
                        {relatedPub.type.charAt(0).toUpperCase() + relatedPub.type.slice(1)}
                      </span>
                      
                      {/* Title second (as a link) */}
                      <Link href={`/en/publications/${relatedPub.slug}`}>
                        <h3 className="mb-3 text-lg font-semibold text-white group-hover:text-black hover:underline" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
                          {relatedPub.title}
                        </h3>
                      </Link>
                      
                      {/* Content snippet - takes remaining space */}
                      <p className="mb-4 text-sm text-white line-clamp-3 group-hover:text-black flex-grow">
                        {relatedPub.content.substring(0, 150)}...
                      </p>
                      
                      {/* Date and view count at bottom - always at bottom */}
                      <div className="mt-auto pt-3 border-t border-white/20 group-hover:border-black/20">
                        <div className="flex justify-between items-center text-xs">
                          {/* Date - formatted as dd/mmmm/yyyy */}
                          <p className="text-white group-hover:text-white">{formatPublicationDate(relatedPub.date)}</p>
                          
                          {/* View counter */}
                          <div>
                            <span className="inline-flex items-center text-white group-hover:text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-white group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {relatedPub.count} views
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
