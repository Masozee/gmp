import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const HeroEn = () => {
  return (
    <section className="relative h-screen text-white overflow-hidden flex items-center">
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
            background: "linear-gradient(360deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,1) 100%)"
          }}
        ></div>
      </motion.div>
      <div className="relative z-10 container mx-auto px-6 max-w-7xl w-full">
        <div className="flex flex-col items-center text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 !leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Partisipasi Muda Foundation
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl mb-6 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Partisipasi Muda Foundation is a dynamic non-profit organization dedicated to building a generation of changemakers by empowering Indonesian youth aged 17-25 to participate in democracy and public policy formulation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/en/about-us/mission"
              className="bg-primary text-black hover:bg-pink-500 hover:text-white px-8 py-3 rounded-full font-bold text-lg inline-block transition duration-300 ease-in-out"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroEn; 