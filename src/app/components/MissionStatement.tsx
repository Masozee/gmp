import Link from 'next/link';
import PlaceholderImage from './PlaceholderImage';

const MissionStatement = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Memberdayakan Generasi Pembuat Perubahan Berikutnya
            </h2>
            <p className="text-lg mb-8 text-gray-700">
              Di Yayasan Partisipasi Muda, kami menggunakan pendekatan kreatif dan mudah diakses untuk memperkenalkan literasi politik kepada anak muda Indonesia. Program kami dirancang agar menarik, interaktif, dan relevan dengan kehidupan sehari-hari, membantu pemuda memahami bagaimana kebijakan memengaruhi masa depan mereka.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/videos" className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-md font-medium transition">
                Tonton Video
              </Link>
              <Link href="/our-work" className="border-2 border-primary text-primary hover:bg-primary hover:text-black px-6 py-3 rounded-md font-medium transition">
                Jelajahi Karya Kami
              </Link>
            </div>
          </div>
          <div className="md:col-span-4 h-full">
            <div className="relative h-full bg-secondary min-h-[400px]">
              <PlaceholderImage 
                alt="Youth activism in Indonesia" 
                className="object-cover opacity-40 absolute inset-0"
                imagePlaceholder="/images/bg/duy-pham-Cecb0_8Hx-o-unsplash.jpg"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <blockquote className="text-white text-2xl font-semibold mb-4">
                  &quot;Anda tidak harus berada di pemerintahan untuk membentuk masa depan.&quot;
                </blockquote>
                <Link href="/join" className="text-white underline font-bold text-lg hover:text-primary transition">
                  Bergabung dengan gerakan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionStatement; 