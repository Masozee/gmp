'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
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
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/40" />
      <div 
        className="fixed inset-0 bg-white shadow-2xl flex flex-col animate-slideInRight"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Tutup menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex items-center px-6 pt-8 pb-6">
          <Link href="/" onClick={onClose} className="flex items-center">
            <Image 
              src="/images/logo/Logo-name-stack.png" 
              alt="Partisipasi Muda Logo" 
              width={120} 
              height={40} 
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-2 px-4">
            {/* Tentang Kami Section */}
            <li>
              <Link href="/tentang-kami/tujuan" onClick={onClose} className="block w-full text-left px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition">
                Tentang Kami: Tujuan
              </Link>
            </li>
            <li>
              <Link href="/tentang-kami/perjalanan" onClick={onClose} className="block w-full text-left px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition">
                Tentang Kami: Perjalanan
              </Link>
            </li>
            <li>
              <Link href="/tentang-kami/board-pengurus" onClick={onClose} className="block w-full text-left px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition">
                Board & Pengurus
              </Link>
            </li>
            <div className="my-2 border-t border-gray-200" />
            {/* Program Section */}
            <li>
              <Link href="/program/diskusi" onClick={onClose} className="block w-full text-left px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition">
                Program: Diskusi
              </Link>
            </li>
            <li>
              <Link href="/program/temu-kandidat" onClick={onClose} className="block w-full text-left px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition">
                Program: Temu Kandidat
              </Link>
            </li>
            <li>
              <Link href="/program/academia-politica" onClick={onClose} className="block w-full text-left px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition">
                Program: Academia Politica
              </Link>
            </li>
            <li>
              <Link href="/program/council-gen-z" onClick={onClose} className="block w-full text-left px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition">
                Program: Council of Gen Z
              </Link>
            </li>
            <div className="my-2 border-t border-gray-200" />
            {/* Other Main Links */}
            <li>
              <Link href="/publikasi" onClick={onClose} className="block w-full text-left px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition">
                Publikasi
              </Link>
            </li>
            <li>
              <Link href="/ruang-sipil" onClick={onClose} className="block w-full text-left px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition">
                Ruang Sipil
              </Link>
            </li>
            <li>
              <Link href="/donasi" onClick={onClose} className="block w-full text-left px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition">
                Donasi & Kolaborasi
              </Link>
            </li>
            <li>
              <Link href="/acara" onClick={onClose} className="block w-full text-left px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition">
                Acara
              </Link>
            </li>
          </ul>
        </nav>

        {/* Dukung Kami Button */}
        <div className="p-6 border-t border-gray-100">
          <Link href="/donate" 
            className="block w-full bg-primary hover:bg-pink-500 hover:text-white text-black py-3 px-4 rounded-full font-bold text-center text-lg shadow transition"
            onClick={onClose}
          >
            Dukung Kami
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu; 