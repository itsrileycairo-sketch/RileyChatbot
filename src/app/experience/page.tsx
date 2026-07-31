'use client';

import { useEffect, useState } from 'react';
import { Briefcase } from 'lucide-react';
import CyberpunkLoading from "@/components/CyberpunkLoading";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function Experience() {
  const [expList, setExpList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tarik data langsung dari tabel experiences di database
    fetch('/api/admin-data?table=experiences', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setExpList(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <CyberpunkLoading text="Loading Experience..." />;

  return (
    <div className="min-h-screen relative font-sans text-slate-800 dark:text-slate-100 bg-transparent overflow-x-hidden">
      <InteractiveBackground />
      
      <main className="max-w-5xl mx-auto px-6 py-32 min-h-screen relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold tracking-[0.2em] uppercase text-xs mb-3">
            <span className="w-8 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span> TIMELINE <span className="w-8 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white transition-colors">
            Pengalaman <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Karir</span>
          </h1>
        </div>

        <div className="space-y-8">
          {expList.length === 0 ? (
            <p className="text-center text-slate-500 bg-white/30 dark:bg-black/30 p-10 rounded-3xl backdrop-blur-md">Belum ada pengalaman karir yang ditambahkan dari Admin.</p>
          ) : (
            expList.map((exp: any, index: number) => (
              <div key={exp.id} style={{ animationDelay: `${index * 150}ms` }} className="bg-white/50 dark:bg-[#0c0c1d]/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-blue-500/50 transition-all duration-500 shadow-lg hover:-translate-y-1 animate-fade-in-up group">
                <div className="w-full md:w-1/4 pt-1">
                  <span className="inline-block px-5 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold text-sm rounded-full border border-blue-200 dark:border-blue-900/50 shadow-sm transition-transform group-hover:scale-105">
                    {exp.tahun}
                  </span>
                </div>
                <div className="w-full md:w-3/4">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">{exp.posisi}</h3>
                  <h4 className="text-lg text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2 font-medium">
                    <Briefcase size={18}/> {exp.perusahaan}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-light">{exp.deskripsi}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}