import React from 'react';
import Image from 'next/image';
import AcademicaPoliticaMapWrapper from '@/components/AcademicaPoliticaMapWrapper';

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
          Meningkatkan partisipasi politik dan advokasi iklim dengan role-playing
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
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Meningkatkan partisipasi politik dan advokasi iklim dengan role-playing</h2>
            <p className="text-gray-700 leading-relaxed">
            Program ini bertujuan untuk membekali anak muda dengan pemahaman tentang proses perumusan kebijakan publik dan peran yang dapat mereka ambil di dalamnya.
            <br />
            Melalui metode role-playing, peserta akan berperan sebagai aktor-aktor kunci di pembuatan kebijakan dan bersama-sama merumuskan solusi atas tantangan krisis iklim.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Implementation (Text Left, Map Right) */}
      <section className="bg-gray-50">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          <div className="w-full md:w-1/2 md:order-last">
            <AcademicaPoliticaMapWrapper className="w-full h-full min-h-[600px]" />
          </div>
          <div className="w-full md:w-1/2 md:order-first flex items-center">
            <div className="container mx-auto px-4 py-8 md:py-16 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Jangkauan Program</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Academia Politica telah diselenggarakan sejak tahun 2019 di berbagai kota dan provinsi di Indonesia, yaitu:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700">
                <li>DKI Jakarta</li>
                <li>Bandung, Jawa Barat</li>
                <li>Yogyakarta, DIY</li>
                <li>Samarinda, Kalimantan Timur</li>
                <li>Makassar, Sulawesi Selatan</li>
                <li>Sorong, Papua Barat</li>
                <li>Jayapura, Papua</li>
                <li className="text-gray-500">Ambon, Maluku (coming soon)</li>
                <li className="text-gray-500">Manado, Sulawesi Utara (coming soon)</li>
                <li className="text-gray-500">Nusa Tenggara Barat (coming soon)</li>
                <li className="text-gray-500">Kalimantan Selatan (coming soon)</li>
                <li className="text-gray-500">Jambi (coming soon)</li>
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
              src="/images/bg/DSC08319.png" // Use an existing image as placeholder
              alt="Role Playing dalam Academia Politica"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Metodologi Role-Playing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Melalui <em>role-playing</em>, peserta berkesempatan untuk berperan sebagai:
            </p>
            <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700 mb-4">
              <li>Akademisi</li>
              <li>Anggota DPR</li>
              <li>Pemerintah</li>
              <li>Non-Governmental Organization (NGO)</li>
              <li>Korporasi atau Pebisnis</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Dengan cara ini, mereka dapat merasakan langsung bagaimana komunikasi politik yang efektif dibutuhkan dalam proses pembuatan kebijakan, termasuk keterampilan berbicara di depan umum, membangun argumen, dan bernegosiasi.
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
                src="/images/bg/IMG_0043.png" // Use an existing image as placeholder
                alt="Dampak Academia Politica"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first"> {/* Text on left */}
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Dampak yang Terukur</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
              <strong>345 siswa</strong> SMA dan mahasiswa telah diberdayakan dengan pengetahuan tentang isu perubahan iklim dan perumusan kebijakan. Rata-rata penerima manfaat mengalami peningkatan kepercayaan diri dalam berbagai aspek, yaitu:
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
              src="/images/bg/DSC08073.png" // Use an existing image as placeholder
              alt="Pendukung Academia Politica"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Dukungan Pakar</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Program ini didukung oleh berbagai pakar kebijakan publik, seperti:
            </p>
            <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700">
              <li>Arya Fernandes (Kepala Departemen Politik dan Sosial CSIS)</li>
              <li>Dr. Hasrul Hanif, M.A. (Dosen Departemen Politik dan Pemerintahan UGM)</li>
              <li>Dra. Mudiyati Rahmatunnisa, M.A., Ph.D. (Dosen Ilmu Politik Universitas Padjadjaran)</li>
              <li>Armand Suparman (Direktur Eksekutif KPPOD)</li>
              <li>Elisa Sutanudjaja (Direktur Eksekutif Rujak Center for Urban Studies)</li>
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
                src="/images/bg/138A3726.png" // Use an existing image as placeholder
                alt="Visi Academia Politica"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first"> {/* Text on left */}
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Visi ke Depan</h2>
              <p className="text-gray-700 leading-relaxed">
                Academia Politica bertujuan menumbuhkan minat anak muda untuk berkontribusi dalam perbaikan politik Indonesia. Dengan representasi pemuda yang masih minim di parlemen—hanya 4,5% anggota DPR berusia di bawah 30 tahun dan 15,9% di bawah 40 tahun menurut data The Inter-Parliamentary Union (IPU) tahun 2024—program ini hadir untuk mempersiapkan generasi pemimpin yang tidak hanya sadar akan ancaman krisis iklim, tetapi juga siap berperan aktif di komunitasnya.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 md:order-last">
              <Image 
                src="/images/bg/138A3337.png"
                alt="Materi Pembelajaran Climate Leaders"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first">
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Materi yang Diajarkan</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-2 flex-shrink-0">
                    <span className="text-black font-bold text-lg">📋</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Public Policy 101</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Memahami dasar-dasar kebijakan publik, proses pembuatan kebijakan, dan bagaimana mengadvokasi perubahan kebijakan yang berpihak pada lingkungan dan generasi muda.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-secondary rounded-full p-2 flex-shrink-0">
                    <span className="text-white font-bold text-lg">🌍</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Climate Change 101</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Pemahaman mendalam tentang sains perubahan iklim, dampaknya terhadap Indonesia, dan solusi-solusi inovatif yang dapat diterapkan di tingkat lokal dan nasional.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-accent rounded-full p-2 flex-shrink-0">
                    <span className="text-white font-bold text-lg">🎤</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Public Speaking 101</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Mengembangkan keterampilan komunikasi publik yang efektif, storytelling untuk isu lingkungan, dan teknik presentasi yang mempengaruhi audiens.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </>
  );
};

export default AcademicaPoliticaPage; 