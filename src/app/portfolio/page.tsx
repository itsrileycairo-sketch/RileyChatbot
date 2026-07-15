'use client';
import { useEffect, useState } from 'react';
import Chatbot from '@/components/Chatbot';
import { ExternalLink } from 'lucide-react';

interface Karya {
  id: number; judul: string; kategori: string; deskripsi: string; image_url: string; link_project: string;
}

export default function Portfolio() {
  const [karyaList, setKaryaList] = useState<Karya[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKarya = async () => {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) setKaryaList(await res.json());
      } catch (error) {
        console.error("Gagal load karya");
      } finally {
        setIsLoading(false);
      }
    };
    fetchKarya();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Karya & Proyek</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Kumpulan studi kasus, pengembangan web *full stack*, hingga inovasi arsitektur IoT yang pernah saya bangun.</p>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 animate-pulse">Memuat data karya dari database...</p>
        ) : karyaList.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">Belum ada karya yang diunggah. Silakan tambahkan melalui Panel Admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {karyaList.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100 flex flex-col group">
                <div className="relative overflow-hidden h-60">
                  <img src={item.image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'} alt={item.judul} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {item.kategori}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-bold text-2xl text-gray-900 mb-3 group-hover:text-blue-600 transition">{item.judul}</h3>
                  <p className="text-gray-600 mb-6 flex-1">{item.deskripsi}</p>
                  {item.link_project && item.link_project !== '#' && (
                    <a href={item.link_project} target="_blank" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition">
                      Lihat Proyek <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Chatbot />
    </main>
  );
}