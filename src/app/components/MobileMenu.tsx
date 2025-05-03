'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [isTentangKamiMobileOpen, setIsTentangKamiMobileOpen] = useState(false);
  const [isProgramMobileOpen, setIsProgramMobileOpen] = useState(false);

  // Close the menu when clicking outside and prevent scrolling when menu is open
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50">
      <div 
        className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform ease-in-out duration-300 font-heading"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <Link href="/" onClick={onClose} className="flex items-center">
              <Image 
                src="/images/logo/Logo-name-stack.png" 
                alt="Partisipasi Muda Logo" 
                width={120} 
                height={40} 
                className="h-10 w-auto"
              />
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto font-heading" style={{ fontFamily: "'Inter', sans-serif" }}>
            <ul className="py-4">
              <li>
                <button 
                  className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-100 hover:text-secondary font-medium text-left"
                  onClick={() => setIsTentangKamiMobileOpen(!isTentangKamiMobileOpen)}
                >
                  <span>Tentang Kami</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isTentangKamiMobileOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isTentangKamiMobileOpen && (
                  <ul className="pl-8">
                    <li><Link href="/tentang-kami/tujuan" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-secondary" onClick={onClose}>Tujuan</Link></li>
                    <li><Link href="/tentang-kami/perjalanan" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-secondary" onClick={onClose}>Perjalanan</Link></li>
                    <li><Link href="/tentang-kami/board-pengurus" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-secondary" onClick={onClose}>Board dan Pengurus</Link></li>
                  </ul>
                )}
              </li>

              {/* Program Section */}
              <li>
                 <button 
                  className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-100 hover:text-secondary font-medium text-left"
                  onClick={() => setIsProgramMobileOpen(!isProgramMobileOpen)}
                >
                  <span>Program</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isProgramMobileOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isProgramMobileOpen && (
                  <ul className="pl-8">
                    <li><Link href="/program/diskusi" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-secondary" onClick={onClose}>Diskusi</Link></li>
                    <li><Link href="/program/temu-kandidat" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-secondary" onClick={onClose}>Temu Kandidat</Link></li>
                    <li><Link href="/program/academia-politica" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-secondary" onClick={onClose}>Academia Politica</Link></li>
                    <li><Link href="/program/council-gen-z" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-secondary" onClick={onClose}>Council of Gen Z</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <Link href="/publikasi" 
                  className="block px-4 py-2 hover:bg-gray-100 hover:text-secondary font-medium"
                  onClick={onClose}
                >
                  Publikasi
                </Link>
              </li>
              <li>
                <Link href="/donasi-kolaborasi" 
                  className="block px-4 py-2 hover:bg-gray-100 hover:text-secondary font-medium"
                  onClick={onClose}
                >
                  Donasi dan Kolaborasi
                </Link>
              </li>
              <li>
                <Link href="/mitra-strategis" 
                  className="block px-4 py-2 hover:bg-gray-100 hover:text-secondary font-medium"
                  onClick={onClose}
                >
                  Mitra Strategis
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t font-heading" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Link href="/donate" 
              className="block w-full bg-primary hover:bg-primary-dark text-black py-2 px-4 rounded-md font-medium text-center"
              onClick={onClose}
            >
              Dukung Kami
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu; 