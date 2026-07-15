'use client';
import { useEffect, useState } from 'react';
import Chatbot from '@/components/Chatbot';
import { GraduationCap, Briefcase, Code, Cpu, Server, Mail } from 'lucide-react';

interface Layanan { id: number; title: string; desc: string; icon: string; }
interface Pendidikan { id: number; tahun: string; sekolah: string; jurusan: string; }
interface ProfilContent {
  namaLengkap: string; headline: string; tentang: string; email: string;
  heroImage: string; aboutImage: string; github: string; linkedin: string; instagram: string;
  layanan: Layanan[]; pendidikan: Pendidikan[];
}

// URL Gambar Default/Placeholder yang aman
const DEFAULT_HERO_IMG = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80';
const DEFAULT_ABOUT_IMG = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80';

export default function Home() {
  const [content, setContent] = useState<ProfilContent>({
    namaLengkap: 'Belum diatur', headline: 'Belum diatur', tentang: 'Belum ada data.', email: '-',
    heroImage: '', aboutImage: '', github: '', linkedin: '', instagram: '',
    layanan: [], pendidikan: []
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setContent({
            namaLengkap: data.nama_lengkap || 'Belum diatur',
            headline: data.headline || 'Belum diatur',
            tentang: data.tentang || 'Belum ada data profil.',
            email: data.email || '-',
            heroImage: data.hero_image || '', 
            aboutImage: data.about_image || '',
            github: data.github_link || '#',
            linkedin: data.linkedin_link || '#',
            instagram: data.instagram_link || '#',
            layanan: data.layanan || [],
            pendidikan: data.pendidikan || []
          });
        }
      } catch (error) { console.log('Menunggu data dari backend...'); }
    };
    fetchContent();
  }, []);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code': return <Code className="text-blue-600 mb-4" size={32} />;
      case 'Cpu': return <Cpu className="text-blue-600 mb-4" size={32} />;
      case 'Server': return <Server className="text-blue-600 mb-4" size={32} />;
      default: return <Briefcase className="text-blue-600 mb-4" size={32} />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-br from-blue-800 to-slate-900 text-white min-h-[80vh] flex items-center px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-left animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
              {content.namaLengkap}
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-8 font-light">
              {content.headline}
            </p>
            <div className="flex gap-4 mb-8">
              {content.github !== '#' && content.github !== '' && (
                <a href={content.github} target="_blank" rel="noreferrer" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
              )}
              {content.linkedin !== '#' && content.linkedin !== '' && (
                <a href={content.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              )}
              {content.instagram !== '#' && content.instagram !== '' && (
                <a href={content.instagram} target="_blank" rel="noreferrer" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
            </div>
            <a href="#about" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-500 transition shadow-lg transform hover:-translate-y-1">
              Kenali Saya Lebih Lanjut
            </a>
          </div>
          <div className="hidden md:block">
            {/* PERBAIKAN: Memastikan string tidak pernah kosong dengan URL default */}
            <img 
              src={content.heroImage || DEFAULT_HERO_IMG} 
              alt="Hero" 
              className="w-full h-[500px] object-cover rounded-3xl shadow-2xl border-4 border-white/10 transform rotate-3 hover:rotate-0 transition duration-500" 
            />
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            {/* PERBAIKAN: Memastikan string tidak pernah kosong dengan URL default */}
            <img 
              src={content.aboutImage || DEFAULT_ABOUT_IMG} 
              alt="About" 
              className="w-full rounded-3xl shadow-xl" 
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Tentang Saya</h2>
            <div className="w-20 h-1 bg-blue-600 mb-6"></div>
            <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
              {content.tentang}
            </p>
          </div>
        </div>
      </section>

      {/* 3. LAYANAN & PENDIDIKAN */}
      <section className="bg-gray-100 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Spesialisasi & Layanan</h2>
          {content.layanan.length === 0 ? (
            <p className="text-center text-gray-500 italic">Belum ada layanan.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.layanan.map((lay) => (
                <div key={lay.id} className="bg-white p-8 rounded-2xl hover:shadow-xl transition transform hover:-translate-y-2">
                  {renderIcon(lay.icon)}
                  <h3 className="font-bold text-2xl mb-3">{lay.title}</h3>
                  <p className="text-gray-500">{lay.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. KONTAK */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">Mari Bekerja Sama</h2>
        <p className="text-gray-600 mb-10 text-xl">Punya ide proyek atau pertanyaan seputar teknologi? Jangan ragu untuk menghubungi saya.</p>
        <a href={`mailto:${content.email}`} className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-800 shadow-xl transition transform hover:scale-105">
          <Mail size={24} /> Hubungi via Email
        </a>
      </section>

      <Chatbot />
    </main>
  );
}