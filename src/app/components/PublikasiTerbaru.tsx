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

  // Function to format date - handles multiple date formats
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    let date: Date = new Date(); // Initialize with current date as fallback
    
    // Handle DD/MM/YYYY format
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        // Format: DD/MM/YYYY
        date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else if (parts.length === 2) {
        // Format: MM/YYYY
        date = new Date(`${parts[1]}-${parts[0]}-01`);
      }
    } 
    // Handle "DD Month YYYY" format in Indonesian
    else if (dateString.includes(' ')) {
      const monthMap: { [key: string]: string } = {
        'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
        'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
        'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
      };
      
      const parts = dateString.split(' ');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = monthMap[parts[1]] || '01';
        const year = parts[2];
        date = new Date(`${year}-${month}-${day}`);
      }
    } 
    // Default attempt with standard date parsing
    else {
      date = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Tanggal tidak tersedia';
    }
    
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-main">Publikasi Terbaru</h2>
        <p className="text-lg text-center mb-12 text-gray-600 max-w-3xl mx-auto">
        Lihat publikasi terbaru kami tentang isu-isu yang kami perjuangkan.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {displayPublikasi.map((item) => (
            <div 
              key={item.url} 
              className="bg-[#f06d98] overflow-hidden shadow-xl rounded-2xl group hover:bg-[#d86288] transition-all duration-300"
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
                    <span className="text-sm text-white font-medium">
                      {item.category}
                    </span>
                  )}
                  <span className="text-sm text-white">
                    {formatDate(item.date)}
                  </span>
                </div>
                <Link href={`/publikasi/${item.url}`}>
                  <h3 className="text-xl font-bold mb-2 text-white cursor-pointer hover:underline">{item.title}</h3>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/publikasi" 
            className="inline-block bg-primary-dark hover:bg-[#e5b64e] text-[#4c3c1a] hover:text-[#4c3c1a] rounded-full px-6 py-3 font-medium transition">
            Lihat Semua Publikasi
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PublikasiTerbaru;
export type { Publikasi }; 