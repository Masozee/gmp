import Link from 'next/link';
import { motion } from 'framer-motion';

const EngagementBannerEn = () => {
  return (
    <section className="py-16 md:py-24 px-10 bg-gray-50">
      <div className="bg-[#f06d98] text-white rounded-lg py-16 md:py-24">
        <div className="relative z-10 container mx-auto px-4 text-center max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-8 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Join young people who have participated in democracy and made change
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              We transform passion into real action for a sustainable future, by nurturing local young leaders to create real change in their communities.
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
                href="/en/stories" 
                className="bg-primary text-black hover:bg-primary-dark px-8 py-3 rounded-full font-bold text-lg inline-block"
              >
                Read Their Stories
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EngagementBannerEn; 