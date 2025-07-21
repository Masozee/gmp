'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Calendar, User, MapPin, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  slug?: string;
  type: string;
  url?: string;
  contentType?: string;
  date?: string;
  author?: string;
  location?: string;
  image?: string;
  image_url?: string;
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

const ITEMS_PER_PAGE = 12;

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');

  const initialQuery = searchParams.get('q') || '';

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

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
        setCurrentPage(1);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      performSearch(query.trim());
    }
  };

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

  const getAllResults = (): SearchResult[] => {
    if (!results) return [];
    
    const allResults: SearchResult[] = [];
    
    if (activeFilter === 'all' || activeFilter === 'publications') {
      allResults.push(...results.results.publications);
    }
    if (activeFilter === 'all' || activeFilter === 'events') {
      allResults.push(...results.results.events);
    }
    if (activeFilter === 'all' || activeFilter === 'careers') {
      allResults.push(...results.results.careers);
    }
    if (activeFilter === 'all' || activeFilter === 'discussions') {
      allResults.push(...results.results.discussions);
    }
    if (activeFilter === 'all' || activeFilter === 'partners') {
      allResults.push(...results.results.partners);
    }
    
    return allResults;
  };

  const allResults = getAllResults();
  const totalPages = Math.ceil(allResults.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentResults = allResults.slice(startIndex, endIndex);

  const getResultIcon = (result: SearchResult) => {
    switch (result.type || result.contentType) {
      case 'event':
        return '📅';
      case 'publication':
        return '📄';
      case 'career':
        return '💼';
      case 'discussion':
        return '💬';
      case 'partner':
        return '🤝';
      default:
        return '📋';
    }
  };

  const getResultTypeName = (result: SearchResult) => {
    switch (result.type || result.contentType) {
      case 'event':
        return 'Acara';
      case 'publication':
        return 'Publikasi';
      case 'career':
        return 'Karir';
      case 'discussion':
        return 'Diskusi';
      case 'partner':
        return 'Mitra';
      default:
        return 'Konten';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Main Color */}
      <div className="bg-gradient-to-r from-[#f06d98] via-[#e05c87] to-[#e05c87] text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Search className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Temukan Informasi
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Cari acara, publikasi, karir, diskusi, dan mitra strategis dalam satu tempat
            </p>
            
            {/* Header Search Form */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari acara, publikasi, karir, diskusi..."
                className="w-full pl-12 pr-24 py-4 text-lg text-gray-900 border-0 rounded-xl focus:ring-4 focus:ring-white/30 shadow-lg placeholder-gray-500"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-4 flex items-center bg-white text-[#f06d98] px-6 rounded-r-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Cari
              </button>
            </form>
            
            {/* Quick Stats */}
            {results && (
              <div className="mt-8 flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                  <p className="text-white/80">
                    <span className="font-semibold text-white">{results.totalResults}</span> hasil ditemukan untuk "{results.query}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-[#f06d98]">
              Beranda
            </Link>
            <span>/</span>
            <span>Hasil Pencarian</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#f06d98] mb-4"></div>
            <p className="text-gray-600">Mencari...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <Search className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <h3 className="text-lg font-medium text-red-900 mb-2">Terjadi Kesalahan</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => performSearch(query)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        ) : results ? (
          <>
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-lg text-gray-700">
                    Menampilkan hasil pencarian
                  </p>
                  {allResults.length !== results.totalResults && (
                    <p className="text-sm text-gray-500">
                      {allResults.length} dari {results.totalResults} hasil yang difilter
                    </p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setActiveFilter('all');
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === 'all'
                        ? 'bg-[#f06d98] text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="h-4 w-4 inline mr-1" />
                    Semua ({results.totalResults})
                  </button>
                  
                  {results.results.publications.length > 0 && (
                    <button
                      onClick={() => {
                        setActiveFilter('publications');
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFilter === 'publications'
                          ? 'bg-[#f06d98] text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      📄 Publikasi ({results.results.publications.length})
                    </button>
                  )}
                  
                  {results.results.events.length > 0 && (
                    <button
                      onClick={() => {
                        setActiveFilter('events');
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFilter === 'events'
                          ? 'bg-[#f06d98] text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      📅 Acara ({results.results.events.length})
                    </button>
                  )}
                  
                  {results.results.careers.length > 0 && (
                    <button
                      onClick={() => {
                        setActiveFilter('careers');
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFilter === 'careers'
                          ? 'bg-[#f06d98] text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      💼 Karir ({results.results.careers.length})
                    </button>
                  )}
                  
                  {results.results.discussions.length > 0 && (
                    <button
                      onClick={() => {
                        setActiveFilter('discussions');
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFilter === 'discussions'
                          ? 'bg-[#f06d98] text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      💬 Diskusi ({results.results.discussions.length})
                    </button>
                  )}
                  
                  {results.results.partners.length > 0 && (
                    <button
                      onClick={() => {
                        setActiveFilter('partners');
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFilter === 'partners'
                          ? 'bg-[#f06d98] text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      🤝 Mitra ({results.results.partners.length})
                    </button>
                  )}
                </div>
              </div>
            </div>

            {currentResults.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {currentResults.map((result, index) => (
                    <div key={`${result.type}-${result.id}-${index}`} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      {(result.image || result.image_url) && (
                        <div className="aspect-video bg-gray-100 rounded-t-xl overflow-hidden">
                          <img
                            src={result.image || result.image_url}
                            alt={result.title || result.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#f06d98]/10 text-[#f06d98] text-xs font-medium rounded-full">
                            {getResultIcon(result)} {getResultTypeName(result)}
                          </span>
                          {result.date && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              {result.date}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {result.title || result.name}
                        </h3>
                        
                        {result.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {result.description}
                          </p>
                        )}
                        
                        <div className="flex flex-col gap-1 mb-4">
                          {result.author && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <User className="h-3 w-3" />
                              {result.author}
                            </span>
                          )}
                          {result.location && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" />
                              {result.location}
                            </span>
                          )}
                        </div>
                        
                        <Link
                          href={getResultLink(result)}
                          className="inline-flex items-center gap-2 text-[#f06d98] hover:text-[#e05c87] font-medium text-sm"
                          target={result.url ? "_blank" : "_self"}
                          rel={result.url ? "noopener noreferrer" : undefined}
                        >
                          Lihat Detail
                          {result.url ? (
                            <ExternalLink className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === page
                            ? 'bg-[#f06d98] text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Tidak ada hasil
                </h3>
                <p className="text-gray-600 mb-4">
                  Tidak ditemukan hasil untuk "{results.query}" dengan filter yang dipilih.
                </p>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="text-[#f06d98] hover:underline"
                >
                  Tampilkan semua hasil
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Mulai Pencarian
            </h3>
            <p className="text-gray-600">
              Masukkan kata kunci untuk mencari acara, publikasi, karir, diskusi, dan mitra.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#f06d98] mb-4"></div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
} 