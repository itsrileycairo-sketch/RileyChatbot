'use client';

import { useEffect, useState } from 'react';
import { Award } from 'lucide-react';

export default function Achievements() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/portfolio').then(res => res.json()).then(setData);
  }, []);

  if (!data) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const achList = data.experiences || []; 

  return (
    <main className="max-w-5xl mx-auto px-6 py-20 min-h-screen">
      <div className="text-center mb-16">
        <p className="text-cyan-600 dark:text-cyan-400 font-bold tracking-[0.2em] uppercase text-xs mb-2">CREDENTIALS</p>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white transition-colors">My <span className="text-cyan-500">Achievements</span></h1>
      </div>

      <div className="space-y-8">
        {achList.length === 0 ? (
          <p className="text-center text-slate-500">Data pencapaian belum ditambahkan dari Admin.</p>
        ) : (
          achList.map((ach: any) => (
            <div key={ach.id} className="bg-white dark:bg-[#0c0c1d] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center hover:border-cyan-500/50 transition-all group shadow-lg dark:shadow-xl">
              <div className="w-full md:w-1/4">
                <div className="aspect-video rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-cyan-200 dark:text-cyan-900 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                  <Award size={48} />
                </div>
              </div>
              <div className="w-full md:w-3/4">
                <span className="inline-block px-3 py-1 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 font-bold text-xs rounded-full border border-cyan-200 dark:border-cyan-900/50 mb-3 transition-colors">
                  {ach.tahun || '2024'}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">{ach.posisi || ach.judul}</h3>
                <h4 className="text-lg text-cyan-600 dark:text-cyan-500 mb-3 transition-colors">{ach.perusahaan || ach.instansi}</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm transition-colors">{ach.deskripsi}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}