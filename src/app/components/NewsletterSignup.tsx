'use client';

import { FormEvent, useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock API call - would be replaced with actual newsletter signup API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setHasSubmitted(true);
    setEmail('');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center max-w-7xl">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Tetap Terinformasi dan Terlibat</h2>
        <p className="text-lg mb-8 text-gray-600 max-w-2xl mx-auto">
          Berlangganan newsletter kami untuk pembaruan tentang program, acara, dan sumber daya pendidikan kami.
        </p>
        
        <div className="max-w-md mx-auto">
          {hasSubmitted ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <p className="font-medium">Terima kasih telah berlangganan!</p>
              <p>Kami akan terus mengabari Anda dengan berita dan peluang terbaru.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Alamat email Anda"
                required
                className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-md font-medium transition disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Berlangganan...' : 'Berlangganan'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup; 