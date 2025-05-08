import Link from 'next/link';
import PlaceholderImage from './PlaceholderImage';

// Define Publikasi interface based on JSON structure
interface Publikasi {
  title: string;
  url: string;
  date: string; 
  category?: string; // Added category field
  image: string | null;
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

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Publikasi Terbaru</h2>
        <p className="text-lg text-center mb-12 text-gray-600 max-w-3xl mx-auto">
          Lihat publikasi terbaru kami tentang isu-isu politik terkini dan analisis mendalam.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {displayPublikasi.map((item) => (
            <Link 
              key={item.url} 
              href={`/publikasi/${item.url}`} 
              className="bg-white overflow-hidden shadow-sm border border-secondary group hover:bg-[#F06292] transition-all duration-300"
            >
              <div className="relative h-56">
                <PlaceholderImage 
                  alt={item.title} 
                  className="object-cover"
                  imagePlaceholder={item.image || '/images/placeholder-fallback.png'}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  {item.category && (
                    <span className="text-sm text-gray-600 font-medium group-hover:text-white">
                      {item.category}
                    </span>
                  )}
                  <span className="text-sm text-gray-500 group-hover:text-white">
                    {formatDate(item.date)}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-white">{item.title}</h3>
                <span className="text-blue-600 font-medium group-hover:text-white">
                  Baca Selengkapnya
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublikasiTerbaru;
export type { Publikasi }; 