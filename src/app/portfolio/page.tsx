'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, MonitorPlay, Zap, Code2, Link as LinkIcon } from 'lucide-react';
import InteractiveBackground from "@/components/InteractiveBackground";
import CyberpunkLoading from "@/components/CyberpunkLoading";

export default function Portfolio() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const data = await res.json();
          // Ambil data dari tabel karya, filter kalau null
          const validProjects = (data.karya || []).filter((p: any) => p && p.judul);
          setProjects(validProjects);
        }
      } catch (error) {
        console.error("Gagal mengambil data portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (isLoading) {
    return <CyberpunkLoading text="Decrypting Project Files..." />;
  }

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-slate-50 dark:bg-[#050510] pt-28 md:pt-36 pb-20 px-4 sm:px-6">
      <InteractiveBackground />
      
      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* HEADER SECTION */}
        <div className="text-center mb-16 sm:mb-24 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-semibold text-sm mb-6">
            <MonitorPlay size={16} /> Featured Work
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Case <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 dark:from-cyan-400 dark:to-purple-500">Studies.</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-light">
            Bukan sekadar menulis kode, tapi memecahkan masalah bisnis nyata. Berikut adalah beberapa mahakarya digital yang pernah saya bangun.
          </p>
        </div>

        {/* LIST PROJECT SECTION */}
        {projects.length === 0 ? (
          <div className="text-center py-20 text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-white/50 dark:bg-slate-900/20 backdrop-blur-sm animate-fade-in-up">
            Belum ada karya di database. Tambahkan melalui halaman Admin!
          </div>
        ) : (
          <div className="flex flex-col gap-16 sm:gap-24 md:gap-32 w-full">
            {projects.map((project, index) => (
              <div 
                key={project.id || index} 
                className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-start w-full animate-fade-in-up`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                
                {/* BAGIAN GAMBAR PROJECT */}
                <div className="w-full lg:w-1/2 flex-shrink-0">
                  <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-2xl group">
                    <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none"></div>
                    {/* Gambar dengan Fallback kalau URL kosong */}
                    <img 
                      src={project.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"} 
                      alt={project.judul || "Project Image"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Badge Kategori */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="px-4 py-1.5 text-xs font-bold bg-white/90 dark:bg-black/80 backdrop-blur-md text-slate-900 dark:text-white rounded-full border border-slate-200 dark:border-white/10 shadow-lg">
                        {project.kategori || "Web Project"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BAGIAN DESKRIPSI PROJECT */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-6">
                    {project.judul || "Untitled Project"}
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="bg-white/60 dark:bg-cyan-950/20 p-6 rounded-2xl border border-slate-200 dark:border-cyan-900/50 shadow-sm">
                      <h3 className="text-sm font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Zap size={16} /> Deskripsi Proyek
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 font-light leading-relaxed whitespace-pre-wrap">
                        {project.deskripsi || "Tidak ada deskripsi yang tersedia untuk karya ini."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-wrap gap-4">
                      {project.link_project && project.link_project !== "#" ? (
                        <a 
                          href={project.link_project} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-2 px-6 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/25 w-full sm:w-auto justify-center"
                        >
                          <ExternalLink size={18} /> Kunjungi Proyek
                        </a>
                      ) : (
                        <span className="flex items-center gap-2 px-6 py-3.5 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-500 rounded-xl font-bold cursor-not-allowed w-full sm:w-auto justify-center">
                          <LinkIcon size={18} /> Link Tidak Tersedia
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}