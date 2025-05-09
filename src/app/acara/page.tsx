'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  description: string;
  image: string;
  category: string;
  isPaid: boolean;
  price?: number;
  isRegistrationOpen: boolean;
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
        <header className="bg-[#f06d98] py-10 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-center">Acara & Kegiatan</h1>
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
      <header className="bg-[#f06d98] py-32 text-white shadow-lg">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Acara & Kegiatan
          </h1>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            Temukan berbagai acara menarik dari Partisipasi Muda untuk meningkatkan kapasitas dan keterlibatan politik pemuda.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4 bg-white p-6 rounded-lg shadow-md h-fit sticky top-28">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Filter Acara</h2>
            
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
                <h3 className="text-xl font-bold mb-2 text-gray-800">Tidak Ada Acara Ditemukan</h3>
                <p className="text-gray-600">Coba gunakan filter atau kata kunci lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredEvents.map((event) => (
              <div key={event.id} className="relative shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-[450px] group">
                <div className="absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1" 
                  style={{ 
                    backgroundImage: `url('${event.image}')`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center'
                  }}>
                </div>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9) 100%)' }}></div>
                <div className="absolute top-0 right-0 z-10 bg-primary text-white text-sm font-medium px-3 py-1">{event.category}</div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col h-2/3 justify-end">
                  <h3 className="text-xl font-bold mb-4 line-clamp-2">{event.title}</h3>
                  <div className="flex items-center mb-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{event.date}</span>
                    <span className="mx-2">•</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center mb-4 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="mt-4">
                    <Link href={`/acara/${event.id}`}
                      className={`inline-block w-full text-center py-2 px-4 rounded-md font-medium transition-all hover:bg-[#F06292] hover:text-white ${
                        event.isRegistrationOpen ? 'bg-yellow-400 text-black' : 'bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-300 hover:text-gray-600'
                      }`}>
                      {event.isRegistrationOpen ? 'Daftar Sekarang' : 'Pendaftaran Ditutup'}
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