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
    <section className="py-12 bg-white text-gray-900 rounded-b-[40px]">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-center text-xl md:text-2xl font-bold mb-8">Mitra Kami</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 snap-x snap-mandatory">
          {partners.map((partner) => (
            <Link 
              href={partner.url} 
              key={partner.name}
              target="_blank" 
              rel="noopener noreferrer" 
              className="group h-full flex-shrink-0 snap-center"
            >
              <div className="bg-white w-48 h-48 md:w-56 md:h-56 rounded-lg hover:bg-gray-50 transition-all duration-300 flex flex-col items-center justify-center flex-shrink-0 snap-center">
                <div className="flex-1 flex items-center justify-center w-full py-4">
                  <Image 
                    src={partner.logo} 
                    alt={`${partner.name} logo`} 
                    width={180} 
                    height={180} 
                    className="object-contain transition-all group-hover:scale-105"
                    style={{
                      maxHeight: '140px',
                      maxWidth: '140px',
                      width: '100%',
                      height: 'auto'
                    }}
                  />
                </div>
                <span className="text-center font-medium text-gray-800 group-hover:text-primary transition text-sm mt-4">
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