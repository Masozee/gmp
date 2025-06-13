// import Link from 'next/link';
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Title and Short Description */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={textVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-main">Kamu Juga Bisa Ikut Berpartisipasi.</h2>
            <p className="text-lg text-gray-700 max-w-2xl mb-3">
            Dengan semangat gotong royong, kamu bisa berkontribusi untuk mengubah wajah demokrasi Indonesia, di mana suara orang muda tak hanya terdengar—tetapi juga diperhitungkan.
            </p>
            
          </motion.div>
          
          {/* Right: 2x2 Grid of Cards */}
          <div>
            <motion.div 
              className="grid grid-cols-2 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.div 
                className="aspect-square flex flex-col items-start justify-center bg-white hover:bg-[#f06d98] p-6 min-h-[180px] rounded-lg transition-all duration-300 group" 
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <Users className="w-9 h-9 mb-3 text-pink-400 group-hover:text-white transition-colors duration-300" />
                <div className="font-bold text-lg mb-1 text-main group-hover:text-white transition-colors duration-300">Diskusi Publik</div>
                <div className="text-sm text-gray-700 group-hover:text-white transition-colors duration-300">Kami menyelenggarakan inisiatif edukasi yang berdampak—memberdayakan mereka untuk mengambil tindakan yang tepat demi masa depan! 📚🔥</div>
              </motion.div>
              
              <motion.div 
                className="aspect-square flex flex-col items-start justify-center bg-white hover:bg-[#f06d98] p-6 min-h-[180px] rounded-lg transition-all duration-300 group" 
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <UserCheck className="w-9 h-9 mb-3 text-yellow-400 group-hover:text-white transition-colors duration-300" />
                <div className="font-bold text-lg mb-1 text-main group-hover:text-white transition-colors duration-300">Council of Gen Z & Temu Kandidat
                </div>
                <div className="text-sm text-gray-700 group-hover:text-white transition-colors duration-300">Ruang demokrasi yang aman untuk orang muda untuk menyuarakan keresahan dan aspirasi terkait masalah daerahnya kepada pemerintah.</div>
              </motion.div>
              
              <motion.div 
                className="aspect-square flex flex-col items-start justify-center bg-white hover:bg-[#f06d98] p-6 min-h-[180px] rounded-lg transition-all duration-300 group" 
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <GraduationCap className="w-9 h-9 mb-3 text-green-400 group-hover:text-white transition-colors duration-300" />
                <div className="font-bold text-lg mb-1 text-main group-hover:text-white transition-colors duration-300">Academia Politica</div>
                <div className="text-sm text-gray-700 group-hover:text-white transition-colors duration-300">Pelatihan pembuatan kebijakan publik dengan pendekatan <i>roleplay</i>, di mana anak muda berperan sebagai pemangku kebijakan. Lewat kegiatan ini, peserta dibekali wawasan seputar kebijakan publik dan <i>soft skill</i> demokratis seperti <i>public speaking</i> dan negosiasi.
                </div>
              </motion.div>
              
              <motion.div 
                className="aspect-square flex flex-col items-start justify-center bg-white hover:bg-[#f06d98] p-6 min-h-[180px] rounded-lg transition-all duration-300 group" 
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <Sparkles className="w-9 h-9 mb-3 text-sky-400 group-hover:text-white transition-colors duration-300" />
                <div className="font-bold text-lg mb-1 text-main group-hover:text-white transition-colors duration-300">Class of Climate Leaders</div>
                <div className="text-sm text-gray-700 group-hover:text-white transition-colors duration-300">Program inkubasi intensif bagi para agen perubahan muda untuk membekali mereka dengan kapasitas membangun gerakan sosial di komunitas lokalnya.</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParticipationInfo; 