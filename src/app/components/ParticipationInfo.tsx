// import Link from 'next/link';

const ParticipationInfo = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold mb-12 text-gray-900">Bagaimana Anda Bisa Berpartisipasi</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Attend a Workshop */}
          <div className="p-4">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Diskusi</h3>
            <p className="text-gray-600 mb-6">Ikuti sesi literasi politik yang menyenangkan dan interaktif yang dirancang untuk anak muda Indonesia.</p>
            
          </div>

          {/* Download Free Materials */}
          <div className="p-4">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Temu Kandidat</h3>
            <p className="text-gray-600 mb-6">Akses infografis, toolkit, dan e-book tentang literasi politik dan keterlibatan sipil.</p>
           
          </div>

          {/* Volunteer With Us */}
          <div className="p-4">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Academia Politica</h3>
            <p className="text-gray-600 mb-6">Bantu menjalankan program dan acara yang memberdayakan kaum muda dengan pengetahuan politik.</p>
            
          </div>

          {/* Support the Cause */}
          <div className="p-4">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Council of Gen Z</h3>
            <p className="text-gray-600 mb-6">Donasi atau jadilah sponsor untuk membantu kami menjangkau lebih banyak anak muda Indonesia dengan pendidikan berkualitas.</p>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParticipationInfo; 