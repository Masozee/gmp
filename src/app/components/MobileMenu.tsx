'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [isTentangKamiOpen, setIsTentangKamiOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  // Check if path is active
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const toggleProgram = () => {
    setIsProgramOpen(!isProgramOpen);
  };

  const toggleTentangKami = () => {
    setIsTentangKamiOpen(!isTentangKamiOpen);
  };

  const handleSearch = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleSearchSubmit = (query: string) => {
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false);
      onClose();
    }
  };

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
    <div className="fixed inset-0 z-[60]">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div 
        className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col animate-slideInRight"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-end px-6 pt-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button 
              onClick={switchLanguage}
              className="bg-primary-dark hover:bg-[#e5b64e] text-[#4c3c1a] hover:text-[#4c3c1a] w-10 h-10 rounded-full font-semibold transition text-sm flex items-center justify-center"
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
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Tutup menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-2 px-4">
            {/* Tentang Kami Section with Dropdown */}
            <li>
              <button
                onClick={toggleTentangKami}
                className="flex items-center justify-between w-full text-left px-4 py-4 text-lg font-semibold text-gray-800 hover:text-[#ffcb57] transition"
              >
                Tentang Kami
                <svg
                  className={`w-4 h-4 transition-transform ${isTentangKamiOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isTentangKamiOpen && (
                <div className="ml-4 space-y-1">
                  <Link href="/tentang-kami/tujuan" onClick={onClose} className="block w-full text-left px-4 py-3 text-gray-600 hover:text-[#ffcb57] transition">
                    Tujuan Kami
                  </Link>
                  <Link href="/tentang-kami/perjalanan" onClick={onClose} className="block w-full text-left px-4 py-3 text-gray-600 hover:text-[#ffcb57] transition">
                    Perjalanan Kami
                  </Link>
                  <Link href="/tentang-kami/board-pengurus" onClick={onClose} className="block w-full text-left px-4 py-3 text-gray-600 hover:text-[#ffcb57] transition">
                    Board & Pengurus
                  </Link>
                </div>
              )}
            </li>
            
            <div className="my-2 border-t border-gray-200" />
            
            {/* Program Section with Dropdown */}
            <li>
              <button
                onClick={toggleProgram}
                className="flex items-center justify-between w-full text-left px-4 py-4 text-lg font-semibold text-gray-800 hover:text-[#ffcb57] transition"
              >
                Program
                <svg
                  className={`w-4 h-4 transition-transform ${isProgramOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isProgramOpen && (
                <div className="ml-4 space-y-3">
                  {/* Climate Change Category */}
                  <div>
                    <div className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 px-4">
                      Climate Change
                    </div>
                    <Link href="/program/academia-politica" onClick={onClose} className="block w-full text-left px-4 py-2 text-gray-600 hover:text-[#ffcb57] transition text-sm">
                      Academia Politica
                    </Link>
                    <Link href="/program/council-gen-z" onClick={onClose} className="block w-full text-left px-4 py-2 text-gray-600 hover:text-[#ffcb57] transition text-sm">
                      Council Gen Z
                    </Link>
                    <Link href="/program/temu-kandidat" onClick={onClose} className="block w-full text-left px-4 py-2 text-gray-600 hover:text-[#ffcb57] transition text-sm">
                      Temu Kandidat
                    </Link>
                    <Link href="/program/class-of-climate-leaders" onClick={onClose} className="block w-full text-left px-4 py-2 text-gray-600 hover:text-[#ffcb57] transition text-sm">
                      Class of Climate Leaders
                    </Link>
                  </div>

                  {/* Civic Space Category */}
                  <div>
                    <div className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 px-4">
                      Civic Space
                    </div>
                    <Link href="/ruang-sipil" onClick={onClose} className="block w-full text-left px-4 py-2 text-gray-600 hover:text-[#ffcb57] transition text-sm">
                      Riset
                    </Link>
                  </div>

                  {/* Youth Empowerment Category */}
                  <div>
                    <div className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 px-4">
                      Youth Empowerment
                    </div>
                    <div className="flex items-center px-4 py-2 text-gray-400 cursor-not-allowed text-sm">
                      <span>HappyMind Activists</span>
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold ml-2">
                        SEGERA
                      </span>
                    </div>
                  </div>

                </div>
              )}
            </li>
            
            <div className="my-2 border-t border-gray-200" />
            {/* Other Main Links */}
            <li>
              <Link href="/publikasi" onClick={onClose} className={`block w-full text-left px-4 py-4 text-lg font-semibold transition-all relative ${
                isActive('/publikasi') ? 'text-[#ffcb57]' : 'text-gray-800 hover:text-[#ffcb57]'
              } after:content-[''] after:absolute after:bottom-2 after:left-4 after:right-4 after:h-0.5 after:bg-[#ffcb57] after:transition-all after:duration-300 ${
                isActive('/publikasi') ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
              }`}>
                Publikasi
              </Link>
            </li>
            <li>
              <Link href="/ruang-sipil" onClick={onClose} className={`block w-full text-left px-4 py-4 text-lg font-semibold transition-all relative ${
                isActive('/ruang-sipil') ? 'text-[#ffcb57]' : 'text-gray-800 hover:text-[#ffcb57]'
              } after:content-[''] after:absolute after:bottom-2 after:left-4 after:right-4 after:h-0.5 after:bg-[#ffcb57] after:transition-all after:duration-300 ${
                isActive('/ruang-sipil') ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
              }`}>
                Laporan Ruang Sipil
                <span className="absolute top-2 right-4 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold text-[10px] shadow-sm">
                  BARU
                </span>
              </Link>
            </li>
            <li>
              <Link href="/acara" onClick={onClose} className={`block w-full text-left px-4 py-4 text-lg font-semibold transition-all relative ${
                isActive('/acara') ? 'text-[#ffcb57]' : 'text-gray-800 hover:text-[#ffcb57]'
              } after:content-[''] after:absolute after:bottom-2 after:left-4 after:right-4 after:h-0.5 after:bg-[#ffcb57] after:transition-all after:duration-300 ${
                isActive('/acara') ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
              }`}>
                Acara
              </Link>
            </li>
          </ul>
        </nav>

        {/* Dukung Kami Button */}
        <div className="p-6 border-t border-gray-100">
          <Link href="/donasi" 
            className="block w-full bg-primary-dark hover:bg-[#e5b64e] text-[#4c3c1a] hover:text-[#4c3c1a] py-3 px-4 rounded-full font-bold text-center text-lg shadow transition"
            onClick={onClose}
          >
            Dukung Kami
          </Link>
        </div>
      </div>

      {/* Search Popup for Mobile */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-start justify-center pt-20">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Cari Informasi</h3>
                <button 
                  onClick={handleSearchClose}
                  className="text-gray-500 hover:text-gray-800 p-1"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const query = (e.target as HTMLFormElement).querySelector('input')?.value || '';
                handleSearchSubmit(query);
              }} className="relative mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari acara, publikasi, karir, diskusi..."
                    className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full text-white py-3 px-4 rounded-lg transition-colors"
                  style={{ backgroundColor: '#f06d98' }}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e05c87'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#f06d98'}
                >
                  Cari
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu; 