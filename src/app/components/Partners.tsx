'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Partner {
  name: string;
  logo: string;
  url: string;
}

const Partners = () => {
  const partners: Partner[] = [
    {
      name: 'Universitas Bakrie',
      logo: '/images/partner/bakrie.png',
      url: 'https://bakrie.ac.id'
    },
    {
      name: 'Climate and Land Use Alliance',
      logo: '/images/partner/climate.png',
      url: 'https://www.climateandlandusealliance.org'
    },
    {
      name: 'Greenpeace',
      logo: '/images/partner/greenpeace.png',
      url: 'https://www.greenpeace.org'
    },
    {
      name: 'International Republican Institute',
      logo: '/images/partner/iri.png',
      url: 'https://www.iri.org'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Mitra Kami</h2>
        <p className="text-lg text-center mb-12 text-gray-600 max-w-3xl mx-auto">
          Kami berkolaborasi dengan organisasi terkemuka untuk memperluas dampak dan jangkauan kami dalam pendidikan politik.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {partners.map((partner) => (
            <Link 
              href={partner.url} 
              key={partner.name}
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex flex-col items-center group transition"
            >
              <div className="h-24 flex items-center justify-center mb-4 relative">
                <Image 
                  src={partner.logo} 
                  alt={`${partner.name} logo`} 
                  width={180} 
                  height={90} 
                  className="object-contain transition-opacity group-hover:opacity-80"
                  style={{
                    maxHeight: '100%',
                    width: 'auto'
                  }}
                />
              </div>
              <span className="text-center font-medium text-gray-700 group-hover:text-secondary transition">
                {partner.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners; 