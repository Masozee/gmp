import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative h-screen text-white overflow-hidden flex items-end pb-32  md:pb-24">
      <motion.div 
        className="absolute inset-0 z-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
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
            background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,1) 100%)" 
          }}
        ></div>
      </motion.div>
      
      <div className="relative z-10 container mx-auto px-6 max-w-7xl w-full">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          {/* Left Column (8/12) */}
          <div className="lg:w-8/12">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 !leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Politik itu tentang kehidupan sehari-hari
            </motion.h1>
          </div>
          
          {/* Right Column (4/12) */}
          <div className="lg:w-4/12 flex flex-col items-start lg:items-end">
            <motion.p 
              className="text-lg md:text-xl mb-6 lg:text-right"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Pendidikan, seni, lingkungan, bahkan harga kopimu—semuanya adalah kebijakan.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/tentang-kami"
                className="bg-primary text-black hover:bg-primary-dark px-8 py-3 rounded-md font-bold text-lg inline-block transition duration-300 ease-in-out"
              >
                Pelajari Lebih Lanjut
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 