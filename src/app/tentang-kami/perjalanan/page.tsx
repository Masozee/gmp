import React from 'react';
import Image from 'next/image';

const PerjalananPage = () => {
  const timelineData = [
    {
      year: '2017',
      description: 'Gagasan Generasi Melek Politik (GMP) lahir dari keresahan pendiri, Neildeva Despendya, terhadap politik di Indonesia yang terasa seperti sirkus, dimana lebih dihargai sensasi daripada substansi. Yang lebih buruk lagi, percakapan politik terasa terkunci di balik gerbang—gerbang yang dibangun dengan jargon, elitisme, dan kompleksitas. Seakan politik bukan untuk rakyat.',
      imageSrc: '/images/bg/atamerica.jpeg',
    },
    {
      year: '2017-2018',
      description: 'GMP mulai dipertemukan dengan orang-orang yang satu visi dan misi untuk membuat politik lebih menyenangkan. Terbentuk anggota melalui indorelawan.org. Perjalanan di mulai dengan mengadakan diskusi publik dengan bermodal kolaborasi dan uang kas, serta pembuatan konten edukasi di media sosial.',
      imageSrc: '/images/bg/qlue.jpeg',
    },
    {
      year: '2018',
      description: 'Sadar akan pentingnya legalitas organisasi, GMP melegalkan diri menjadi Yayasan Partisipasi Muda (YPM). Saat ini kami terdaftar di Kemenkumham RI dengan nomor: 5018071931100892.',
      imageSrc: '/images/bg/kemkumham.jpeg',
    },
    {
      year: '2018-2019',
      description: 'YPM mulai meluncurkan program Academia Politica untuk membekali anak muda dengan pemahaman kebijakan publik dan keterampilan lunak demokrasi yang penting. YPM ikut serta meramaikan pesta demokrasi Pemilihan Umum 2019 dengan berpartisipasi pada sesi diskusi Festival Relawan dari Indorelawan, ditonton oleh ribuan pengunjung.',
      imageSrc: '/images/bg/acpolui.jpeg',
    },
    {
      year: '2020-2021',
      description: 'Dipercaya mengelola dana hibah perdana dari lembaga donor untuk meluncurkan program Temu Kandidat, digital town hall meeting pertama di Indonesia. Program ini bertujuan menyediakan ruang inklusif untuk menjembatani orang muda dengan kandidat kepala daerah di 4 kota/kabupaten/provinsi rawan krisis iklim.',
      imageSrc: '/images/bg/temukandidat.jpeg',
    },
    {
      year: '2022-2024',
      description: 'Kepercayaan lembaga donor meningkat, sehingga program andalan Academia Politica kembali hadir dengan fokus kebijakan publik di isu krisis iklim. Program tersebar di 5 provinsi Indonesia.',
      imageSrc: '/images/bg/2024.jpeg',
    },
    {
      year: '2025-sekarang',
      description: 'YPM melanjutkan program Academia Politica yang berfokus pada isu krisis iklim dengan cakupan yang lebih luas, khususnya di bagian timur Indonesia. Pada periode ini, YPM juga meluncurkan riset komprehensif pertama tentang pemahaman orang muda terhadap ruang sipil publik dengan responden seluruh Indonesia.',
      imageSrc: '/images/bg/DSC00229.jpg',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative py-32 text-center bg-[#f06d98] text-white"
      >
        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-black opacity-50"></div> */}
        {/* Content */}
        <div className="relative container mx-auto px-4 max-w-7xl z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 !text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Perjalanan Kami</h1>
          <p className="text-lg md:text-xl !text-white max-w-2xl mx-auto">
          Berawal dari komunitas relawan, kami tumbuh menjadi organisasi nirlaba yang dinamis dan berdampak. Dipimpin oleh anak muda, untuk memberdayakan sesama anak muda.

          </p>
        </div>
      </section>

      {/* Two-column layout: left for timeline, right for text */}
      <div className="container mx-auto px-4 max-w-7xl py-16 flex flex-col md:flex-row gap-12 min-h-screen">
        {/* Left: Full Height Timeline */}
        <div className="md:w-1/2 w-full pr-2">
          <div className="relative">
            {/* Vertical line with accent */}
            <div className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-pink-400 via-pink-600 to-pink-400 h-full -translate-x-1/2 z-0" />
            <div className="flex flex-col gap-24 relative z-10">
              {timelineData.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-center relative group animate-fadeInUp"
                >
                  {/* Timeline Dot removed */}
                  {/* Single Card with Image and Description - Pink background with darker pink hover */}
                  <div className="bg-[#f06d98] hover:bg-[#d63384] rounded-2xl p-0 shadow-xl border border-pink-200 hover:border-pink-400 w-full max-w-2xl transition-all duration-300 ease-in-out">
                    <Image
                      src={item.imageSrc}
                      alt={`Perjalanan ${item.year}`}
                      width={640}
                      height={320}
                      className="rounded-t-2xl object-cover w-full h-56 md:h-72 border-b border-pink-200 group-hover:border-pink-400"
                    />
                    <div className="p-8">
                      <h3 className="font-extrabold text-2xl mb-3 !text-white tracking-tight drop-shadow-sm transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>{item.year}</h3>
                      <p className="text-lg !text-white leading-relaxed font-medium transition-colors duration-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right: Section Title and Description (sticky on desktop) */}
        <div className="md:w-1/2 w-full md:sticky md:top-24 md:self-start h-fit flex flex-col justify-start space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Semua bermula dari sebuah pertanyaan:</h2>
          <p className="text-xl italic font-medium text-pink-500">
            Bagaimana jika politik bisa terasa lebih manusiawi?
          </p>
          
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Bermula dari rasa frustrasi dan harapan, Yayasan Partisipasi Muda dimulai sebagai sebuah mimpi kecil pada tahun 2017—untuk membuka pintu politik dan perumusan kebijakan bagi anak muda Indonesia yang merasa terpinggirkan dari percakapan ini.
            </p>
            
            <p className="text-lg text-gray-700">
              Kami memulai tanpa pengikut, tanpa kantor, dan tanpa peta jalan—hanya beberapa orang dengan semangat dan keyakinan bersama bahwa anak muda pantas mendapatkan tempat di meja perundingan. Terinspirasi oleh pemimpin muda dunia dan didorong oleh kreativitas dan semangat keterlibatan sipil, kami bertekad untuk membuat demokrasi lebih mudah diakses, lebih relevan, dan inklusif.
            </p>
            
            <p className="text-lg text-gray-700">
              Dari pertemuan di kafe hingga ruang kelas, dari kampanye digital hingga lokakarya kebijakan, misi kami selalu sama: memberdayakan anak muda Indonesia untuk berpartisipasi dalam membentuk masa depan komunitas mereka dan negara mereka.
            </p>
            
            <p className="text-lg font-bold text-gray-800">
              Kami sudah menempuh perjalanan panjang—tapi perjalanan kami baru saja dimulai.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerjalananPage; 