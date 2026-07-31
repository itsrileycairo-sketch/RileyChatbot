'use client';

import { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import CyberpunkLoading from "@/components/CyberpunkLoading";

export default function Achievements() {
  const [achList, setAchList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    // 🔥 PERBAIKAN: Tarik data langsung dari tabel achievements secara dinamis & anti-cache!
    fetch('/api/admin-data?table=achievements', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setAchList(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Gagal load achievements:", err);
        setIsLoading(false);
      }); 
  }, []);

  if (isLoading) return <CyberpunkLoading text="Decrypting Credentials..." />;

  return (
    <main className="max-w-5xl mx-auto px-6 py-24 min-h-screen relative z-10">
      <div className="text-center mb-16 animate-fade-in-up">
        <p className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold tracking-[0.2em] uppercase text-xs mb-2">
          <span className="w-8 h-0.5 bg-cyan-600 dark:bg-cyan-400 rounded-full"></span> CREDENTIALS <span className="w-8 h-0.5 bg-cyan-600 dark:bg-cyan-400 rounded-full"></span>
        </p>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white transition-colors">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">Achievements</span>
        </h1>
      </div>

      <div className="space-y-8">
        {achList.length === 0 ? (
          <p className="text-center text-slate-500">Data pencapaian belum ditambahkan dari Admin.</p>
        ) : (
          achList.map((ach: any, index: number) => (
            <div 
              key={ach.id} 
              style={{ animationDelay: `${index * 150}ms` }} 
              className="bg-white/50 dark:bg-[#0c0c1d]/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center hover:border-cyan-500/50 transition-all duration-500 group shadow-lg dark:shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:-translate-y-1 animate-fade-in-up"
            >
              <div className="w-full md:w-1/4">
                <div className="aspect-video rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-cyan-600 dark:text-cyan-900 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors group-hover:scale-105 duration-500">
                  <Award size={48} className="drop-shadow-lg group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                </div>
              </div>
              <div className="w-full md:w-3/4">
                <span className="inline-block px-4 py-1.5 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 font-bold text-xs rounded-full border border-cyan-200 dark:border-cyan-900/50 mb-3 transition-colors shadow-sm">
                  {ach.tahun || '2024'}
                </span>
                {/* Sesuai dengan kolom database: ach.judul dan ach.deskripsi */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors group-hover:text-cyan-500">
                  {ach.judul}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm transition-colors font-light">
                  {ach.deskripsi}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}