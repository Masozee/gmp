// import Link from 'next/link';
import { Users, UserCheck, GraduationCap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ParticipationInfoEn = () => {
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
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">You Can Also Participate.</h2>
            <p className="text-lg text-gray-700 max-w-2xl mb-3">
            With the spirit of collaboration, you can contribute to transforming Indonesia's democratic landscape, where young voices are not only heard—but also valued and impactful.
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
                className="aspect-square flex flex-col items-start justify-center p-6 min-h-[180px] rounded-lg group hover:bg-[#f06d98] transition-all duration-300" 
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <Users className="w-9 h-9 mb-3 text-pink-400 group-hover:text-white transition-colors duration-300" />
                <div className="font-bold text-lg mb-1 text-gray-900 group-hover:text-white transition-colors duration-300">Public Discussions</div>
                <div className="text-sm text-gray-700 group-hover:text-white transition-colors duration-300">We organize impactful educational initiatives—empowering them to take the right actions for the future! 📚🔥</div>
              </motion.div>
              
              <motion.div 
                className="aspect-square flex flex-col items-start justify-center p-6 min-h-[180px] rounded-lg group hover:bg-[#f06d98] transition-all duration-300" 
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <UserCheck className="w-9 h-9 mb-3 text-yellow-400 group-hover:text-white transition-colors duration-300" />
                <div className="font-bold text-lg mb-1 text-gray-900 group-hover:text-white transition-colors duration-300">Council of Gen Z & Candidate Meetings
                </div>
                <div className="text-sm text-gray-700 group-hover:text-white transition-colors duration-300">A safe democratic space for young people to voice their concerns and aspirations regarding local issues to the government.</div>
              </motion.div>
              
              <motion.div 
                className="aspect-square flex flex-col items-start justify-center p-6 min-h-[180px] rounded-lg group hover:bg-[#f06d98] transition-all duration-300" 
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <GraduationCap className="w-9 h-9 mb-3 text-green-400 group-hover:text-white transition-colors duration-300" />
                <div className="font-bold text-lg mb-1 text-gray-900 group-hover:text-white transition-colors duration-300">Academia Politica</div>
                <div className="text-sm text-gray-700 group-hover:text-white transition-colors duration-300">Public policy-making training with a roleplay approach, where young people act as policy stakeholders. Through this activity, participants are equipped with insights about public policy and democratic soft skills such as public speaking and negotiation.
                </div>
              </motion.div>
              
              <motion.div 
                className="aspect-square flex flex-col items-start justify-center p-6 min-h-[180px] rounded-lg group hover:bg-[#f06d98] transition-all duration-300" 
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <Sparkles className="w-9 h-9 mb-3 text-sky-400 group-hover:text-white transition-colors duration-300" />
                <div className="font-bold text-lg mb-1 text-gray-900 group-hover:text-white transition-colors duration-300">Class of Climate Leaders</div>
                <div className="text-sm text-gray-700 group-hover:text-white transition-colors duration-300">An intensive incubation program for young change agents to equip them with the capacity to build social movements in their local communities.</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParticipationInfoEn; 