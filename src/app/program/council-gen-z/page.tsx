import React from 'react';
import Image from 'next/image';

const CouncilGenZPage = () => {
  const pageTitle = "Council of Gen Z";

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative py-32 text-center bg-primary text-black"
      >
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 !text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{pageTitle}</h1>
          <p className="text-lg md:text-xl text-[rgb(41,56,87/90%)] max-w-3xl mx-auto mb-6 !text-white">
            Ruang Aspirasi Anak Muda Akan Krisis Iklim Untuk Prabowo-Gibran
          </p>
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
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Tentang Council of Gen Z</h2>
              <p className="text-[rgb(41,56,87/90%)] leading-relaxed mb-4">
              Council of Gen Z (COGZ) adalah ruang berpolitik yang aman dan demokratis tempat komunitas anak muda dari daerah rentan iklim dapat mengekspresikan diri tanpa rasa takut untuk menyampaikan aspirasi dan kegelisahan mereka kepada pemerintah terpilih.
              </p>
              <p className="text-[rgb(41,56,87/90%)] leading-relaxed">
              Kegiatan ini bertujuan untuk mendorong dialog yang bermakna dan memastikan suara anak muda didengar serta diakui dalam proses pengambilan keputusan, terutama dalam memprioritaskan isu-isu perubahan iklim yang memengaruhi hidup dan masa depan mereka.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Youth Demands Heading */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Tuntutan Aspirasi Anak Muda dari 5 Daerah ke Representasi Pemerintahan Prabowo-Gibran</h2>
        </div>
        
        {/* Kalimantan */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 mb-16">
          <div className="w-full md:w-1/3">
            <Image 
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
              alt="Kalimantan - Kota Berkelanjutan"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
            <h3 className="text-xl font-semibold text-primary mt-4 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Kalimantan - Kota Berkelanjutan</h3>
          </div>
          <div className="w-full md:w-2/3">
            <ul className="list-disc list-outside pl-5 space-y-2 text-[rgb(41,56,87/90%)]">
              <li>Pembangunan di Kalimantan harus berlandaskan pada prinsip keberlanjutan. Tidak hanya mempertimbangkan aspek ekonomi, tetapi juga sosial dan lingkungan, terutama dalam pembangunan Ibu Kota Nusantara (IKN).</li>
              <li>Pemerintah harus melakukan studi lingkungan yang mendalam dan melibatkan masyarakat lokal dalam pengambilan keputusan.</li>
            </ul>
          </div>
        </div>
        
        {/* Bandung */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 mb-16">
          <div className="w-full md:w-1/3">
            <Image 
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
              alt="Bandung - Transportasi Berkelanjutan"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
            <h3 className="text-xl font-semibold text-primary mt-4 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Bandung - Transportasi Berkelanjutan</h3>
          </div>
          <div className="w-full md:w-2/3">
            <ul className="list-disc list-outside pl-5 space-y-2 text-[rgb(41,56,87/90%)]">
              <li>Penggunaan kendaraan listrik dapat terus digaungkan. Mulai dari mempermudah regulasi, mendukung pembangunan infrastruktur sarana prasarana pendukung operasional kendaraan listrik, hingga pemberian subsidi untuk meringankan harga kendaraan listrik.</li>
              <li>Peningkatan kualitas pelayanan transportasi umum melalui penyediaan layanan yang terintegrasi dalam segi rute, manajemen, hingga sistem pembayaran.</li>
              <li>Peningkatan kualitas trotoar melalui penghijauan dan pemberian pengamanan bagi pejalan kaki.</li>
            </ul>
          </div>
        </div>
        
        {/* Jakarta */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 mb-16">
          <div className="w-full md:w-1/3">
            <Image 
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
              alt="Jabodetabek - Pengelolaan Limbah Berkelanjutan"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
            <h3 className="text-xl font-semibold text-primary mt-4 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Jabodetabek - Pengelolaan Limbah Berkelanjutan</h3>
          </div>
          <div className="w-full md:w-2/3">
            <ul className="list-disc list-outside pl-5 space-y-2 text-[rgb(41,56,87/90%)]">
              <li>Membuat kebijakan berdasarkan asas ramah lingkungan.</li>
              <li>Membentuk kolaborasi antar <em>stakeholder</em> untuk mengatasi masalah sampah dan lingkungan.</li>
              <li>Membentuk program <em>Green Certification</em> untuk memastikan praktik industri berjalan sesuai asas peduli lingkungan.</li>
            </ul>
          </div>
        </div>
        
        {/* Yogyakarta */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 mb-16">
          <div className="w-full md:w-1/3">
            <Image 
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
              alt="Yogyakarta - Pariwisata Berkelanjutan"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
            <h3 className="text-xl font-semibold text-primary mt-4 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Yogyakarta - Pariwisata Berkelanjutan</h3>
          </div>
          <div className="w-full md:w-2/3">
            <ul className="list-disc list-outside pl-5 space-y-2 text-[rgb(41,56,87/90%)]">
              <li>Memperkuat regulasi Analisis Mengenai Dampak Lingkungan Hidup (AMDAL).</li>
              <li>Penyuluhan menyeluruh terhadap masyarakat terkait pembangunan objek wisata yang <em>sustainable</em> dan bebas dari pungutan liar.</li>
              <li>Memastikan pembangunan sudah memikirkan keadaan lingkungan jangka panjang untuk lingkungan alam dan masyarakat sekitar.</li>
            </ul>
          </div>
        </div>
        
        {/* Sulawesi */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
          <div className="w-full md:w-1/3">
            <Image 
              src="/images/program/DSC08852-a.jpg" // Use an existing image as placeholder
              alt="Sulawesi - Polusi Laut"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
            <h3 className="text-xl font-semibold text-primary mt-4 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Sulawesi - Polusi Laut</h3>
          </div>
          <div className="w-full md:w-2/3">
            <ul className="list-disc list-outside pl-5 space-y-2 text-[rgb(41,56,87/90%)]">
              <li>Peningkatan pengetahuan dan kesadaran lingkungan masyarakat dan perusahaan demi kelestarian sumber daya laut.</li>
              <li>Pengembangan ekonomi lokal harus didorong melalui praktik yang ramah lingkungan dan pembinaan ekonomi kreatif.</li>
              <li>Pemberlakuan sistem <em>reward and punishment</em> dari pemerintah terkait lingkungan laut.</li>
              <li>Mengikutsertakan masyarakat lokal dan pemangku kepentingan lain dalam perumusan dan penerapan kebijakan.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 4: Government Responses Heading */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Tanggapan Representasi Pemerintahan Prabowo-Gibran Terkait Aspirasi Anak Muda</h2>
          </div>
          
          {/* Tanggapan Grid */}
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
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Kota Berkelanjutan</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Masyarakat, NGO, perusahaan, dan pemerintah memiliki peran yang sama pentingnya dalam membangun kota yang ramah lingkungan tanpa merusak ekosistem yang ada khususnya dalam pembangunan IKN.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Transportasi Berkelanjutan</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Indonesia harus mencontoh Singapura yang berhasil menurunkan hampir setengah emisinya dengan membuat atap di atas trotoar demi kenyamanan pejalan kaki.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Pariwisata, Limbah & Polusi Laut</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Menghidupkan pemahaman tambahan bahwa sampah tidak cukup hanya dibuang melainkan harus dipilah dengan benar sebagai bentuk mitigasi penumpukan sampah dengan kandungan gas metana yang tinggi.</p>
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
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Kota Berkelanjutan</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Sebelum mengeluarkan Izin Usaha Pertambangan (IUP), diperlukan proses verifikasi secara jelas dari Kementerian ESDM serta Kementerian lainnya yang sifatnya bukan hanya sekadar formalitas di lapangan.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Transportasi Berkelanjutan</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Seperti di Rusia, Indonesia memerlukan integrasi transportasi publik dari satu daerah ke daerah lain sehingga memudahkan mobilitas pengguna.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Pariwisata, Limbah & Polusi Laut</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Terus menyuarakan usulan dan gagasan anak muda di forum audiensi serta membawa data atau jurnal pendukung sehingga mudah diimplementasikan.</p>
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
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Kota Berkelanjutan</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Pentingnya mengutamakan pembangunan yang sesuai dengan karakteristik Indonesia dan bersifat transit oriented. Tidak hanya itu, krusialnya peran masyarakat lokal dalam mengawasi pembangunan IKN agar selalu sustainable.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Transportasi & Pariwisata</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Memperhatikan kesamaan standar polusi udara antara Kementerian atau institusi di Indonesia dengan institusi global. Masyarakat lokal harus mencontohkan perilaku turisme yang baik.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[rgb(41,56,87/90%)] mb-1">Limbah & Polusi Laut</h4>
                    <p className="text-[rgb(41,56,87/90%)] text-sm">Perlunya regulasi yang ketat terkait pengolahan limbah bagi setiap industri. Terus mengadvokasi para pebisnis dan elit politik di daerah terkait pentingnya menjaga ekosistem laut.</p>
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
              alt="Tentang Generasi Melek Politik"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Tentang Generasi Melek Politik</h2>
            <p className="text-[rgb(41,56,87/90%)] leading-relaxed">
              Generasi Melek Politik adalah sebuah organisasi yang berfokus pada edukasi partisipasi politik anak muda, di bawah Yayasan Partisipasi Muda yang didirikan pada tahun 2017. Generasi Melek Politik memiliki tiga tujuan besar dalam mendorong keterlibatan generasi muda dalam ranah politik yaitu memberikan edukasi kepada anak muda tentang pentingnya partisipasi politik, menyiapkan pemimpin masa depan Indonesia menggunakan sesi pelatihan kebijakan publik, serta memberikan ruang inklusif bagi anak muda untuk bersuara dan berkontribusi dalam menentukan arahan kebijakan publik Indonesia bersama dengan politisi, pemerintah, dan aktor masyarakat sipil.
            </p>
            
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Narahubung</h3>
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