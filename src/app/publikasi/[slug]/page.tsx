import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'; // Import Link for related publications
import publicationsData from '@/data/publikasi.json'; // Rename import for clarity
import { slugify, parseIndonesianDate } from '@/lib/utils';
import type { Metadata /*, ResolvingMetadata*/ } from 'next';

// Define a type for the publication data
interface Publication {
  title: string;
  url: string;
  date: string;
  count: string; // Assuming count is a string based on JSON
  image: string | null;
  type: string;
  pdf_url: string | null;
  content: string;
}

// Cast the imported data to the defined type
const publications: Publication[] = publicationsData as Publication[];

// Define the PageProps interface matching Next.js 15 type definition
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

// Find publication by slug
function getPublicationBySlug(slug: string): Publication | undefined {
  return publications.find((pub) => slugify(pub.title) === slug);
}

// Generate static paths for all publications
export async function generateStaticParams() {
  return publications.map((pub) => ({
    slug: slugify(pub.title),
  }));
}

// Generate dynamic metadata
export async function generateMetadata(
  { params }: PageProps,
  /* parent: ResolvingMetadata */
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const publication = getPublicationBySlug(slug);

  if (!publication) {
    return {
      title: 'Publikasi Tidak Ditemukan',
    };
  }

  const parsedDate = parseIndonesianDate(publication.date);

  const metadata: Metadata = {
    title: `${publication.title} | Publikasi | Partisipasi Muda`,
    description: publication.content.substring(0, 160),
    openGraph: {
      title: publication.title,
      description: publication.content.substring(0, 160),
      images: publication.image ? [publication.image] : [],
      url: `/publikasi/${slug}`,
      type: 'article',
      // Add publishedTime directly if date is valid and type is article
      ...(parsedDate && { article: { published_time: parsedDate.toISOString() } }), // Use published_time for article
    },
  };

  return metadata;
}

// Detail Page Component
export default async function PublicationDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const currentSlug = resolvedParams.slug;
  const publication = getPublicationBySlug(currentSlug);

  if (!publication) {
    notFound();
  }

  // Find related publications (exclude current one, take first 3)
  const relatedPublications = publications
    .filter((pub) => slugify(pub.title) !== currentSlug)
    .slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-32 text-center bg-green-500 text-white">
        {publication.image && (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={publication.image}
              alt={publication.title}
              fill
              className="object-cover object-center opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-green-500 opacity-80"></div>
          </div>
        )}
        <div className="relative container mx-auto px-4 z-10 flex flex-col items-center justify-center max-w-7xl">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl drop-shadow-lg" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{publication.title}</h1>
          <p className="mb-6 text-lg text-white">{publication.date}</p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <article className="prose prose-lg mx-auto max-w-4xl lg:prose-xl">
          {publication.image && (
            <div className="relative my-8 h-64 w-full md:h-96">
              <Image
                src={publication.image}
                alt={`Featured image for ${publication.title}`}
                layout="fill"
                objectFit="contain"
                unoptimized
                priority
              />
            </div>
          )}

          <div className="whitespace-pre-line">{publication.content}</div>

          {publication.pdf_url && (
            <div className="not-prose mt-8 flex justify-center">
              <a
                href={publication.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded bg-green-600 px-4 py-2 font-semibold text-white no-underline hover:bg-green-700"
              >
                Download PDF
              </a>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/publikasi" className="text-green-600 hover:underline">
              &larr; Kembali ke Daftar Publikasi
            </Link>
          </div>
        </article>
      </section>

      {/* Related Publications Section */}
      {relatedPublications.length > 0 && (
        <section className="bg-gray-100 py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl text-green-600" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
              Publikasi Lainnya
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPublications.map((relatedPub) => {
                const relatedSlug = slugify(relatedPub.title);
                return (
                  <Link 
                    key={relatedSlug} 
                    href={`/publikasi/${relatedSlug}`} 
                    className="block overflow-hidden rounded-2xl shadow-lg bg-[#f06d98] transition-all duration-300 hover:bg-[#ffe066] hover:shadow-xl hover:-translate-y-1 active:bg-[#ffe066] focus:bg-[#ffe066] group"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      {relatedPub.image ? (
                        <Image
                          src={relatedPub.image}
                          alt={relatedPub.title}
                          layout="fill"
                          objectFit="cover"
                          unoptimized
                          className="transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="mb-1 inline-block rounded bg-[#ffe066] px-2 py-0.5 text-xs font-medium text-black group-hover:bg-[#f06d98] group-hover:text-white">
                        {relatedPub.type.charAt(0).toUpperCase() + relatedPub.type.slice(1)}
                      </span>
                      <div className="mb-1 text-xs text-white group-hover:text-black">
                        <span className="inline-flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {relatedPub.count} kali dilihat
                        </span>
                      </div>
                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-white group-hover:text-black" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
                        {relatedPub.title}
                      </h3>
                      <p className="mb-3 text-sm text-white line-clamp-3 group-hover:text-black">
                        {relatedPub.content.substring(0, 150)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-white group-hover:text-black">{relatedPub.date}</p>
                        <span className="text-sm font-semibold text-white flex items-center group-hover:underline group-hover:text-black">
                          Lebih lanjut
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
} 