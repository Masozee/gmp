'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isTentangKamiOpen, setIsTentangKamiOpen] = useState(false);
  const [isProgramOpen, setIsProgramOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
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
                src={hasScrolled ? '/images/logo/Logo-name-stack.png' : '/images/logo/logo-white.png'} 
                alt="Partisipasi Muda Logo" 
                width={hasScrolled ? 160 : 180} 
                height={40} 
                className={`transition-all duration-300 ${
                  hasScrolled ? 'h-12 w-auto' : 'h-10 w-auto'
                }`}
              />
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 font-heading" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Tentang Kami Dropdown */}
            <div 
              className="relative" 
              onMouseEnter={() => setIsTentangKamiOpen(true)}
              onMouseLeave={() => setIsTentangKamiOpen(false)}
            >
              <button className={`font-medium transition-colors flex items-center ${
                hasScrolled ? 'hover:text-secondary text-gray-800' : 'hover:text-primary text-white'
              }`}>
                Tentang Kami
                <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isTentangKamiOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {isTentangKamiOpen && (
                <div className={`absolute left-0 mt-1 w-48 rounded-md shadow-lg py-1 z-10 ${hasScrolled ? 'bg-white' : 'bg-gray-800'}`}>
                  <Link href="/tentang-kami/tujuan" className={`block px-4 py-2 text-sm ${hasScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}>Tujuan</Link>
                  <Link href="/tentang-kami/perjalanan" className={`block px-4 py-2 text-sm ${hasScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}>Perjalanan</Link>
                  <Link href="/tentang-kami/board-pengurus" className={`block px-4 py-2 text-sm ${hasScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}>Board dan Pengurus</Link>
                </div>
              )}
            </div>

            {/* Program Dropdown */}
            <div 
              className="relative" 
              onMouseEnter={() => setIsProgramOpen(true)}
              onMouseLeave={() => setIsProgramOpen(false)}
            >
              <button className={`font-medium transition-colors flex items-center ${
                hasScrolled ? 'hover:text-secondary text-gray-800' : 'hover:text-primary text-white'
              }`}>
                Program
                 <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isProgramOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {isProgramOpen && (
                <div className={`absolute left-0 mt-1 w-48 rounded-md shadow-lg py-1 z-10 ${hasScrolled ? 'bg-white' : 'bg-gray-800'}`}>
                  <Link href="/program/diskusi" className={`block px-4 py-2 text-sm ${hasScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}>Diskusi</Link>
                  <Link href="/program/temu-kandidat" className={`block px-4 py-2 text-sm ${hasScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}>Temu Kandidat</Link>
                  <Link href="/program/academia-politica" className={`block px-4 py-2 text-sm ${hasScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}>Academia Politica</Link>
                  <Link href="/program/council-gen-z" className={`block px-4 py-2 text-sm ${hasScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}>Council of Gen Z</Link>
                </div>
              )}
            </div>
            
            <Link href="/publikasi" className={`font-medium transition-colors ${
              hasScrolled ? 'hover:text-secondary text-gray-800' : 'hover:text-primary text-white'
            }`}>
              Publikasi
            </Link>
            <Link href="/donasi" className={`font-medium transition-colors ${
              hasScrolled ? 'hover:text-secondary text-gray-800' : 'hover:text-primary text-white'
            }`}>
              Donasi dan Kolaborasi
            </Link>
            <Link href="/mitra-strategis" className={`font-medium transition-colors ${
              hasScrolled ? 'hover:text-secondary text-gray-800' : 'hover:text-primary text-white'
            }`}>
              Mitra Strategis
            </Link>
          </div>
          
          <div className="flex items-center font-heading" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Link href="/donate" className="bg-primary hover:bg-primary-dark text-black px-5 py-2 rounded-md font-medium transition">
              Dukung Kami
            </Link>
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