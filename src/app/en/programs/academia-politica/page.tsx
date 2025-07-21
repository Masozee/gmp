import React from 'react';
import Image from 'next/image';

const AcademicaPoliticaPage = () => {
  const pageTitle = "Academia Politica";

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
            Creating Climate-Conscious Young Leaders Through Interactive "Role Playing" Workshops
          </p>
          
        </div>
      </section>

      {/* Section 1: Introduction (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
              alt="Academia Politica Workshop"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Fun Political Education</h2>
            <p className="text-gray-700 leading-relaxed">
              Partisipasi Muda Foundation, through the Generasi Melek Politik movement, is committed to providing fun political education for young people. One of its initiatives is <strong>"Academia Politica,"</strong> a role-playing-based workshop that equips participants with deep understanding of leadership, policy-making, and climate advocacy.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Implementation (Text Left, Image Right) */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 md:order-last"> {/* Image on right */}
              <Image 
                src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
                alt="Academia Politica Implementation Location"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first"> {/* Text on left */}
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Program Reach</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                This program is present in various regions vulnerable to climate crisis in Indonesia:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700">
                <li>Jakarta</li>
                <li>Bandung</li>
                <li>Yogyakarta</li>
                <li>East Kalimantan</li>
                <li>South Sulawesi</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

       {/* Section 3: Methodology (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
              alt="Role Playing in Academia Politica"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Role-Playing Methodology</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Through <em>role-playing</em>, participants have the opportunity to play roles as:
            </p>
            <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700 mb-4">
              <li>Academics</li>
              <li>Parliament Members</li>
              <li>Government</li>
              <li>Non-Governmental Organization (NGO)</li>
              <li>Corporations or Business People</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              This way, they can directly experience how effective political communication is needed in the policy-making process, including public speaking skills, building arguments, and negotiating.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Impact (Text Left, Image Right) */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 md:order-last"> {/* Image on right */}
              <Image 
                src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
                alt="Academia Politica Impact"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first"> {/* Text on left */}
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Measurable Impact</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                So far, Academia Politica has trained <strong>245 young people</strong> with extraordinary results. On average, participants experienced increased confidence in various aspects:
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-primary text-xl mb-1">53.5%</p>
                  <p className="text-sm text-gray-600">Public Speaking</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-primary text-xl mb-1">51.2%</p>
                  <p className="text-sm text-gray-600">Negotiation Skills</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-primary text-xl mb-1">55.8%</p>
                  <p className="text-sm text-gray-600">Argument-building Skills</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-primary text-xl mb-1">74.4%</p>
                  <p className="text-sm text-gray-600">Critical Thinking & Problem Solving</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Support (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
              alt="Academia Politica Supporters"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Expert Support</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This program is supported by various public policy experts, such as:
            </p>
            <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700">
              <li>Arya Fernandes (Head of Politics and Social Department CSIS)</li>
              <li>Dr. Hasrul Hanif, M.A. (Lecturer at Department of Politics and Government UGM)</li>
              <li>Dra. Mudiyati Rahmatunnisa, M.A., Ph.D. (Political Science Lecturer at Padjadjaran University)</li>
              <li>Armand Suparman (Executive Director of KPPOD)</li>
              <li>Elisa Sutanudjaja (Executive Director of Rujak Center for Urban Studies)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 6: Vision (Text Left, Image Right) */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 md:order-last"> {/* Image on right */}
              <Image 
                src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
                alt="Academia Politica Vision"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first"> {/* Text on left */}
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Future Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                Academia Politica aims to foster young people's interest in contributing to Indonesia's political improvement. With youth representation still minimal in parliament—only 4.5% of DPR members are under 30 years old and 15.9% under 40 years old according to The Inter-Parliamentary Union (IPU) data in 2024—this program exists to prepare a generation of leaders who are not only aware of climate crisis threats, but also ready to play an active role in their communities.
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </>
  );
};

export default AcademicaPoliticaPage; 