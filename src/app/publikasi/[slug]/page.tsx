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
      <section
        className="relative flex flex-col items-center justify-center bg-sky-500 py-32 text-white" // Set consistent background and padding
      >
        <div className="container relative z-10 mx-auto px-4 text-center max-w-7xl">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
            {publication.title}
          </h1>
          <p className="mb-6 text-lg text-gray-100">{publication.date}</p> {/* Adjusted text color slightly */}
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
                className="inline-block rounded bg-pink-600 px-4 py-2 font-semibold text-white no-underline hover:bg-pink-700"
              >
                Download PDF
              </a>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/publikasi" className="text-pink-600 hover:underline">
              &larr; Kembali ke Daftar Publikasi
            </Link>
          </div>
        </article>
      </section>

      {/* Related Publications Section */}
      {relatedPublications.length > 0 && (
        <section className="bg-gray-100 py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
              Publikasi Lainnya
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPublications.map((relatedPub) => {
                const relatedSlug = slugify(relatedPub.title);
                return (
                  <Link 
                    key={relatedSlug} 
                    href={`/publikasi/${relatedSlug}`} 
                    className="block overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    <div className="relative h-48 w-full">
                      {relatedPub.image ? (
                        <Image
                          src={relatedPub.image}
                          alt={relatedPub.title}
                          layout="fill"
                          objectFit="cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
                        {relatedPub.title}
                      </h3>
                      <p className="text-sm text-gray-600">{relatedPub.date}</p>
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