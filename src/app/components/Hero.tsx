import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative h-screen text-white overflow-hidden">
      <div className="absolute inset-0 z-0 w-full h-full">
        <Image
          src="/images/program/DSC08852-a.jpg"
          alt="Indonesian youth engaging in discussion"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div 
          className="absolute inset-0" 
          style={{ 
            background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 80%, rgba(0,0,0,1) 100%)" 
          }}
        ></div>
      </div>
      <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-center max-w-7xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-2xl">
          Politik Itu Tentang Kehidupan Sehari-hari
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Pendidikan, seni, lingkungan, bahkan harga kopimu—semuanya adalah kebijakan.
        </p>
        <div>
          <Link href="/learn-more" className="bg-primary text-black hover:bg-primary-dark px-8 py-3 rounded-md font-bold text-lg inline-block transition">
            Pelajari Lebih Lanjut
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero; 