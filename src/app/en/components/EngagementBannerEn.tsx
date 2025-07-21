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
              You can also participate!
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Support Indonesian youth participation in important issues such as climate change, democracy, and mental health.
              
              <br />How? Through donations, sharing knowledge, or providing activity spaces.
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
                href="/en/donate" 
                className="bg-primary-dark hover:bg-[#e5b64e] text-[#4c3c1a] hover:text-[#4c3c1a] px-8 py-3 rounded-full font-bold text-lg inline-block transition"
              >
                Participate Now!
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EngagementBannerEn; 