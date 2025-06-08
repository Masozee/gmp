'use client';

import Image from 'next/image';
import Link from 'next/link';
import partnersData from '../../data/partners.json';

interface Partner {
  order: number;
  name: string;
  logo: string;
  url: string;
}

const PartnersGrid = () => {
  const partners: Partner[] = partnersData.partners.sort((a, b) => a.order - b.order);

  return (
    <section className="py-12 bg-white text-gray-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map((partner) => (
            <Link 
              href={partner.url} 
              key={partner.name}
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersGrid; 