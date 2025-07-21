'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

interface MobileMenuEnProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenuEn = ({ isOpen, onClose }: MobileMenuEnProps) => {
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Language switching function
  const switchLanguage = () => {
    const currentPath = pathname;
    if (currentPath.startsWith('/en')) {
      // Switch to Indonesian - remove /en prefix
      const newPath = currentPath.replace('/en', '') || '/';
      router.push(newPath);
    } else {
      // Switch to English - add /en prefix
      const newPath = `/en${currentPath}`;
      router.push(newPath);
    }
    onClose(); // Close mobile menu after switching
  };

  // Get current language
  const currentLanguage = pathname.startsWith('/en') ? 'EN' : 'ID';

  const toggleAboutUs = () => {
    setIsAboutUsOpen(!isAboutUsOpen);
  };

  const togglePrograms = () => {
    setIsProgramsOpen(!isProgramsOpen);
  };

  const handleSearch = () => {
    router.push('/en/search');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <Link href="/en" onClick={onClose} className="flex items-center">
                  <Image 
                    src="/images/logo/Logo-name-stack.png" 
                    alt="Partisipasi Muda Logo" 
                    width={120} 
                    height={40} 
                    className="h-10 w-auto"
                  />
                </Link>
                
                <div className="flex items-center gap-3">
                  {/* Language Switcher */}
                  <button 
                    onClick={switchLanguage}
                    className="bg-primary-dark hover:bg-[#e5b64e] text-[#4c3c1a] hover:text-[#4c3c1a] px-3 py-1.5 rounded-full font-semibold transition text-sm"
                    aria-label={`Switch to ${currentLanguage === 'EN' ? 'Indonesian' : 'English'}`}
                    title={`Switch to ${currentLanguage === 'EN' ? 'Indonesian' : 'English'}`}
                  >
                    {currentLanguage}
                  </button>
                  
                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    className="bg-primary-dark hover:bg-[#e5b64e] text-[#4c3c1a] hover:text-[#4c3c1a] w-10 h-10 rounded-full font-bold transition flex items-center justify-center"
                    aria-label="Search"
                  >
                    <Search size={18} />
                  </button>
                  
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Menu items */}
              <nav className="space-y-4">
                {/* About Us */}
                <div>
                  <button
                    onClick={toggleAboutUs}
                    className="flex items-center justify-between w-full text-left text-gray-800 hover:text-pink-500 font-semibold"
                  >
                    About Us
                    <svg
                      className={`w-4 h-4 transition-transform ${isAboutUsOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isAboutUsOpen && (
                    <div className="mt-2 ml-4 space-y-2">
                      <Link href="/en/about-us/mission" className="block text-gray-600 hover:text-pink-500" onClick={onClose}>
                        Our Mission
                      </Link>
                      <Link href="/en/about-us/journey" className="block text-gray-600 hover:text-pink-500" onClick={onClose}>
                        Our Journey
                      </Link>
                      <Link href="/en/about-us/board-management" className="block text-gray-600 hover:text-pink-500" onClick={onClose}>
                        Board & Management
                      </Link>
                    </div>
                  )}
                </div>

                {/* Programs */}
                <div>
                  <button
                    onClick={togglePrograms}
                    className="flex items-center justify-between w-full text-left text-gray-800 hover:text-pink-500 font-semibold"
                  >
                    Programs
                    <svg
                      className={`w-4 h-4 transition-transform ${isProgramsOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isProgramsOpen && (
                    <div className="mt-2 ml-4 space-y-3">
                      {/* Climate Change Category */}
                      <div>
                        <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                          Climate Change
                        </div>
                        <div className="space-y-1 ml-2">
                          <Link href="/en/programs/academia-politica" className="block text-gray-600 hover:text-pink-500 text-sm" onClick={onClose}>
                            Academia Politica
                          </Link>
                          <Link href="/en/programs/council-gen-z" className="block text-gray-600 hover:text-pink-500 text-sm" onClick={onClose}>
                            Council of Gen Z
                          </Link>
                          <Link href="/en/programs/candidate-meetings" className="block text-gray-600 hover:text-pink-500 text-sm" onClick={onClose}>
                            Candidate Meetings
                          </Link>
                          <Link href="/en/programs/class-of-climate-leaders" className="block text-gray-600 hover:text-pink-500 text-sm" onClick={onClose}>
                            Class of Climate Leaders
                          </Link>
                        </div>
                      </div>

                      {/* Civic Space Category */}
                      <div>
                        <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                          Civic Space
                        </div>
                        <div className="ml-2">
                          <Link href="/en/civic-space" className="block text-gray-600 hover:text-pink-500 text-sm" onClick={onClose}>
                            Research
                          </Link>
                        </div>
                      </div>

                      {/* Youth Empowerment Category */}
                      <div>
                        <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                          Youth Empowerment
                        </div>
                        <div className="ml-2">
                          <div className="flex items-center text-gray-400 text-sm">
                            <span>HappyMind Activists</span>
                            <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded-full font-bold ml-2">
                              SOON
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Other menu items */}
                <Link href="/en/publications" className="block text-gray-800 hover:text-pink-500 font-semibold" onClick={onClose}>
                  Publications
                </Link>
                <Link href="/en/civic-space" className="block text-gray-800 hover:text-pink-500 font-semibold relative" onClick={onClose}>
                  Civic Space Reports
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold text-[10px] shadow-sm">
                    NEW
                  </span>
                </Link>
                <Link href="/en/events" className="block text-gray-800 hover:text-pink-500 font-semibold" onClick={onClose}>
                  Events
                </Link>
                <Link href="/en/donate" className="block text-gray-800 hover:text-[#e5b64e] font-semibold" onClick={onClose}>
                  Support Us
                </Link>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenuEn; 