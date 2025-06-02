// import { notFound } from 'next/navigation';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
// import Link from 'next/link';
// import { slugify } from '@/lib/utils'; 

interface PastEvent {
  title: string;
  slug: string;
  image: string;
  date: string;
  description: string;
}

// Define the PageProps interface matching Next.js 15 type definition
interface PageProps {
  params: { slug: string };
}

// Remove data reading functions
// function getDiskusiData(): PastEvent[] { ... }
// function getEventBySlug(slug: string): PastEvent | undefined { ... }

// Generate static paths - Minimal hardcoded example
/*
export async function generateStaticParams() {
  // In a real scenario, you'd fetch/read slugs here
  // For testing, return a minimal hardcoded array
  return [{ slug: 'test-slug-1' }, { slug: 'test-slug-2' }];
}
*/

// Page component (Server Component) - Using explicit Props type
export default async function DiscussionDetailPage({ params }: PageProps) {
  const slug = params.slug;

  // Read and parse the JSON file
  const filePath = path.join(process.cwd(), 'src', 'data', 'diskusi.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const events: PastEvent[] = JSON.parse(jsonData);
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    return (
      <section className="py-32 text-center bg-gray-100">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Discussion Not Found</h1>
          <p className="text-lg text-gray-600">Discussion event with slug &quot;{slug}&quot; was not found.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section with Image */}
      <section className="relative py-32 text-center bg-[#f06d98] text-white">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover object-center opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-[#f06d98] opacity-80"></div>
        </div>
        <div className="relative container mx-auto px-4 z-10 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">{event.title}</h1>
          <p className="text-lg text-pink-100 mb-2">{event.date}</p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">{event.title}</h2>
          <p className="text-gray-700 mb-2"><span className="font-semibold">Date:</span> {event.date}</p>
          <p className="text-gray-700 mb-2"><span className="font-semibold">Location/Details:</span> {event.description}</p>
        </div>
      </section>
    </>
  );
} 