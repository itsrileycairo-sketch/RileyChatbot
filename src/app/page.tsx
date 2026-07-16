'use client';
import { useEffect, useState } from 'react';
import Chatbot from '@/components/Chatbot';
import { ExternalLink, Code2, Briefcase, Mail, ChevronRight } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/portfolio').then(res => res.json()).then(setData);
  }, []);

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium animate-pulse">Menyiapkan Mahakarya...</p>
    </div>
  );

  const profil = data.profil || {};
  const namaPanggilan = profil.nama_lengkap ? profil.nama_lengkap.split(' ')[0] : 'Riley';
  const heroImgUrl = profil.hero_image || `https://ui-avatars.com/api/?name=${namaPanggilan}&size=512&background=2563EB&color=fff`;

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-200 overflow-hidden">
      
      {/* CSS Tambahan untuk Animasi Halus (Tanpa perlu install library tambahan) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}} />

      {/* 1. HERO SECTION (Desain Modern Bersih) */}
      <section id="beranda" className="relative pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 min-h-[90vh]">
        {/* Hiasan Latar Belakang Berkabut (Canggih & Elegan) */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -z-10"></div>

        <div className="flex-1 space-y-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-slate-200 text-blue-700 font-semibold px-4 py-2 rounded-full text-sm shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Available for new projects
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-slate-800">
            Membangun <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Pengalaman Digital.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
            Halo, saya <strong className="text-slate-800">{profil.nama_lengkap || 'Riley'}</strong>. 
            Seorang {profil.headline || 'Web Developer'} yang berfokus pada desain antarmuka yang bersih, fungsional, dan responsif.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <a href="#karya" className="w-full sm:w-auto bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2">
              Lihat Karya <ChevronRight size={18} />
            </a>
            <a href="#kontak" className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-sm flex items-center justify-center">
              Hubungi Saya
            </a>
          </div>
        </div>

        <div className="w-full md:w-5/12 flex justify-center animate-fade-up delay-200">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-20 blur-xl"></div>
            <img src={heroImgUrl} alt="Foto Profil" className="relative w-72 h-72 md:w-96 md:h-96 object-cover rounded-[2rem] shadow-2xl border-4 border-white transition-transform duration-500 group-hover:-translate-y-2" />
          </div>
        </div>
      </section>

      {/* 2. TENTANG & KEAHLIAN (Desain Bento Grid) */}
      <section id="tentang" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-8">
            
            {/* Kartu Tentang */}
            <div className="md:col-span-7 bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow duration-300 animate-fade-up delay-100">
              <h2 className="text-3xl font-bold mb-6 text-slate-800">Tentang Saya</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {profil.tentang || "Saya selalu antusias memadukan kreativitas dan logika kode. Membangun aplikasi yang tidak hanya berfungsi dengan baik, tetapi juga memberikan pengalaman visual yang memanjakan mata."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.services?.slice(0,4).map((srv: any) => (
                  <div key={srv.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Briefcase size={20} /></div>
                    <div>
                      <h4 className="font-bold text-slate-800">{srv.nama_layanan}</h4>
                      <p className="text-slate-500 text-sm mt-1 line-clamp-2">{srv.deskripsi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kartu Keahlian (Progress Bar Modern) */}
            <div className="md:col-span-5 bg-slate-900 text-white p-10 rounded-3xl shadow-2xl shadow-slate-900/20 animate-fade-up delay-200">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Code2 className="text-blue-400" /> Keahlian Teknis
              </h2>
              <div className="space-y-6">
                {data.skills?.slice(0,5).map((skill: any) => (
                  <div key={skill.id}>
                    <div className="flex justify-between font-semibold mb-2 text-sm">
                      <span className="text-slate-200">{skill.nama_skill}</span>
                      <span className="text-blue-400">{skill.persentase}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full relative" 
                        style={{ width: `${skill.persentase}%` }}
                      >
                        <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-sm"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PORTOFOLIO (Desain Kartu Premium) */}
      <section id="karya" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-black text-slate-800 mb-4">Mahakarya Terkini</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Seleksi proyek terbaik yang merepresentasikan kualitas dan dedikasi saya dalam pengembangan web.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.karya?.length > 0 ? data.karya.map((item: any, idx: number) => (
              <div key={item.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 animate-fade-up" style={{ animationDelay: `${(idx + 1) * 100}ms` }}>
                <div className="h-60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img src={item.image_url || 'https://via.placeholder.com/600'} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {item.kategori}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-bold text-xl text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{item.judul}</h3>
                  <p className="text-slate-500 mb-6 line-clamp-3 text-sm leading-relaxed">{item.deskripsi}</p>
                  {item.link_project && (
                    <a href={item.link_project} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition text-sm">
                      Lihat Proyek <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-20 text-slate-400 bg-white rounded-3xl border border-slate-200 border-dashed animate-fade-up">
                Belum ada proyek yang diunggah.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. FOOTER MINIMALIS */}
      <footer id="kontak" className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-800 font-black text-2xl tracking-tighter">
            <span className="text-blue-600">&lt;/&gt;</span> Riley.
          </div>
          <div className="flex gap-4">
            {profil.email && (
              <a href={`mailto:${profil.email}`} className="bg-slate-50 p-3 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Mail size={20} />
              </a>
            )}
          </div>
          <p className="text-slate-400 text-sm font-medium">© {new Date().getFullYear()} {profil.nama_lengkap || 'Riley'}. All rights reserved.</p>
        </div>
      </footer>

      {/* Chatbot Asisten */}
      <Chatbot />
    </main>
  );
}