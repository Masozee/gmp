'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  id: number;
  title: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  description: string;
  en_description: string;
  image: string;
  category: string;
  isPaid: boolean;
  price?: number;
  isRegistrationOpen: boolean;
  registrationLink: string;
  capacity: number;
  registeredCount: number;
}

export default function AcaraPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        
        const sortedEvents = [...data].sort((a, b) => {
          const dateA = parseIndonesianDate(a.date);
          const dateB = parseIndonesianDate(b.date);
          return dateA && dateB ? dateA.getTime() - dateB.getTime() : 0;
        });
        
        setEvents(sortedEvents);
        setFilteredEvents(sortedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setFilteredEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  useEffect(() => {
    let result = [...events];
    if (filter !== 'all') {
      result = result.filter(event => event.category.toLowerCase() === filter.toLowerCase());
    }
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)
      );
    }
    setFilteredEvents(result);
  }, [filter, searchQuery, events]);
  
  const parseIndonesianDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    if (dateString.includes('-')) {
      dateString = dateString.split('-')[0].trim();
    }
    const monthMap: { [key: string]: number } = {
      Januari: 0, Februari: 1, Maret: 2, April: 3, Mei: 4, Juni: 5,
      Juli: 6, Agustus: 7, September: 8, Oktober: 9, November: 10, Desember: 11
    };
    const parts = dateString.split(' ');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const monthName = parts[1];
    const year = parseInt(parts[2], 10);
    const month = monthMap[monthName];
    if (isNaN(day) || isNaN(year) || month === undefined) return null;
    return new Date(year, month, day);
  };
  
  const categories = ['all', ...new Set(events.map(event => event.category.toLowerCase()))];

  const resetFilters = () => {
    setFilter('all');
    setSearchQuery('');
  };
  
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-blue-500 py-10 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-center" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Acara & Kegiatan</h1>
          </div>
        </header>
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="md:col-span-1 lg:col-span-1 bg-gray-100 p-6 rounded-lg animate-pulse h-[300px]"></div>
            <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse h-96"></div>
            ))}
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-blue-500 py-32 text-white shadow-lg">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 !text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
            Acara & Kegiatan
          </h1>
          <p className="text-lg !text-white max-w-3xl mx-auto">
            Temukan berbagai acara menarik dari Partisipasi Muda untuk meningkatkan kapasitas dan keterlibatan politik pemuda.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4 bg-white p-6 rounded-lg shadow-md h-fit sticky top-28">
            <h2 className="text-xl font-bold mb-4 text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Filter Acara</h2>
            
            <div className="mb-6">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Cari Acara</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  placeholder="Judul, lokasi, dll..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select 
                id="category-filter" 
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Semua Kategori' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={resetFilters}
              className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition"
            >
              Reset Filter
            </button>
          </aside>
        
          {/* Main Content - Event Cards */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <p className="text-gray-600">
                Menampilkan {filteredEvents.length} acara {filter !== 'all' ? `dalam kategori "${filter.charAt(0).toUpperCase() + filter.slice(1)}"` : ''}
                {searchQuery ? ` dengan kata kunci "${searchQuery}"` : ''}
              </p>
            </div>
            
            {filteredEvents.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow-md text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold mb-2 text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Tidak Ada Acara Ditemukan</h3>
                <p className="text-gray-600">Coba gunakan filter atau kata kunci lain.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredEvents.map(event => (
                  <div key={event.id} className="flex flex-col sm:flex-row bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Event Image */}
                    <div className="sm:w-1/3 relative">
                      <img
                        src={event.image || '/images/default-event.jpg'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-2">
                        <span className="text-xs font-semibold rounded-full px-2 py-0.5 bg-[#ffe066] text-black">
                          {event.isPaid ? `Rp${event.price?.toLocaleString('id-ID')}` : 'Gratis'}
                        </span>
                        <span className="text-xs font-semibold bg-[#ffe066] text-black rounded-full px-2 py-0.5">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Event Content */}
                    <div className="p-6 sm:w-2/3 flex flex-col">
                      <h3 className="text-xl font-bold mb-2 text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
                        {event.title}
                      </h3>
                      
                      <div className="text-sm text-gray-600 mb-4">
                        <div className="flex items-center mb-1">
                          <svg className="h-4 w-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {event.date}
                        </div>
                        <div className="flex items-center mb-1">
                          <svg className="h-4 w-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {event.time}
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.location}
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      
                      {/* Speakers - This assumes speakers data is in the description format "Speakers: Name1, Name2" */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Pembicara:</h4>
                        <p className="text-sm text-gray-600">
                          {event.description.includes("Pembicara:") ? 
                            event.description.split("Pembicara:")[1].split(".")[0].trim() : 
                            "Info pembicara akan diumumkan"}
                        </p>
                      </div>
                      
                      {/* Button */}
                      <div className="mt-auto">
                        <Link 
                          href={`/acara/${event.slug}`}
                          className="inline-block font-medium py-2 px-4 rounded-md text-sm bg-[#f06d98] text-white hover:bg-[#ffe066] hover:text-black transition-colors"
                        >
                          Lebih Lanjut
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 