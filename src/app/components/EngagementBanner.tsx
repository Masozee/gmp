import Link from 'next/link';
import PlaceholderImage from './PlaceholderImage';

const EngagementBanner = () => {
  return (
    <section className="relative py-16 md:py-24 text-white">
      <div className="absolute inset-0 z-0">
        <PlaceholderImage 
          alt="Youth actively participating in civic engagement" 
          className="object-cover"
          imagePlaceholder="/images/bg/papaioannou-kostas-tysecUm5HJA-unsplash.jpg"
        />
        <div className="absolute inset-0 bg-[#59caf5]/70"></div>
      </div>
      <div className="relative z-10 container mx-auto px-4 text-center max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Bergabunglah dengan Ribuan Anak Muda Indonesia yang Membuat Perbedaan</h2>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Melalui program kami, pemuda di seluruh Indonesia menemukan suara politik mereka dan mengambil tindakan di komunitas mereka.
        </p>
        <Link href="/stories" className="bg-primary text-black hover:bg-primary-dark px-8 py-3 rounded-md font-bold text-lg inline-block transition">
          Baca Kisah Mereka
        </Link>
      </div>
    </section>
  );
};

export default EngagementBanner; 