'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Partner {
  id: number;
  order: number;
  name: string;
  logo: string;
  url: string | null;
}

const PartnersGrid = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch partners from API
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/content/partners');
        if (response.ok) {
          const data = await response.json();
          setPartners(data.partners || []);
        }
      } catch (error) {
        console.error('Failed to fetch partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white text-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-full aspect-square relative mb-4 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white text-gray-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map((partner) => {
            const PartnerContent = (
              <>
                <div className="w-full aspect-square relative mb-4">
                  <Image 
                    src={partner.logo} 
                    alt={`${partner.name} logo`} 
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <span className="text-center text-sm text-gray-600">
                  {partner.name}
                </span>
              </>
            );

            return partner.url ? (
              <Link 
                href={partner.url} 
                key={partner.id}
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {PartnerContent}
              </Link>
            ) : (
              <div 
                key={partner.id}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm"
              >
                {PartnerContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PartnersGrid; 