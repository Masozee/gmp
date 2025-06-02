'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuEnProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenuEn = ({ isOpen, onClose }: MobileMenuEnProps) => {
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);

  const toggleAboutUs = () => {
    setIsAboutUsOpen(!isAboutUsOpen);
  };

  const togglePrograms = () => {
    setIsProgramsOpen(!isProgramsOpen);
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
              {/* Close button */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
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
                    <div className="mt-2 ml-4 space-y-2">
                      <Link href="/en/programs/discussions" className="block text-gray-600 hover:text-pink-500" onClick={onClose}>
                        Public Discussions
                      </Link>
                      <Link href="/en/programs/candidate-meetings" className="block text-gray-600 hover:text-pink-500" onClick={onClose}>
                        Candidate Meetings
                      </Link>
                      <Link href="/en/programs/academia-politica" className="block text-gray-600 hover:text-pink-500" onClick={onClose}>
                        Academia Politica
                      </Link>
                      <Link href="/en/programs/council-gen-z" className="block text-gray-600 hover:text-pink-500" onClick={onClose}>
                        Council of Gen Z
                      </Link>
                    </div>
                  )}
                </div>

                {/* Other menu items */}
                <Link href="/en/publications" className="block text-gray-800 hover:text-pink-500 font-semibold" onClick={onClose}>
                  Publications
                </Link>
                <Link href="/en/reports" className="block text-gray-800 hover:text-pink-500 font-semibold" onClick={onClose}>
                  Reports
                </Link>
                <Link href="/en/events" className="block text-gray-800 hover:text-pink-500 font-semibold" onClick={onClose}>
                  Events
                </Link>
                <Link href="/en/donate" className="block text-gray-800 hover:text-pink-500 font-semibold" onClick={onClose}>
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