import Link from 'next/link';
import { Users, UserCheck, GraduationCap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ParticipationInfo = () => {
  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Title and Short Description - Text Centered */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={textVariants}
            className="mb-6 md:mb-0 text-center flex flex-col justify-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-main">Program YPM Untuk Meningkatkan Partisipasi Orang Muda Indonesia
            </h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto mb-3">
            Dengan semangat gotong royong, kamu bisa berkontribusi untuk mengubah wajah demokrasi Indonesia, di mana suara orang muda tak hanya terdengar—tetapi juga diperhitungkan.
            </p>
          </motion.div>
          
          {/* Right: Grid of Cards */}
          <div>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.div 
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Link href="/program/diskusi" className="block h-full">
                  <div className="flex flex-col items-start justify-start bg-white hover:bg-[#f06d98] p-4 sm:p-6 rounded-lg transition-all duration-300 group shadow-sm cursor-pointer h-full">
                    <Users className="w-8 h-8 sm:w-9 sm:h-9 mb-3 text-pink-400 group-hover:text-white transition-colors duration-300" />
                    <div className="font-bold text-base sm:text-lg mb-1 text-main group-hover:text-white transition-colors duration-300">Diskusi Publik</div>
                    <div className="text-sm text-gray-700 group-hover:text-white transition-colors duration-300">Kami menyelenggarakan inisiatif edukasi yang berdampak—memberdayakan mereka untuk mengambil tindakan yang tepat demi masa depan! 📚🔥</div>
                  </div>
                </Link>
              </motion.div>
              
              <motion.div 
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Link href="/program/temu-kandidat" className="block h-full">
                  <div className="flex flex-col items-start justify-start bg-white hover:bg-[#f06d98] p-4 sm:p-6 rounded-lg transition-all duration-300 group shadow-sm cursor-pointer h-full">
                    <UserCheck className="w-8 h-8 sm:w-9 sm:h-9 mb-3 text-yellow-400 group-hover:text-white transition-colors duration-300" />
                    <div className="font-bold text-base sm:text-lg mb-1 text-main group-hover:text-white transition-colors duration-300">Council of Gen Z & Temu Kandidat
                    </div>
                    <div className="text-sm text-gray-700 group-hover:text-white transition-colors duration-300">Ruang demokrasi yang aman untuk orang muda untuk menyuarakan keresahan dan aspirasi terkait masalah daerahnya kepada pemerintah.</div>
                  </div>
                </Link>
              </motion.div>
              
              <motion.div 
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Link href="/program/academia-politica" className="block h-full">
                  <div className="flex flex-col items-start justify-start bg-white hover:bg-[#f06d98] p-4 sm:p-6 rounded-lg transition-all duration-300 group shadow-sm cursor-pointer h-full">
                    <GraduationCap className="w-8 h-8 sm:w-9 sm:h-9 mb-3 text-green-400 group-hover:text-white transition-colors duration-300" />
                    <div className="font-bold text-base sm:text-lg mb-1 text-main group-hover:text-white transition-colors duration-300">Academia Politica</div>
                    <div className="text-sm text-gray-700 group-hover:text-white transition-colors duration-300">Pelatihan pembuatan kebijakan publik dengan pendekatan <i>roleplay</i>, di mana anak muda berperan sebagai pemangku kebijakan. Lewat kegiatan ini, peserta dibekali wawasan seputar kebijakan publik dan <i>soft skill</i> demokratis seperti <i>public speaking</i> dan negosiasi.
                    </div>
                  </div>
                </Link>
              </motion.div>
              
              <motion.div 
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Link href="/program/class-of-climate-leaders" className="block h-full">
                  <div className="flex flex-col items-start justify-start bg-white hover:bg-[#f06d98] p-4 sm:p-6 rounded-lg transition-all duration-300 group shadow-sm cursor-pointer h-full">
                    <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 mb-3 text-sky-400 group-hover:text-white transition-colors duration-300" />
                    <div className="font-bold text-base sm:text-lg mb-1 text-main group-hover:text-white transition-colors duration-300">Class of Climate Leaders</div>
                    <div className="text-sm text-gray-700 group-hover:text-white transition-colors duration-300">Program inkubasi intensif bagi para agen perubahan muda untuk membekali mereka dengan kapasitas membangun gerakan sosial di komunitas lokalnya.</div>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParticipationInfo; 