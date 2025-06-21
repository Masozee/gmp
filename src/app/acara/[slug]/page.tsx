'use client';

import { useState } from 'react';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  reason: string;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Create a custom hook to fetch event data
function useEvent(eventSlug: string) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use a regular useEffect with eventSlug as a dependency
  React.useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/${eventSlug}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/acara');
            return;
          }
          throw new Error('Failed to fetch event');
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        router.push('/acara');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchEvent();
  }, [eventSlug, router]);

  return { event, isLoading };
}

export default function EventDetailPage({ params }: PageProps) {
  // Extract the slug from params using React.use() for Next.js 15 compatibility
  const resolvedParams = React.use(params);
  const eventSlug = resolvedParams.slug;
  
  // Use our custom hook for fetching event data
  const { event, isLoading } = useEvent(eventSlug);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    reason: ''
  });
  const [formSuccess, setFormSuccess] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRegistering(false);
    setFormSuccess(true);
  };
  
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        {/* Placeholder for Header */}
        <div className="bg-primary py-32 text-white">
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <div className="h-6 bg-pink-400 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-10 bg-pink-300 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
            <div className="h-80 bg-gray-200 rounded mb-8"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </main>
    );
  }
  
  if (!event) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-primary py-32 text-white shadow-lg">
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <nav className="mb-4 text-sm text-pink-200 justify-center flex space-x-2">
              <Link href="/" className="hover:underline">Beranda</Link>
              <span className="text-pink-300">/</span>
              <Link href="/acara" className="hover:underline">Acara</Link>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold">Acara Tidak Ditemukan</h1>
          </div>
        </header>
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-6">Maaf, acara yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Link 
              href="/acara"
              className="inline-block bg-secondary hover:bg-secondary-dark text-white font-medium py-2 px-4 rounded-md transition"
            >
              Kembali ke Daftar Acara
            </Link>
          </div>
        </div>
      </main>
    );
  }
  
  const registrationProgress = Math.round((event.registeredCount / event.capacity) * 100);
  const seatsRemaining = event.capacity - event.registeredCount;
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-[#f06d98] py-32 text-white shadow-lg">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <nav className="mb-4 text-sm text-pink-200 justify-center flex space-x-2">
            <Link href="/" className="hover:underline !text-white">Beranda</Link>
            <span className="text-pink-300">/</span>
            <Link href="/acara" className="hover:underline !text-white">Acara</Link>
            <span className="text-pink-300">/</span>
            <span className="text-pink-100 truncate max-w-[200px] md:max-w-md !text-white">{event.title}</span>
        </nav>
          <h1 className="text-4xl md:text-5xl font-bold mt-1 mx-auto !text-white">{event.title}</h1>
        </div>
      </header>
        
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Event Details */}
          <div className="flex-1">
            <div className="bg-white rounded-lg mb-8">
              <div className="p-6 md:p-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">Detail Acara</h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 mb-6 border-b pb-4">
                    <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{event.date}</span>
                  </div>
                    <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{event.time}</span>
                  </div>
                    <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
              </div>
            </div>
            
                  {event.address && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">Alamat Lengkap</h3>
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="text-gray-800 font-medium">{event.location}</p>
                          <p className="text-gray-600">{event.address}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-pink-600">Deskripsi Acara</h3>
                    <div className="bg-pink-50 rounded-xl p-6 md:p-8">
                      <div className="text-lg md:text-xl text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: event.description.replace(/\n/g, '<br />') }}></div>
                    </div>
                  </div>
                  
                  {event.isPaid && (
                    <div className="mb-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <h3 className="text-lg font-semibold mb-2 text-primary">Informasi Biaya</h3>
                      <p className="text-gray-700">
                        Biaya pendaftaran: <span className="font-medium text-primary-dark">Rp {event.price?.toLocaleString('id-ID')}</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Informasi pembayaran akan dikirimkan setelah pendaftaran dikonfirmasi.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Right Sidebar - Event Poster/Image */}
          <aside className="w-full lg:w-1/3 flex flex-col items-center lg:sticky lg:top-32 h-fit">
            {/* Poster/Image at the top */}
            <div className="relative w-full h-80 md:h-[420px] rounded-lg overflow-hidden mb-4">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/events/default-event.jpg';
                }}
                priority
              />
              <div className="absolute top-4 right-4 z-20">
                <span className="inline-block bg-primary-dark text-white text-sm font-medium px-3 py-1 rounded-md">
                  {event.category}
                </span>
              </div>
            </div>
            {/* Registration Info */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6 w-full">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Pendaftaran</h3>
              <div className="mb-4">
                <p className="flex justify-between font-medium mb-1">
                  <span>Status:</span>
                  <span className={event.isRegistrationOpen ? 'text-green-600' : 'text-red-600'}>
                    {event.isRegistrationOpen ? 'Dibuka' : 'Ditutup'}
                  </span>
                </p>
                <p className="flex justify-between text-gray-700 text-sm mb-1">
                  <span>Kapasitas:</span>
                  <span>{event.capacity} peserta</span>
                </p>
                <p className="flex justify-between text-gray-700 text-sm mb-1">
                  <span>Terdaftar:</span>
                  <span>{event.registeredCount} peserta</span>
                </p>
                <p className="flex justify-between text-gray-700 text-sm mb-2">
                  <span>Sisa Kuota:</span>
                  <span className={seatsRemaining > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{seatsRemaining > 0 ? `${seatsRemaining} kursi` : 'Penuh'}</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div 
                    className={`${registrationProgress > 80 ? 'bg-red-500' : 'bg-primary'} h-2.5 rounded-full transition-all duration-500 ease-out`} 
                    style={{ width: `${registrationProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-right">{registrationProgress}% terisi</p>
              </div>
              {event.isRegistrationOpen && seatsRemaining > 0 ? (
                <button
                  onClick={() => setShowRegisterForm(true)}
                  className="w-full py-3 px-4 bg-secondary hover:bg-secondary-dark text-white rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                >
                  Daftar Sekarang
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-4 bg-gray-300 text-gray-600 rounded-md font-medium cursor-not-allowed"
                >
                  {seatsRemaining <= 0 && event.isRegistrationOpen ? 'Kuota Penuh' : 'Pendaftaran Ditutup'}
                </button>
              )}
            </div>
            {/* Share Card */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 w-full">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Bagikan Acara Ini</h3>
              <div className="flex space-x-3 justify-center">
                {[ 
                  {name: 'Facebook', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>, color: 'bg-pink-600 hover:bg-pink-700'},
                  {name: 'Twitter', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>, color: 'bg-pink-400 hover:bg-pink-500'},
                  {name: 'WhatsApp', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>, color: 'bg-green-500 hover:bg-green-600'},
                  {name: 'LinkedIn', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>, color: 'bg-pink-700 hover:bg-pink-800'},
                ].map(social => (
                  <button key={social.name} title={`Bagikan di ${social.name}`} className={`p-3 text-white rounded-full transition ${social.color}`}>
                    {social.icon}
                    <span className="sr-only">{social.name}</span>
                </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
        
        {showRegisterForm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {!formSuccess ? (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Formulir Pendaftaran</h2>
                      <p className="text-sm text-gray-600">untuk acara: {event.title}</p>
                    </div>
                    <button 
                      onClick={() => setShowRegisterForm(false)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap*</label>
                      <input type="text" id="name" name="name" required value={formData.name} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                      <input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon*</label>
                      <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">Asal Institusi/Organisasi</label>
                      <input type="text" id="organization" name="organization" value={formData.organization} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                      <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Alasan Mengikuti Acara*</label>
                      <textarea id="reason" name="reason" required rows={3} value={formData.reason} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                    </div>
                    <div className="mt-6">
                      <button type="submit" disabled={isRegistering} className="w-full py-3 px-4 bg-secondary hover:bg-secondary-dark text-white rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isRegistering ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
                  <p className="text-gray-600 mb-6">
                    Terima kasih telah mendaftar untuk acara: <span className="font-semibold">{event.title}</span>. <br/> Konfirmasi akan dikirimkan ke email Anda.
                  </p>
                  <button onClick={() => { setShowRegisterForm(false); setFormSuccess(false); }} className="inline-block bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-md transition">
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 