import React from 'react';
import Image from 'next/image';

const AcademicaPoliticaPage = () => {
  const pageTitle = "Academia Politica";

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative py-32 text-center bg-primary text-black"
      >
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 !text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{pageTitle}</h1>
          <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto mb-6 !text-white">
            Menciptakan Pemimpin Muda Peduli Iklim Melalui Workshop Interaktif "Role Playing"
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
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Pendidikan Politik yang Menyenangkan</h2>
            <p className="text-gray-700 leading-relaxed">
              Yayasan Partisipasi Muda, melalui gerakan Generasi Melek Politik, berkomitmen menghadirkan pendidikan politik yang menyenangkan bagi generasi muda. Salah satu inisiatifnya adalah <strong>"Academia Politica,"</strong> sebuah lokakarya berbasis <em>role-playing</em> yang membekali peserta dengan pemahaman mendalam tentang kepemimpinan, pembuatan kebijakan, dan advokasi iklim.
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
                alt="Lokasi Pelaksanaan Academia Politica"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first"> {/* Text on left */}
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Jangkauan Program</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
              Academia Politica telah diselenggarakan sejak tahun 2019 di berbagai kota dan provinsi di Indonesia, yaitu:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700">
                <li>DKI Jakarta</li>
                <li>Bandung, Jawa Barat</li>
                <li>Yogyakarta, DIY</li>
                <li>Samarinda,Kalimantan Timur</li>
                <li>Makassar,Sulawesi Selatan</li>
                <li>Ambon, Maluku (coming soon)</li>
                <li>Manado, Sulawesi Utara (coming soon)</li>
                <li>Nusa Tenggara Barat (coming soon)</li>
                <li>Kalimantan Selatan (coming soon)</li>
                <li>Jambi (coming soon)</li>
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
                src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
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
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
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
                src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
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
      
    </>
  );
};

export default AcademicaPoliticaPage; 