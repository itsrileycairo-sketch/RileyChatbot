'use client';
import { useEffect, useState } from 'react';
import Chatbot from '@/components/Chatbot';
import { ChevronRight, ExternalLink, Code2, Briefcase, Mail, Camera, Link2, Globe } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/portfolio').then(res => res.json()).then(setData);
  }, []);

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-semibold animate-pulse">Menyiapkan Portofolio...</p>
    </div>
  );

  const profil = data.profil || {};
  const namaPanggilan = profil.nama_lengkap ? profil.nama_lengkap.split(' ')[0] : 'Riley';
  // Gambar otomatis jika belum ada gambar dari database
  const heroImgUrl = profil.hero_image || `https://ui-avatars.com/api/?name=${namaPanggilan}&size=512&background=2563EB&color=fff`;

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-200">
      {/* 
        Catatan: Navbar TIDAK DIPANGGIL di sini lagi karena biasanya 
        sudah dipanggil di src/app/layout.tsx agar tidak double!
      */}

      {/* 1. HERO SECTION */}
      <section id="beranda" className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 md:gap-20 min-h-screen">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="inline-block bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-full text-sm mb-2 border border-blue-100">
            👋 Selamat datang di portofolio saya
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
            Membangun Web <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Masa Depan.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
            Halo! Saya <strong className="text-gray-900">{profil.nama_lengkap || 'Riley'}</strong>. 
            Seorang {profil.headline || 'Web Developer'} yang berdedikasi menciptakan pengalaman digital yang cepat, responsif, dan elegan.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <a href="#karya" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2">
              Lihat Karya Saya <ChevronRight size={20} />
            </a>
            <a href="#kontak" className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-full font-bold transition flex items-center justify-center">
              Hubungi Saya
            </a>
          </div>
        </div>
        <div className="w-full md:w-5/12 flex justify-center">
          <div className="relative w-64 h-64 md:w-96 md:h-96">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-[2rem] md:rounded-[3rem] rotate-6 opacity-20 blur-2xl"></div>
            <img src={heroImgUrl} alt="Foto Profil" className="relative w-full h-full object-cover rounded-[2rem] md:rounded-[3rem] shadow-2xl border-4 border-white" />
          </div>
        </div>
      </section>

      {/* 2. TENTANG & PENGALAMAN (TIMELINE) */}
      <section id="tentang" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-black mb-6">Tentang Saya</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {profil.tentang || "Saya adalah seorang developer yang bersemangat memecahkan masalah melalui kode. Saya suka belajar teknologi baru dan membangun aplikasi yang bermanfaat."}
            </p>
            
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Code2 className="text-blue-600"/> Layanan Utama</h3>
            <div className="space-y-4">
              {data.services?.map((srv: any) => (
                <div key={srv.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition">
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><Briefcase size={24} /></div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{srv.nama_layanan}</h4>
                    <p className="text-gray-500 text-sm mt-1">{srv.deskripsi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-black mb-8">Perjalanan Karir</h2>
            <div className="space-y-8 border-l-2 border-blue-100 pl-6 ml-3">
              {data.experiences?.length > 0 ? data.experiences.map((exp: any) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-[35px] top-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow"></div>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{exp.tahun}</span>
                  <h4 className="font-bold text-xl mt-3 text-gray-900">{exp.posisi}</h4>
                  <p className="text-gray-900 font-semibold mb-2">{exp.perusahaan}</p>
                  <p className="text-gray-600">{exp.deskripsi}</p>
                </div>
              )) : (
                <p className="text-gray-500 italic">Belum ada data pengalaman kerja.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. KEAHLIAN (PROGRESS BARS) */}
      <section id="keahlian" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-4">Senjata Andalan</h2>
          <p className="text-gray-500 text-lg mb-12">Teknologi yang saya gunakan sehari-hari untuk mewujudkan ide menjadi nyata.</p>
          
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            {data.skills?.map((skill: any) => (
              <div key={skill.id} className="text-left">
                <div className="flex justify-between font-bold mb-2">
                  <span className="text-gray-800">{skill.nama_skill}</span>
                  <span className="text-blue-600">{skill.persentase}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${skill.persentase}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PORTOFOLIO / KARYA (GRID KARTU) */}
      <section id="karya" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-black mb-4">Mahakarya Terkini</h2>
              <p className="text-slate-400 text-lg max-w-xl">Beberapa proyek pilihan yang pernah saya kerjakan. Dari aplikasi web hingga sistem kompleks.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.karya?.length > 0 ? data.karya.map((item: any) => (
              <div key={item.id} className="group bg-slate-800 rounded-3xl overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                <div className="h-56 overflow-hidden relative">
                  <img src={item.image_url || 'https://via.placeholder.com/600'} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                    {item.kategori}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-bold text-2xl mb-3">{item.judul}</h3>
                  <p className="text-slate-400 mb-6 line-clamp-3">{item.deskripsi}</p>
                  {item.link_project && (
                    <a href={item.link_project} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition">
                      Kunjungi Proyek <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-20 text-slate-500 bg-slate-800/50 rounded-3xl border border-slate-700/50 border-dashed">
                Belum ada karya yang diunggah.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. FOOTER & KONTAK */}
      <footer id="kontak" className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
          <h2 className="text-3xl font-black mb-8">Mari Bekerja Sama!</h2>
          <div className="flex gap-4 mb-12">
          {profil.email && (
              <a href={`mailto:${profil.email}`} className="bg-white p-4 rounded-full shadow-sm text-gray-600 hover:text-blue-600 hover:shadow-md transition">
                <Mail size={24} />
              </a>
            )}
            {profil.github_link && (
              <a href={profil.github_link} target="_blank" className="bg-white p-4 rounded-full shadow-sm text-gray-600 hover:text-blue-600 hover:shadow-md transition">
                <Code2 size={24} /> {/* Diganti ikon Kode */}
              </a>
            )}
            {profil.linkedin_link && (
              <a href={profil.linkedin_link} target="_blank" className="bg-white p-4 rounded-full shadow-sm text-gray-600 hover:text-blue-600 hover:shadow-md transition">
                <Briefcase size={24} /> {/* Diganti ikon Tas Kerja */}
              </a>
            )}
            {profil.instagram_link && (
              <a href={profil.instagram_link} target="_blank" className="bg-white p-4 rounded-full shadow-sm text-gray-600 hover:text-blue-600 hover:shadow-md transition">
                <Camera size={24} /> {/* Diganti ikon Kamera */}
              </a>
            )}
          </div>
          <p className="text-gray-500 font-medium">© {new Date().getFullYear()} {profil.nama_lengkap || 'Riley'}. All rights reserved.</p>
        </div>
      </footer>

      {/* Chatbot tetap muncul melayang di pojok */}
      <Chatbot />
    </main>
  );
}