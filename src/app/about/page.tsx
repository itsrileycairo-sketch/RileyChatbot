'use client';
import { useEffect, useState } from 'react';
import Chatbot from '@/components/Chatbot';
import { GraduationCap } from 'lucide-react';

export default function About() {
  const [content, setContent] = useState<any>({ tentang: 'Memuat...', aboutImage: '' });

  useEffect(() => {
    const fetchContent = async () => {
      const res = await fetch('/api/profile');
      if (res.ok) setContent(await res.json());
    };
    fetchContent();
  }, []);

  return (
    <main className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-16 text-center text-gray-900">Tentang Saya</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <img 
              src={content.about_image || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80'} 
              alt="About" 
              className="w-full h-[600px] object-cover rounded-3xl shadow-xl" 
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Profil Mahasiswa</h2>
            <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap mb-10">
              {content.tentang}
            </p>
            
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-blue-800">
                <GraduationCap size={24} /> Latar Belakang
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>🎓 S1 Teknik Komputer, Universitas Teknologi Digital Indonesia</li>
                <li>🏅 Penerima Beasiswa KIP Kuliah (KIPK)</li>
                <li>💻 Fokus pada Full Stack (Next.js, Laravel) & IoT Integrations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </main>
  );
}