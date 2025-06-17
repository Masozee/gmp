'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  isRegistrationOpen: boolean;
}

const UpcomingEventsEn = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        
        // Sort events by date (assuming the date format is "DD Month YYYY")
        const sortedEvents = [...data].sort((a, b) => {
          const dateA = parseIndonesianDate(a.date);
          const dateB = parseIndonesianDate(b.date);
          return dateA && dateB ? dateA.getTime() - dateB.getTime() : 0;
        });
        
        setEvents(sortedEvents.slice(0, 3)); // Get only 3 nearest events
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Helper function to parse Indonesian dates
  const parseIndonesianDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    
    // Handle range dates like "15-17 November 2024"
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
  
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse h-96"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (events.length === 0) {
    return null;
  }
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-center">Upcoming Events</h2>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
          Explore our exciting and beneficial events. Join us to enhance your capacity and political engagement.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="relative shadow-xl overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-[450px] group">
              <div className="absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1" 
                style={{ 
                  backgroundImage: `url('${event.image}')`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center'
                }}>
              </div>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9) 100%)' }}></div>
              
              <div className="absolute top-0 right-0 z-10 bg-primary text-white text-sm font-medium px-3 py-1">{event.category}</div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-4">{event.title}</h3>
                
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{event.date}</span>
                  <span className="mx-2">•</span>
                  <span>{event.time}</span>
                </div>
                
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                
                <div className="mt-4">
                  <Link href={`/en/events/${event.id}`}
                    className={`inline-block w-full text-center py-2 px-4 rounded-full font-medium transition-all hover:bg-[#f06d98] hover:text-white ${
                      event.isRegistrationOpen ? 'bg-[#ffcb57] text-black' : 'bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-300 hover:text-gray-600'
                    }`}>
                    {event.isRegistrationOpen ? 'Register Now' : 'Registration Closed'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/en/events" 
            className="inline-block bg-[#ffcb57] hover:bg-[#f06d98] text-black hover:text-white rounded-full px-6 py-3 font-medium transition-colors">
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsEn; 