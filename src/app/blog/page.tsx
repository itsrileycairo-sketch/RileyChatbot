'use client';

import { useEffect, useState } from 'react';
import CyberpunkLoading from '@/components/CyberpunkLoading';

export default function Blog() {
  const [data, setData] = useState<any>(null);

  useEffect(() => { fetch('/api/portfolio').then(res => res.json()).then(setData); }, []);

  if (!data) return <CyberpunkLoading text="Decrypting Articles..." />;

  const blogsList = data.blogs || [];

  return (
    <main className="min-h-screen relative z-10 text-slate-800 dark:text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-700 dark:selection:text-cyan-200 transition-colors">
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold tracking-[0.2em] uppercase text-xs mb-2">
            <span className="w-8 h-0.5 bg-cyan-600 dark:bg-cyan-400 rounded-full"></span> INSIGHTS <span className="w-8 h-0.5 bg-cyan-600 dark:bg-cyan-400 rounded-full"></span>
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white transition-colors">
            Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">Blog</span>
          </h1>
        </div>

        {blogsList.length > 0 ? (
          <div className="space-y-8">
            {blogsList.map((blog: any, index: number) => (
              <article 
                key={blog.id} 
                style={{ animationDelay: `${index * 150}ms` }}
                className="bg-white/60 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-white/50 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all duration-500 shadow-xl hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] hover:-translate-y-1 animate-fade-in-up group"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-500 transition-all cursor-pointer">
                  {blog.judul}
                </h2>
                
                <p className="inline-block px-3 py-1 bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-100 dark:border-cyan-800/50 rounded-full text-[10px] sm:text-xs text-cyan-700 dark:text-cyan-400 mb-6 font-mono tracking-wider transition-colors">
                  {new Date(blog.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap transition-colors font-light text-sm md:text-base">
                  {blog.konten_lengkap}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/40 dark:bg-[#0c0c1d]/60 backdrop-blur-md border border-white/50 dark:border-slate-800 rounded-3xl transition-colors">
            <p className="text-slate-500 font-light">Belum ada artikel yang dipublikasikan.</p>
          </div>
        )}
      </div>
    </main>
  );
}