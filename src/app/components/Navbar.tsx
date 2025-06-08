'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MobileMenu from './MobileMenu';
import { Search } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isTentangKamiOpen, setIsTentangKamiOpen] = useState(false);
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const tentangKamiTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const programTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTentangKamiEnter = () => {
    if (tentangKamiTimeoutRef.current) {
      clearTimeout(tentangKamiTimeoutRef.current);
      tentangKamiTimeoutRef.current = null;
    }
    setIsTentangKamiOpen(true);
  };

  const handleTentangKamiLeave = () => {
    tentangKamiTimeoutRef.current = setTimeout(() => {
      setIsTentangKamiOpen(false);
    }, 300); // 300ms delay before closing
  };

  const handleProgramEnter = () => {
    if (programTimeoutRef.current) {
      clearTimeout(programTimeoutRef.current);
      programTimeoutRef.current = null;
    }
    setIsProgramOpen(true);
  };

  const handleProgramLeave = () => {
    programTimeoutRef.current = setTimeout(() => {
      setIsProgramOpen(false);
    }, 300); // 300ms delay before closing
  };

  const toggleSearchForm = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Handle scroll event
  useEffect(() => {
    // Check initial scroll position
    if (window.scrollY > 50) {
      setHasScrolled(true);
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Clear any lingering timeouts
      if (tentangKamiTimeoutRef.current) clearTimeout(tentangKamiTimeoutRef.current);
      if (programTimeoutRef.current) clearTimeout(programTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {/* Search Popup */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Cari</h3>
              <button 
                onClick={toggleSearchForm}
                className="text-gray-500 hover:text-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari sesuatu..."
                className="w-full p-3 border border-gray-300 rounded-md pr-10"
              />
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
          </div>
        </div>
      )}
      
      {/* Sticky Navigation Bar */}
      <nav 
        className={`fixed w-full top-0 z-50 transition-all duration-300 font-heading ${
          hasScrolled 
            ? 'bg-white shadow-md' 
            : 'bg-transparent'
        }`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-7xl">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src={hasScrolled ? '/images/logo/logo.png' : '/images/logo/logowhite.png'} 
                alt="Partisipasi Muda Logo" 
                width={160}
                height={40} 
                className="h-10 w-auto transition-all duration-300"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 font-heading font-extrabold" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Tentang Kami Dropdown */}
            <div 
              className="relative group" 
              onMouseEnter={handleTentangKamiEnter}
              onMouseLeave={handleTentangKamiLeave}
            >
              <button className={`transition-colors flex items-center py-2 font-extrabold ${
                hasScrolled ? 'hover:text-pink-500 text-gray-800' : 'hover:text-pink-500 text-white'
              }`}>
                Tentang Kami
                <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isTentangKamiOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {isTentangKamiOpen && (
                <div 
                  className={`absolute left-0 mt-0 w-48 rounded-md shadow-lg py-1 z-10 font-semibold ${hasScrolled ? 'bg-white' : 'bg-gray-800'}`}
                  onMouseEnter={handleTentangKamiEnter}
                  onMouseLeave={handleTentangKamiLeave}
                >
                  <Link href="/tentang-kami/tujuan" className={`block px-4 py-2 text-sm ${hasScrolled ? 'text-gray-700 hover:bg-gray-100 hover:text-pink-500' : 'text-white hover:bg-gray-700 hover:text-pink-500'}`}>Tujuan</Link>
                  <Link href="/tentang-kami/perjalanan" className={`block px-4 py-2 text-sm ${hasScrolled ? 'text-gray-700 hover:bg-gray-100 hover:text-pink-500' : 'text-white hover:bg-gray-700 hover:text-pink-500'}`}>Perjalanan</Link>
                  <Link href="/tentang-kami/board-pengurus" className={`block px-4 py-2 text-sm ${hasScrolled ? 'text-gray-700 hover:bg-gray-100 hover:text-pink-500' : 'text-white hover:bg-gray-700 hover:text-pink-500'}`}>Board dan Pengurus</Link>
                </div>
              )}
            </div>

            {/* Program Dropdown */}
            <div 
              className="relative group" 
              onMouseEnter={handleProgramEnter}
              onMouseLeave={handleProgramLeave}
            >
              <button className={`transition-colors flex items-center py-2 font-extrabold ${
                hasScrolled ? 'hover:text-pink-500 text-gray-800' : 'hover:text-pink-500 text-white'
              }`}>
                Program
                 <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isProgramOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {isProgramOpen && (
                <div 
                  className={`absolute left-0 mt-0 w-48 rounded-md shadow-lg py-1 z-10 font-semibold ${hasScrolled ? 'bg-white' : 'bg-gray-800'}`}
                  onMouseEnter={handleProgramEnter}
                  onMouseLeave={handleProgramLeave}
                >
                  <Link href="/program/diskusi" className={`block px-4 py-2 text-sm ${hasScrolled ? 'text-gray-700 hover:bg-gray-100 hover:text-pink-500' : 'text-white hover:bg-gray-700 hover:text-pink-500'}`}>Diskusi</Link>
                  <Link href="/program/temu-kandidat" className={`block px-4 py-2 text-sm ${hasScrolled ? 'text-gray-700 hover:bg-gray-100 hover:text-pink-500' : 'text-white hover:bg-gray-700 hover:text-pink-500'}`}>Temu Kandidat</Link>
                  <Link href="/program/academia-politica" className={`block px-4 py-2 text-sm ${hasScrolled ? 'text-gray-700 hover:bg-gray-100 hover:text-pink-500' : 'text-white hover:bg-gray-700 hover:text-pink-500'}`}>Academia Politica</Link>
                  <Link href="/program/class-of-climate-leaders" className={`block px-4 py-2 text-sm ${hasScrolled ? 'text-gray-700 hover:bg-gray-100 hover:text-pink-500' : 'text-white hover:bg-gray-700 hover:text-pink-500'}`}>Class of Climate Leader</Link>
                  <Link href="/program/council-gen-z" className={`block px-4 py-2 text-sm ${hasScrolled ? 'text-gray-700 hover:bg-gray-100 hover:text-pink-500' : 'text-white hover:bg-gray-700 hover:text-pink-500'}`}>Council of Gen Z</Link>
                </div>
              )}
            </div>
            
            <Link href="/publikasi" className={`transition-colors py-2 font-extrabold ${
              hasScrolled ? 'hover:text-pink-500 text-gray-800' : 'hover:text-pink-500 text-white'
            }`}>
              Publikasi
            </Link>
            <Link href="/report" className={`transition-colors py-2 font-extrabold ${
              hasScrolled ? 'hover:text-pink-500 text-gray-800' : 'hover:text-pink-500 text-white'
            }`}>
              Ruang Sipil
            </Link>
            <Link href="/acara" className={`transition-colors py-2 font-extrabold ${
              hasScrolled ? 'hover:text-pink-500 text-gray-800' : 'hover:text-pink-500 text-white'
            }`}>
              Acara
            </Link>
          </div>
          
          <div className="flex items-center font-heading" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Dukung Kami Button */}
            <Link href="/donasi" className="bg-primary-dark hover:bg-pink-500 hover:text-white text-black px-5 py-2 rounded-full font-semibold transition h-10 flex items-center justify-center">
              Dukung Kami
            </Link>
            
            {/* Search Button */}
            <button 
              onClick={toggleSearchForm}
              className="bg-primary-dark hover:bg-pink-500 hover:text-white text-black w-10 h-10 rounded-full font-semibold transition ml-4 flex items-center justify-center"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            <button 
              className={`ml-4 md:hidden transition-colors ${
                hasScrolled ? 'text-gray-800' : 'text-white'
              }`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;