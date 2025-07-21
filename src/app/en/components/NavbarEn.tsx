'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import MobileMenuEn from './MobileMenuEn';
import { Search, X, ArrowRight, Globe } from 'lucide-react';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  slug?: string;
  type: string;
  url?: string;
  contentType?: string;
}

interface SearchResponse {
  success: boolean;
  query: string;
  totalResults: number;
  results: {
    events: SearchResult[];
    publications: SearchResult[];
    careers: SearchResult[];
    discussions: SearchResult[];
    partners: SearchResult[];
  };
}

const NavbarEn = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const aboutUsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const programTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
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
  };

  // Get current language
  const currentLanguage = pathname.startsWith('/en') ? 'EN' : 'ID';

  // Check if path is active
  const isActive = (path: string) => {
    if (path === '/en' || path === '/en/') return pathname === '/en' || pathname === '/en/';
    return pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAboutUsEnter = () => {
    if (aboutUsTimeoutRef.current) {
      clearTimeout(aboutUsTimeoutRef.current);
      aboutUsTimeoutRef.current = null;
    }
    setIsAboutUsOpen(true);
  };

  const handleAboutUsLeave = () => {
    aboutUsTimeoutRef.current = setTimeout(() => {
      setIsAboutUsOpen(false);
    }, 300);
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
    }, 300);
  };

  const toggleSearchForm = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Reset search state when opening
      setQuery('');
      setResults(null);
      setError(null);
    }
  };

  // Get link for result
  const getResultLink = (result: SearchResult) => {
    switch (result.type || result.contentType) {
      case 'event':
        return `/acara/${result.slug}`;
      case 'publication':
        return `/publikasi/${result.slug}`;
      case 'career':
        return `/karir/${result.id}`;
      case 'discussion':
        return `/program/diskusi/${result.slug}`;
      case 'partner':
        return result.url || '#';
      default:
        return '#';
    }
  };

  // Navigate to search results page
  const navigateToSearchResults = () => {
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToSearchResults();
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      navigateToSearchResults();
    }
  };

  // Search function
  const performSearch = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults(null);
      setError(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/content/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setResults(data);
      } else {
        throw new Error(data.error || 'Search failed');
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError(error instanceof Error ? error.message : 'Search failed');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new timeout
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle scroll event
  useEffect(() => {
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
      if (aboutUsTimeoutRef.current) clearTimeout(aboutUsTimeoutRef.current);
      if (programTimeoutRef.current) clearTimeout(programTimeoutRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isSearchOpen && !target.closest('.search-popup-container')) {
        setIsSearchOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  return (
    <>
      {/* Mobile Menu */}
      <MobileMenuEn isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {/* Search Popup */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-start justify-center pt-20">
          <div className="search-popup-container bg-white rounded-xl w-full max-w-2xl mx-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Search Information</h3>
                <button 
                  onClick={toggleSearchForm}
                  className="text-gray-500 hover:text-gray-800 p-1"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search events, publications, careers, discussions... (press Enter for full results)"
                  className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </form>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {query.length < 2 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Type at least 2 characters to search</p>
                  </div>
                ) : loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                    <p className="text-gray-500">Searching...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="mb-3">Error: {error}</p>
                    <button 
                      onClick={() => performSearch(query)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : results ? (
                  <>
                    {results.totalResults > 0 && (
                      <div className="mb-4 pb-3 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {results.totalResults} results for "{results.query}"
                        </span>
                        <button
                          onClick={navigateToSearchResults}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                        >
                          View All <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    
                    {/* Publications */}
                    {results.results.publications.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2 px-2">
                          📄 Publications ({results.results.publications.length})
                        </div>
                        <div className="space-y-1">
                          {results.results.publications.slice(0, 3).map((item) => (
                            <Link
                              key={`publication-${item.id}`}
                              href={getResultLink(item)}
                              className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                                {item.title || item.name}
                              </h4>
                              {item.description && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {item.description.substring(0, 80)}...
                                </p>
                              )}
                            </Link>
                          ))}
                          {results.results.publications.length > 3 && (
                            <button
                              onClick={navigateToSearchResults}
                              className="w-full text-left p-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              +{results.results.publications.length - 3} more publications
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Events */}
                    {results.results.events.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2 px-2">
                          📅 Events ({results.results.events.length})
                        </div>
                        <div className="space-y-1">
                          {results.results.events.slice(0, 3).map((item) => (
                            <Link
                              key={`event-${item.id}`}
                              href={getResultLink(item)}
                              className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                                {item.title || item.name}
                              </h4>
                              {item.description && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {item.description.substring(0, 80)}...
                                </p>
                              )}
                            </Link>
                          ))}
                          {results.results.events.length > 3 && (
                            <button
                              onClick={navigateToSearchResults}
                              className="w-full text-left p-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              +{results.results.events.length - 3} more events
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Careers */}
                    {results.results.careers.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2 px-2">
                          💼 Careers ({results.results.careers.length})
                        </div>
                        <div className="space-y-1">
                          {results.results.careers.slice(0, 3).map((item) => (
                            <Link
                              key={`career-${item.id}`}
                              href={getResultLink(item)}
                              className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                                {item.title || item.name}
                              </h4>
                              {item.description && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {item.description.substring(0, 80)}...
                                </p>
                              )}
                            </Link>
                          ))}
                          {results.results.careers.length > 3 && (
                            <button
                              onClick={navigateToSearchResults}
                              className="w-full text-left p-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              +{results.results.careers.length - 3} more careers
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Discussions */}
                    {results.results.discussions.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2 px-2">
                          💬 Discussions ({results.results.discussions.length})
                        </div>
                        <div className="space-y-1">
                          {results.results.discussions.slice(0, 3).map((item) => (
                            <Link
                              key={`discussion-${item.id}`}
                              href={getResultLink(item)}
                              className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                                {item.title || item.name}
                              </h4>
                              {item.description && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {item.description.substring(0, 80)}...
                                </p>
                              )}
                            </Link>
                          ))}
                          {results.results.discussions.length > 3 && (
                            <button
                              onClick={navigateToSearchResults}
                              className="w-full text-left p-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              +{results.results.discussions.length - 3} more discussions
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Partners */}
                    {results.results.partners.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2 px-2">
                          🤝 Partners ({results.results.partners.length})
                        </div>
                        <div className="space-y-1">
                          {results.results.partners.slice(0, 3).map((item) => (
                            <Link
                              key={`partner-${item.id}`}
                              href={getResultLink(item)}
                              className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                              onClick={() => setIsSearchOpen(false)}
                              target={item.url ? "_blank" : "_self"}
                              rel={item.url ? "noopener noreferrer" : undefined}
                            >
                              <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                                {item.title || item.name}
                              </h4>
                              {item.description && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {item.description.substring(0, 80)}...
                                </p>
                              )}
                            </Link>
                          ))}
                          {results.results.partners.length > 3 && (
                            <button
                              onClick={navigateToSearchResults}
                              className="w-full text-left p-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              +{results.results.partners.length - 3} more partners
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {results.totalResults === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="mb-3">No results for "{results.query}"</p>
                        <button
                          onClick={navigateToSearchResults}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Try advanced search
                        </button>
                      </div>
                    )}

                    {/* View All Results Button */}
                    {results.totalResults > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={navigateToSearchResults}
                          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          View All {results.totalResults} Results <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
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
        <div className="container mx-auto px-4 py-3 flex items-center max-w-7xl">
          <div className="flex items-center">
            <Link href="/en" className="flex items-center">
              <Image
                src={hasScrolled ? "/images/logo/logo.png" : "/logo/logowhite.png"}
                alt="Partisipasi Muda Logo"
                width={160}
                height={40}
                className="h-10 w-auto transition-all duration-300"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-1 font-heading font-bold ml-8" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
            {/* About Us Dropdown */}
            <div 
              className="relative group" 
              onMouseEnter={handleAboutUsEnter}
              onMouseLeave={handleAboutUsLeave}
            >
              <button className={`transition-all flex items-center py-2 px-2 font-bold relative ${
                hasScrolled ? 'text-gray-800 hover:text-[#ffcb57]' : 'text-white hover:text-[#ffcb57]'
              } ${
                isActive('/en/about-us') ? 'text-[#ffcb57]' : ''
              } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#ffcb57] after:transition-all after:duration-300 hover:after:w-full ${
                isActive('/en/about-us') ? 'after:w-full' : ''
              }`}>
                About Us
                <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isAboutUsOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {/* Dropdown Menu */}
              {isAboutUsOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  onMouseEnter={handleAboutUsEnter}
                  onMouseLeave={handleAboutUsLeave}
                >
                  <Link href="/en/about-us/mission" className="block px-4 py-2 text-gray-800 hover:bg-[#ffcb57] hover:text-white transition-colors">
                    Our Mission
                  </Link>
                  <Link href="/en/about-us/journey" className="block px-4 py-2 text-gray-800 hover:bg-[#ffcb57] hover:text-white transition-colors">
                    Our Journey
                  </Link>
                  <Link href="/en/about-us/board-management" className="block px-4 py-2 text-gray-800 hover:bg-[#ffcb57] hover:text-white transition-colors">
                    Board & Management
                  </Link>
                </div>
              )}
            </div>

            {/* Programs Dropdown */}
            <div 
              className="relative group" 
              onMouseEnter={handleProgramEnter}
              onMouseLeave={handleProgramLeave}
            >
              <button className={`transition-all flex items-center py-2 px-2 font-bold relative ${
                hasScrolled ? 'text-gray-800 hover:text-[#ffcb57]' : 'text-white hover:text-[#ffcb57]'
              } ${
                isActive('/en/programs') ? 'text-[#ffcb57]' : ''
              } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#ffcb57] after:transition-all after:duration-300 hover:after:w-full ${
                isActive('/en/programs') ? 'after:w-full' : ''
              }`}>
                Programs
                 <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isProgramOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {/* Dropdown Menu */}
              {isProgramOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  onMouseEnter={handleProgramEnter}
                  onMouseLeave={handleProgramLeave}
                >
                  {/* Climate Change Category */}
                  <div className="px-4 py-2">
                    <div className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">
                      Climate Change
                    </div>
                    <Link href="/en/programs/academia-politica" className="block px-2 py-1.5 text-gray-800 hover:bg-[#ffcb57] hover:text-white transition-colors rounded text-sm">
                      Academia Politica
                    </Link>
                    <Link href="/en/programs/council-gen-z" className="block px-2 py-1.5 text-gray-800 hover:bg-[#ffcb57] hover:text-white transition-colors rounded text-sm">
                      Council of Gen Z
                    </Link>
                    <Link href="/en/programs/candidate-meetings" className="block px-2 py-1.5 text-gray-800 hover:bg-[#ffcb57] hover:text-white transition-colors rounded text-sm">
                      Candidate Meetings
                    </Link>
                    <Link href="/en/programs/class-of-climate-leaders" className="block px-2 py-1.5 text-gray-800 hover:bg-[#ffcb57] hover:text-white transition-colors rounded text-sm">
                      Class of Climate Leaders
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-2"></div>

                  {/* Civic Space Category */}
                  <div className="px-4 py-2">
                    <div className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">
                      Civic Space
                    </div>
                    <Link href="/en/civic-space" className="block px-2 py-1.5 text-gray-800 hover:bg-[#ffcb57] hover:text-white transition-colors rounded text-sm">
                      Research
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-2"></div>

                  {/* Youth Empowerment Category */}
                  <div className="px-4 py-2">
                    <div className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">
                      Youth Empowerment
                    </div>
                    <div className="flex items-center px-2 py-1.5 text-gray-400 cursor-not-allowed rounded text-sm">
                      <span>HappyMind Activists</span>
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold ml-2">
                        COMING SOON
                      </span>
                    </div>
                  </div>
                  
                </div>
              )}
            </div>
            
            <Link href="/en/publications" className={`transition-all py-2 px-2 font-bold relative ${
              hasScrolled ? 'text-gray-800 hover:text-[#ffcb57]' : 'text-white hover:text-[#ffcb57]'
            } ${
              isActive('/en/publications') ? 'text-[#ffcb57]' : ''
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#ffcb57] after:transition-all after:duration-300 hover:after:w-full ${
              isActive('/en/publications') ? 'after:w-full' : ''
            }`}>
              Publications
            </Link>
            <Link href="/en/civic-space" className={`transition-all py-2 px-2 font-bold relative ${
              hasScrolled ? 'text-gray-800 hover:text-[#ffcb57]' : 'text-white hover:text-[#ffcb57]'
            } ${
              isActive('/en/civic-space') ? 'text-[#ffcb57]' : ''
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#ffcb57] after:transition-all after:duration-300 hover:after:w-full ${
              isActive('/en/civic-space') ? 'after:w-full' : ''
            }`}>
              Civic Space Reports
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold text-[10px] shadow-sm">
                NEW
              </span>
            </Link>
            <Link href="/en/events" className={`transition-all py-2 px-2 font-bold relative ${
              hasScrolled ? 'text-gray-800 hover:text-[#ffcb57]' : 'text-white hover:text-[#ffcb57]'
            } ${
              isActive('/en/events') ? 'text-[#ffcb57]' : ''
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#ffcb57] after:transition-all after:duration-300 hover:after:w-full ${
              isActive('/en/events') ? 'after:w-full' : ''
            }`}>
              Events
            </Link>
          </div>
          
          <div className="hidden md:flex items-center font-heading ml-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Link href="/en/donate" className="bg-primary-dark hover:bg-[#e5b64e] text-[#4c3c1a] hover:text-[#4c3c1a] px-5 py-2 rounded-full font-bold transition h-10 flex items-center justify-center text-sm">
              Support Us
            </Link>
            
            {/* Language Switcher */}
            <button 
              onClick={switchLanguage}
              className="bg-primary-dark hover:bg-[#e5b64e] text-[#4c3c1a] hover:text-[#4c3c1a] w-10 h-10 rounded-full font-bold transition ml-4 flex items-center justify-center text-sm"
              aria-label={`Switch to ${currentLanguage === 'EN' ? 'Indonesian' : 'English'}`}
              title={`Switch to ${currentLanguage === 'EN' ? 'Indonesian' : 'English'}`}
            >
              {currentLanguage}
            </button>
            
            <button 
              onClick={toggleSearchForm}
              className="bg-primary-dark hover:bg-[#e5b64e] text-[#4c3c1a] hover:text-[#4c3c1a] w-10 h-10 rounded-full font-bold transition ml-4 flex items-center justify-center text-sm"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className={`ml-auto md:hidden transition-colors ${
              hasScrolled ? 'text-gray-800' : 'text-white'
            }`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M7 12h10M3 18h18" />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
};

export default NavbarEn; 