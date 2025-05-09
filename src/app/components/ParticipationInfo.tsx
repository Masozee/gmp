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
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Bagaimana Anda Bisa Berpartisipasi</h2>
            <p className="text-lg text-gray-700 max-w-2xl mb-3">
              Pilih peran yang sesuai dengan minat dan keahlianmu untuk ikut serta membangun masa depan demokrasi Indonesia. Dengan bergabung, kamu akan mendapatkan kesempatan untuk memperluas wawasan, mengembangkan keterampilan, dan membangun jaringan dengan individu serta komunitas yang memiliki visi serupa.
            </p>
            <p className="text-lg text-gray-700 max-w-2xl">
              Partisipasimu tidak hanya memberikan dampak positif bagi dirimu sendiri, tetapi juga berkontribusi langsung dalam menciptakan perubahan nyata bagi bangsa. Jadilah bagian dari gerakan yang mendorong inovasi, kolaborasi, dan kemajuan bersama demi Indonesia yang lebih baik.
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
                className="aspect-square flex flex-col items-start justify-center shadow bg-pink-50 p-6 border border-gray-200 min-h-[180px]" 
                style={{borderRadius: 0}}
                variants={cardVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <Users className="w-9 h-9 mb-3 text-pink-400" />
                <div className="font-bold text-lg mb-1 text-gray-900">Diskusi</div>
                <div className="text-sm text-gray-700">Sesi diskusi politik yang menyenangkan dan interaktif bersama anak muda lainnya.</div>
              </motion.div>
              
              <motion.div 
                className="aspect-square flex flex-col items-start justify-center shadow bg-yellow-50 p-6 border border-gray-200 min-h-[180px]" 
                style={{borderRadius: 0}}
                variants={cardVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <UserCheck className="w-9 h-9 mb-3 text-yellow-400" />
                <div className="font-bold text-lg mb-1 text-gray-900">Temu Kandidat</div>
                <div className="text-sm text-gray-700">Dialog langsung dengan calon pemimpin masa depan Indonesia.</div>
              </motion.div>
              
              <motion.div 
                className="aspect-square flex flex-col items-start justify-center shadow bg-green-50 p-6 border border-gray-200 min-h-[180px]" 
                style={{borderRadius: 0}}
                variants={cardVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <GraduationCap className="w-9 h-9 mb-3 text-green-400" />
                <div className="font-bold text-lg mb-1 text-gray-900">Academia Politica</div>
                <div className="text-sm text-gray-700">Program pengembangan kapasitas dan kepemimpinan politik untuk pemuda.</div>
              </motion.div>
              
              <motion.div 
                className="aspect-square flex flex-col items-start justify-center shadow bg-blue-50 p-6 border border-gray-200 min-h-[180px]" 
                style={{borderRadius: 0}}
                variants={cardVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <Sparkles className="w-9 h-9 mb-3 text-sky-400" />
                <div className="font-bold text-lg mb-1 text-gray-900">Council of Gen Z</div>
                <div className="text-sm text-gray-700">Komunitas anak muda yang mendorong perubahan nyata di Indonesia.</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParticipationInfo; 