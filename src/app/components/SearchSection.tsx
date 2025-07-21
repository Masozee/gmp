'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  slug?: string;
  type: string;
  url?: string;
  contentType?: string; // For careers
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

export default function SearchSection() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  
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
      setIsOpen(false);
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
  
  // Simple search function
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
  
  // Handle input change with proper debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new timeout
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setError(null);
    setIsOpen(false);
    
    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  
  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cari Informasi
          </h2>
          <p className="text-lg text-gray-600">
            Temukan acara, publikasi, karir, diskusi, dan mitra strategis kami
          </p>
        </div>
        
        <div className="relative search-container">
          <form onSubmit={handleSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Cari acara, publikasi, karir, diskusi... (tekan Enter untuk hasil lengkap)"
              className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </form>
          
          {/* Search Results */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
              {query.length < 2 ? (
                <div className="p-4 text-center text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Ketik minimal 2 karakter untuk mencari</p>
                </div>
              ) : loading ? (
                <div className="p-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                  <p className="text-gray-500">Mencari...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center text-red-500">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Error: {error}</p>
                  <button 
                    onClick={() => performSearch(query)}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Coba lagi
                  </button>
                </div>
              ) : results ? (
                <div className="max-h-96 overflow-y-auto">
                  {results.totalResults > 0 && (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100 text-sm text-gray-600 flex justify-between items-center">
                        <span>{results.totalResults} hasil untuk "{results.query}"</span>
                        <button
                          onClick={navigateToSearchResults}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                        >
                          Lihat Semua <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </>
                  )}
                  
                  {/* Publications */}
                  {results.results.publications.length > 0 && (
                    <div className="border-b border-gray-100 last:border-b-0">
                      <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700">
                        📄 Publikasi ({results.results.publications.length})
                      </div>
                      <div className="divide-y divide-gray-100">
                        {results.results.publications.slice(0, 3).map((item) => (
                          <Link
                            key={`publication-${item.id}`}
                            href={getResultLink(item)}
                            className="block p-4 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <h4 className="font-medium text-gray-900 truncate">
                              {item.title || item.name}
                            </h4>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {item.description.substring(0, 100)}...
                              </p>
                            )}
                          </Link>
                        ))}
                        {results.results.publications.length > 3 && (
                          <div className="p-2 text-center">
                            <button
                              onClick={navigateToSearchResults}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              +{results.results.publications.length - 3} publikasi lainnya
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Events */}
                  {results.results.events.length > 0 && (
                    <div className="border-b border-gray-100 last:border-b-0">
                      <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700">
                        📅 Acara ({results.results.events.length})
                      </div>
                      <div className="divide-y divide-gray-100">
                        {results.results.events.slice(0, 3).map((item) => (
                          <Link
                            key={`event-${item.id}`}
                            href={getResultLink(item)}
                            className="block p-4 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <h4 className="font-medium text-gray-900 truncate">
                              {item.title || item.name}
                            </h4>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {item.description.substring(0, 100)}...
                              </p>
                            )}
                          </Link>
                        ))}
                        {results.results.events.length > 3 && (
                          <div className="p-2 text-center">
                            <button
                              onClick={navigateToSearchResults}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              +{results.results.events.length - 3} acara lainnya
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Careers */}
                  {results.results.careers.length > 0 && (
                    <div className="border-b border-gray-100 last:border-b-0">
                      <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700">
                        💼 Karir ({results.results.careers.length})
                      </div>
                      <div className="divide-y divide-gray-100">
                        {results.results.careers.slice(0, 3).map((item) => (
                          <Link
                            key={`career-${item.id}`}
                            href={getResultLink(item)}
                            className="block p-4 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <h4 className="font-medium text-gray-900 truncate">
                              {item.title || item.name}
                            </h4>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {item.description.substring(0, 100)}...
                              </p>
                            )}
                          </Link>
                        ))}
                        {results.results.careers.length > 3 && (
                          <div className="p-2 text-center">
                            <button
                              onClick={navigateToSearchResults}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              +{results.results.careers.length - 3} karir lainnya
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Discussions */}
                  {results.results.discussions.length > 0 && (
                    <div className="border-b border-gray-100 last:border-b-0">
                      <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700">
                        💬 Diskusi ({results.results.discussions.length})
                      </div>
                      <div className="divide-y divide-gray-100">
                        {results.results.discussions.slice(0, 3).map((item) => (
                          <Link
                            key={`discussion-${item.id}`}
                            href={getResultLink(item)}
                            className="block p-4 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <h4 className="font-medium text-gray-900 truncate">
                              {item.title || item.name}
                            </h4>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {item.description.substring(0, 100)}...
                              </p>
                            )}
                          </Link>
                        ))}
                        {results.results.discussions.length > 3 && (
                          <div className="p-2 text-center">
                            <button
                              onClick={navigateToSearchResults}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              +{results.results.discussions.length - 3} diskusi lainnya
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Partners */}
                  {results.results.partners.length > 0 && (
                    <div className="border-b border-gray-100 last:border-b-0">
                      <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700">
                        🤝 Mitra ({results.results.partners.length})
                      </div>
                      <div className="divide-y divide-gray-100">
                        {results.results.partners.slice(0, 3).map((item) => (
                          <Link
                            key={`partner-${item.id}`}
                            href={getResultLink(item)}
                            className="block p-4 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                            target={item.url ? "_blank" : "_self"}
                            rel={item.url ? "noopener noreferrer" : undefined}
                          >
                            <h4 className="font-medium text-gray-900 truncate">
                              {item.title || item.name}
                            </h4>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {item.description.substring(0, 100)}...
                              </p>
                            )}
                          </Link>
                        ))}
                        {results.results.partners.length > 3 && (
                          <div className="p-2 text-center">
                            <button
                              onClick={navigateToSearchResults}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              +{results.results.partners.length - 3} mitra lainnya
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {results.totalResults === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Tidak ada hasil untuk "{results.query}"</p>
                      <button
                        onClick={navigateToSearchResults}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                      >
                        Coba pencarian lanjutan
                      </button>
                    </div>
                  )}

                  {/* View All Results Button */}
                  {results.totalResults > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                      <button
                        onClick={navigateToSearchResults}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        Lihat Semua {results.totalResults} Hasil <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 