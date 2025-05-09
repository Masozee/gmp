import Link from 'next/link';
import { motion } from 'framer-motion';

const EngagementBanner = () => {
  return (
    <section className="relative py-16 md:py-24 text-white bg-[#f06d98]">
      <div className="relative z-10 container mx-auto px-4 text-center max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Bergabunglah dengan Ribuan Anak Muda Indonesia yang Membuat Perbedaan
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Melalui program kami, pemuda di seluruh Indonesia menemukan suara politik mereka dan mengambil tindakan di komunitas mereka.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <Link 
              href="/stories" 
              className="bg-primary text-black hover:bg-primary-dark px-8 py-3 rounded-md font-bold text-lg inline-block"
            >
              Baca Kisah Mereka
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EngagementBanner; 