'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Chatbot from '@/components/Chatbot';
import { ExternalLink, Database, Cpu, Brain, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/portfolio').then(res => res.json()).then(setData);
  }, []);

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#050510] transition-colors duration-500">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_#22d3ee]"></div>
      <p className="text-cyan-600 dark:text-cyan-400 font-medium animate-pulse tracking-widest">INITIALIZING...</p>
    </div>
  );

  const profil = data.profil || {};
  const services = data.services || [];

  const fullName = profil.nama_lengkap || 'Kak Riley';
  const nameArray = fullName.trim().split(' ');
  let firstName = fullName;
  let lastName = '';

  if (nameArray.length > 1) {
      lastName = nameArray.pop() || '';
      firstName = nameArray.join(' ');
  }

  // 🔥 FIX TYPESCRIPT: Tambahkan ": any" agar tidak error
  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main className="min-h-screen bg-transparent text-slate-800 dark:text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-700 dark:selection:text-cyan-200 overflow-hidden relative transition-colors duration-500">
      
      <Navbar />

      {/* 🔥 FIX: Efek Neon HANYA muncul di Dark Mode (hidden dark:block) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden dark:block transition-opacity duration-500">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 pt-20">
        
        {/* === 1. HERO SECTION === */}
        <section className="px-6 max-w-5xl mx-auto py-24 md:py-32 flex flex-col gap-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <p className="text-cyan-600 dark:text-cyan-400 font-bold tracking-[0.2em] uppercase text-sm mb-2">HELLO, I AM</p>
            <h1 className="text-5xl md:text-8xl font-black leading-tight md:leading-none tracking-tight text-slate-900 dark:text-white transition-colors duration-500">
              {firstName} <br/>
              {lastName && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  {lastName}
                </span>
              )}
            </h1>
            <h2 className="text-xl md:text-3xl font-medium mt-4">
              <span className="text-slate-800 dark:text-white transition-colors duration-500">I am a </span> 
              <span className="text-slate-500 dark:text-slate-400 transition-colors duration-500">{profil.headline || 'Web Developer'}</span>
            </h2>
            <p className="max-w-2xl text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed mt-6 transition-colors duration-500">
              {profil.tentang || 'Selamat datang di portofolio saya.'}
            </p>
          </motion.div>
        </section>

        {/* === 2. STATS SECTION === */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="border-y border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] py-16 transition-colors duration-500"
        >
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/10">
            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <h3 className="text-5xl md:text-6xl font-black text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] mb-2">2+</h3>
              <p className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs md:text-sm font-semibold transition-colors duration-500">Years Experience</p>
            </div>
            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <h3 className="text-5xl md:text-6xl font-black text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] mb-2">10+</h3>
              <p className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs md:text-sm font-semibold transition-colors duration-500">Completed Projects</p>
            </div>
            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <h3 className="text-5xl md:text-6xl font-black text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] mb-2">5+</h3>
              <p className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs md:text-sm font-semibold transition-colors duration-500">Certificates Won</p>
            </div>
          </div>
        </motion.section>

        {/* === 3. FEATURED PROJECTS === */}
        <section className="py-24 max-w-6xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-cyan-600 dark:text-cyan-400 font-bold tracking-[0.2em] uppercase text-xs mb-2">MY WORKS</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-10 transition-colors duration-500">
              Featured <span className="text-cyan-500">Projects</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.karya?.slice(0, 3).map((item: any, index: number) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white dark:bg-[#0c0c1d] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden group hover:border-cyan-500/50 transition-all shadow-lg hover:shadow-xl dark:shadow-2xl"
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/40 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img src={item.image_url || 'https://via.placeholder.com/600x400'} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-[#050510]/80 backdrop-blur-md text-cyan-700 dark:text-cyan-400 text-xs font-bold px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-900/50 shadow-sm">
                    {item.kategori}
                  </div>
                </div>
                <div className="p-6 text-left">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{item.judul}</h3>
                  <p className="text-slate-600 dark:text-slate-500 text-sm line-clamp-3 mb-6 transition-colors duration-500">{item.deskripsi}</p>
                  {item.link_project && (
                    <a href={item.link_project} target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 text-sm font-semibold flex items-center gap-2 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">
                      Lihat Proyek <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* === 4. MY SERVICES === */}
        <section className="py-24 max-w-6xl mx-auto px-6 text-center border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-cyan-600 dark:text-cyan-400 font-bold tracking-[0.2em] uppercase text-xs mb-2">WHAT I DO</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-16 transition-colors duration-500">
              My <span className="text-cyan-500">Services</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.length > 0 ? (
              services.map((service: any, index: number) => {
                let ServiceIcon = Database;
                if (index % 3 === 1) ServiceIcon = Cpu;
                if (index % 3 === 2) ServiceIcon = Brain;

                return (
                  <motion.div 
                    key={service.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                    className="bg-white dark:bg-[#0c0c1d] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all duration-300 group shadow-lg hover:shadow-cyan-500/20 text-center"
                  >
                    <ServiceIcon className="w-12 h-12 text-cyan-600 dark:text-cyan-400 mx-auto mb-6 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_#22d3ee] transition-all duration-300" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-500">{service.nama_layanan}</h3>
                    <p className="text-slate-600 dark:text-slate-500 text-sm leading-relaxed transition-colors duration-500">{service.deskripsi}</p>
                  </motion.div>
                );
              })
            ) : (
              <p className="col-span-3 text-slate-500">Belum ada layanan yang ditambahkan dari Admin.</p>
            )}
          </div>
        </section>

        {/* === 5. LET'S CONNECT === */}
        <section className="py-24 max-w-3xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white dark:bg-[#0a0a1a] border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 md:p-12 shadow-2xl dark:shadow-cyan-900/10 relative overflow-hidden text-center transition-colors duration-500"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 transition-colors duration-500">Let's Connect</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-10 transition-colors duration-500">Punya ide proyek atau sekadar ingin menyapa? Jangan ragu untuk menghubungi saya!</p>

            <a href="/contact" className="inline-flex w-full sm:w-auto px-10 bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-500 dark:to-purple-600 hover:opacity-90 text-white font-bold py-4 rounded-xl items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/30 hover:scale-105">
              <Send size={18} /> HUBUNGI SAYA SEKARANG
            </a>
          </motion.div>
        </section>

      </div>
      
      <Chatbot />
    </main>
  );
}