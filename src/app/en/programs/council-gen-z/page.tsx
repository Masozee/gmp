import React from 'react';
import Image from 'next/image';

const CouncilGenZPage = () => {
  const pageTitle = "Council of Gen Z";

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative py-32 text-center text-black"
        style={{ backgroundColor: '#59caf5' }}
      >
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 !text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{pageTitle}</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 !text-white">
            Young People's Aspirational Space on Climate Crisis for Prabowo-Gibran
          </p>
        </div>
      </section>

      {/* Section 1: Introduction (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
              alt="Council of Gen Z Event"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Bridging Young Generation Aspirations</h2>
            <p className="text-[rgb(41,56,87/90%)] leading-relaxed mb-4">
              <strong>Jakarta, September 21, 2024</strong> – In Indonesia, Gen Z is a demographic bonus that continues to be considered as important voters in general elections. But ironically, there is virtually no space for them to convey aspirations directly to the government. Yet, Gen Z is the generation that will face the direct impact of today's decisions, including in small areas that often escape attention.
            </p>
            <p className="text-[rgb(41,56,87/90%)] leading-relaxed">
              In democratic countries, open dialogue culture like <em>town hall meetings</em> becomes part of the political process. For example in the United States, Finland, New Zealand, and the United Kingdom which have Youth Parliament Forums to enable young people to convey criticism and aspirations directly to the government. However, in Indonesia, such dialogue culture is still minimal, especially for young people.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: COGZ Initiative (Text Left, Image Right) */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 md:order-last"> {/* Image on right */}
              <Image 
                src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
                alt="COGZ Participants"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first"> {/* Text on left */}
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Council of Gen Z Initiative</h2>
              <p className="text-[rgb(41,56,87/90%)] leading-relaxed mb-4">
                Recognizing the importance of young generation participation in democracy, <strong>Generasi Melek Politik</strong> under the auspices of <strong>Partisipasi Muda Foundation</strong> is committed to being a pioneer in strengthening youth participation. The presence of <strong>Council of Gen Z</strong> (COGZ) with the theme <strong>"Climate Crisis Policy in the New Government: Golden Indonesia or Anxious Indonesia?"</strong> is an initiative that aims to create a safe and inclusive political participation space for young people.
              </p>
              <p className="text-[rgb(41,56,87/90%)] leading-relaxed">
                COGZ successfully brought together 10 Gen Z representatives who were the best participants of Academia Politica, coming from various regions namely Kalimantan, Bandung, Yogyakarta, Jabodetabek, and Sulawesi. COGZ participants directly conveyed their regional issues to representatives of the new Prabowo-Gibran government, namely Triana Krisandini Tandjung, Gemintang Kejora Mallarangeng, and Faiz Arsyad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Youth Demands Heading */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Young People's Aspirational Demands from 5 Regions to Prabowo-Gibran Government Representatives</h2>
        </div>
        
        {/* Kalimantan */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 mb-16">
          <div className="w-full md:w-1/3">
            <Image 
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
              alt="Kalimantan - Sustainable Cities"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
            <h3 className="text-xl font-semibold text-primary mt-4 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Kalimantan - Sustainable Cities</h3>
          </div>
          <div className="w-full md:w-2/3">
            <ul className="list-disc list-outside pl-5 space-y-2 text-[rgb(41,56,87/90%)]">
              <li>Development in Kalimantan must be based on sustainability principles. Not only considering economic aspects, but also social and environmental, especially in the development of the Nusantara Capital City (IKN).</li>
              <li>The government must conduct in-depth environmental studies and involve local communities in decision-making.</li>
            </ul>
          </div>
        </div>
        
        {/* Bandung */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 mb-16">
          <div className="w-full md:w-1/3">
            <Image 
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
              alt="Bandung - Sustainable Transportation"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
            <h3 className="text-xl font-semibold text-primary mt-4 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Bandung - Sustainable Transportation</h3>
          </div>
          <div className="w-full md:w-2/3">
            <ul className="list-disc list-outside pl-5 space-y-2 text-[rgb(41,56,87/90%)]">
              <li>The use of electric vehicles can continue to be promoted. Starting from simplifying regulations, supporting the development of supporting infrastructure for electric vehicle operations, to providing subsidies to reduce electric vehicle prices.</li>
              <li>Improving public transportation service quality through providing integrated services in terms of routes, management, and payment systems.</li>
              <li>Improving sidewalk quality through greening and providing security for pedestrians.</li>
            </ul>
          </div>
        </div>
        
        {/* Jakarta */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 mb-16">
          <div className="w-full md:w-1/3">
            <Image 
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
              alt="Jabodetabek - Sustainable Waste Management"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
            <h3 className="text-xl font-semibold text-primary mt-4 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Jabodetabek - Sustainable Waste Management</h3>
          </div>
          <div className="w-full md:w-2/3">
            <ul className="list-disc list-outside pl-5 space-y-2 text-[rgb(41,56,87/90%)]">
              <li>Creating policies based on environmentally friendly principles.</li>
              <li>Building collaboration between <em>stakeholders</em> to address waste and environmental problems.</li>
              <li>Establishing <em>Green Certification</em> programs to ensure industrial practices run according to environmentally conscious principles.</li>
            </ul>
          </div>
        </div>
        
        {/* Yogyakarta */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 mb-16">
          <div className="w-full md:w-1/3">
            <Image 
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
              alt="Yogyakarta - Sustainable Tourism"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
            <h3 className="text-xl font-semibold text-primary mt-4 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Yogyakarta - Sustainable Tourism</h3>
          </div>
          <div className="w-full md:w-2/3">
            <ul className="list-disc list-outside pl-5 space-y-2 text-[rgb(41,56,87/90%)]">
              <li>Strengthening Environmental Impact Assessment (AMDAL) regulations.</li>
              <li>Comprehensive education to the community regarding <em>sustainable</em> tourism development and free from illegal levies.</li>
              <li>Ensuring development has considered long-term environmental conditions for the natural environment and surrounding communities.</li>
            </ul>
          </div>
        </div>
        
        {/* Sulawesi */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
          <div className="w-full md:w-1/3">
            <Image 
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
              alt="Sulawesi - Marine Pollution"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
            <h3 className="text-xl font-semibold text-primary mt-4 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Sulawesi - Marine Pollution</h3>
          </div>
          <div className="w-full md:w-2/3">
            <ul className="list-disc list-outside pl-5 space-y-2 text-[rgb(41,56,87/90%)]">
              <li>Increasing environmental knowledge and awareness of communities and companies for marine resource conservation.</li>
              <li>Local economic development must be encouraged through environmentally friendly practices and creative economy development.</li>
              <li>Implementation of <em>reward and punishment</em> systems from the government regarding marine environment.</li>
              <li>Involving local communities and other stakeholders in policy formulation and implementation.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 4: Government Responses Heading */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Prabowo-Gibran Government Representatives' Responses to Young People's Aspirations</h2>
          </div>
          
          {/* Response Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Triana */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-64">
                <Image 
                  src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
                  alt="Triana Krisandini Tandjung"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Triana Krisandini Tandjung</h3>
                <p className="text-sm text-gray-500 mb-4">Partai Golongan Karya (GOLKAR)</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Sustainable Cities</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Communities, NGOs, companies, and government have equally important roles in building environmentally friendly cities without damaging existing ecosystems, especially in IKN development.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Sustainable Transportation</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Indonesia should follow Singapore's example which successfully reduced almost half of its emissions by creating roofs over sidewalks for pedestrian comfort.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Tourism, Waste & Marine Pollution</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Fostering additional understanding that waste is not enough to just be thrown away but must be properly sorted as a form of mitigation for waste accumulation with high methane content.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Faiz */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-64">
                <Image 
                  src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
                  alt="Faiz Arsyad"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Faiz Arsyad</h3>
                <p className="text-sm text-gray-500 mb-4">Partai Amanat Nasional</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Sustainable Cities</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Before issuing Mining Business Permits (IUP), a clear verification process is needed from the Ministry of Energy and Mineral Resources and other Ministries that is not just a formality in the field.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Sustainable Transportation</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Like in Russia, Indonesia needs public transportation integration from one region to another to facilitate user mobility.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Tourism, Waste & Marine Pollution</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Continue to voice young people's proposals and ideas in audience forums and bring supporting data or journals so they are easy to implement.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gemintang */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-64">
                <Image 
                  src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
                  alt="Gemintang Kejora Mallarangeng"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Gemintang Kejora Mallarangeng</h3>
                <p className="text-sm text-gray-500 mb-4">Partai Demokrat</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Sustainable Cities</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">The importance of prioritizing development that suits Indonesia's characteristics and is transit oriented. Not only that, the crucial role of local communities in monitoring IKN development to always be sustainable.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Transportation & Tourism</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Paying attention to the similarity of air pollution standards between Ministries or institutions in Indonesia with global institutions. Local communities must exemplify good tourism behavior.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Waste & Marine Pollution</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">The need for strict regulations regarding waste processing for every industry. Continue advocating businesspeople and political elites in regions regarding the importance of maintaining marine ecosystems.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: About GMP */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
              alt="About Generasi Melek Politik"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>About Generasi Melek Politik</h2>
            <p className="text-[rgb(41,56,87/90%)] leading-relaxed">
              Generasi Melek Politik is an organization that focuses on educating young people's political participation, under Partisipasi Muda Foundation established in 2017. Generasi Melek Politik has three major goals in encouraging young generation involvement in the political sphere: providing education to young people about the importance of political participation, preparing Indonesia's future leaders using public policy training sessions, and providing inclusive space for young people to voice and contribute in determining Indonesia's public policy direction together with politicians, government, and civil society actors.
            </p>
            
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Contact Person</h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 relative">
                  <Image 
                    src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
                    alt="Alva Lazuardy"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold">Alva Lazuardy</p>
                  <p className="text-sm text-[rgb(41,56,87/90%)]">Program Manager</p>
                  <p className="text-sm text-[rgb(41,56,87/90%)]">0856-1601-406</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </>
  );
};

export default CouncilGenZPage; 