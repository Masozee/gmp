import Link from 'next/link';
import PlaceholderImage from '../../components/PlaceholderImage';

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

interface PublikasiTerbaruEnProps {
  publikasi?: Publikasi[]; // Change prop name and type
}

// Rename component
const PublikasiTerbaruEn = ({ publikasi }: PublikasiTerbaruEnProps) => {
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
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Latest Publications</h2>
        <p className="text-lg text-center mb-12 text-gray-600 max-w-3xl mx-auto">
        See our latest publications on the issues we fight for.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {displayPublikasi.map((item) => (
            <Link 
              key={item.url} 
              href={`/en/publications/${item.url}`} 
              className="bg-[#f06d98] overflow-hidden shadow-xl rounded-2xl group hover:bg-[#ffe066] active:bg-[#ffe066] focus:bg-[#ffe066] transition-all duration-300"
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
                    <span className="text-sm text-white font-medium group-hover:text-black group-active:text-black group-focus:text-black">
                      {item.category}
                    </span>
                  )}
                  <span className="text-sm text-pink-100 group-hover:text-black group-active:text-black group-focus:text-black">
                    {formatDate(item.date)}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-black group-active:text-black group-focus:text-black">{item.title}</h3>
                <button className="mt-3 px-4 py-2 rounded-full bg-[#ffe066] text-black font-medium group-hover:bg-[#f06d98] group-hover:text-white transition-colors duration-300">
                  Read More
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublikasiTerbaruEn;
export type { Publikasi }; 