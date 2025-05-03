import Link from 'next/link';
import PlaceholderImage from './PlaceholderImage';

// Define Publikasi interface based on JSON structure
interface Publikasi {
  title: string;
  url: string;
  date: string; 
  image: string | null; // Assuming image can sometimes be null
  content: string;
  // Add other relevant fields if needed, e.g., pdf_url, type
}

interface PublikasiTerbaruProps {
  publikasi?: Publikasi[]; // Change prop name and type
}

// Rename component
const PublikasiTerbaru = ({ publikasi }: PublikasiTerbaruProps) => {
  // Use the provided publikasi data, or an empty array if none provided
  const displayPublikasi = publikasi || []; 

  // Handle case where there might be no publications
  if (displayPublikasi.length === 0) {
    // Optionally return null or a message like "No recent publications."
    // For now, let's return null to hide the section if empty
    return null; 
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Publikasi Terbaru</h2>
        <p className="text-lg text-center mb-12 text-gray-600 max-w-3xl mx-auto">
          Lihat publikasi terbaru kami tentang isu-isu politik terkini dan analisis mendalam.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {displayPublikasi.map((item) => (
            <div key={item.url} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="relative h-56">
                <PlaceholderImage 
                  alt={item.title} 
                  className="object-cover"
                  imagePlaceholder={item.image || '/images/placeholder-fallback.png'}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.content ? item.content.substring(0, 150) + (item.content.length > 150 ? '...' : '') : 'Deskripsi tidak tersedia.'}
                </p>
                <Link href={`/publikasi/${item.url}`} className="text-blue-600 font-medium hover:underline">
                  Baca Selengkapnya →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublikasiTerbaru;
export type { Publikasi }; 