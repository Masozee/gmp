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
    <section className="py-12 bg-black text-white rounded-b-[40px]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-stretch">
          {partners.map((partner) => (
            <Link 
              href={partner.url} 
              key={partner.name}
              target="_blank" 
              rel="noopener noreferrer" 
              className="group h-full"
            >
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg shadow-lg hover:bg-white/20 transition-all duration-300 flex flex-col items-center justify-between h-full">
                <div className="flex-1 flex items-center justify-center w-full py-4">
                  <Image 
                    src={partner.logo} 
                    alt={`${partner.name} logo`} 
                    width={160} 
                    height={80} 
                    className="object-contain transition-all group-hover:scale-105"
                    style={{
                      maxHeight: '80px',
                      width: 'auto'
                    }}
                  />
                </div>
                <span className="text-center font-medium text-white group-hover:text-primary transition text-sm mt-4">
                  {partner.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners; 