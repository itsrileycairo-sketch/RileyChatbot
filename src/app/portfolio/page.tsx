'use client';

import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

export default function Portfolio() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/portfolio').then(res => res.json()).then(setData);
  }, []);

  if (!data) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_#22d3ee]"></div>
      <p className="text-cyan-600 dark:text-cyan-400 font-medium animate-pulse tracking-widest">LOADING PORTFOLIO...</p>
    </div>
  );

  const karyaList = Array.isArray(data.karya) ? data.karya : [];

  return (
    <main className="max-w-7xl mx-auto px-6 py-20 min-h-screen relative z-10">
      <div className="text-center mb-16">
        <p className="text-cyan-600 dark:text-cyan-400 font-bold tracking-[0.2em] uppercase text-xs mb-2">MY WORKS</p>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 transition-colors">Mahakarya <span className="text-cyan-500">Digital</span></h1>
      </div>

      {karyaList.length === 0 ? (
        <p className="text-center text-slate-500">Belum ada karya yang diunggah dari Admin.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {karyaList.map((item: any) => (
            <div key={item.id} className="bg-white dark:bg-[#0c0c1d] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden group hover:border-cyan-500/50 transition-all shadow-lg dark:shadow-xl">
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/40 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img src={item.image_url || 'https://via.placeholder.com/600x400'} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-[#050510]/80 backdrop-blur-md text-cyan-700 dark:text-cyan-400 text-xs font-bold px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-900/50">
                  {item.kategori}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{item.judul}</h3>
                <p className="text-slate-600 dark:text-slate-500 text-sm line-clamp-3 mb-6 transition-colors">{item.deskripsi}</p>
                {item.link_project && (
                  <a href={item.link_project} target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 text-sm font-semibold flex items-center gap-2 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">
                    Lihat Proyek Asli <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}