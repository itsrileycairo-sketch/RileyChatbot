'use client';

import GithubStats from "@/components/GithubStats";
import { useState, useEffect } from 'react';
import Link from "next/link";
import { ArrowRight, Mail, Code, Layout, Smartphone, Database, Zap, Globe } from "lucide-react";
import InteractiveBackground from "@/components/InteractiveBackground";
import VisitorTracker from "@/components/VisitorTracker";
import HackerTerminal from "@/components/HackerTerminal";
import GithubGlobe from "@/components/GithubGlobe";
import CyberpunkLoading from "@/components/CyberpunkLoading";
import MagneticElement from "@/components/MagneticElement";
import TechMarquee from "@/components/TechMarquee";
import ScrollReveal from "@/components/ScrollReveal";
import TypewriterEffect from "@/components/TypewriterEffect";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [secretKey, setSecretKey] = useState('');
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔥 FIX PROFIL: Balik ke /api/profile tapi pakai Anti-Cache Tingkat Dewa!
        const resProfile = await fetch('/api/profile', { 
          cache: 'no-store',
          headers: {
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
        if (resProfile.ok) {
          const pData = await resProfile.json();
          // Hapus index [0] karena format aslinya langsung object
          setProfile(pData); 
        }
        
        // Ambil data Services (Ini udah bener dari awal)
        const resServices = await fetch('/api/admin-data?table=services', { cache: 'no-store' });
        if (resServices.ok) {
          const sData = await resServices.json();
          setServicesData(sData);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sensor Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setSecretKey((prev) => (prev + e.key.toLowerCase()).slice(-4));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (secretKey === 'hack') {
      setShowTerminal(true);
      setSecretKey(''); 
    }
  }, [secretKey]);

  // Sensor Triple Tap HP
  useEffect(() => {
    if (tapCount >= 3) {
      setShowTerminal(true);
      setTapCount(0);
    }
    const timer = setTimeout(() => setTapCount(0), 1000);
    return () => clearTimeout(timer);
  }, [tapCount]);

  if (isLoading) {
    return <CyberpunkLoading text="Initializing System Core..." />;
  }

  // Tarik data profil, kalau kosong baru pakai fallback Nolan
  const namaDepan = profile?.nama_lengkap ? profile.nama_lengkap.split(' ')[0] : "Nolan";
  const namaPenuh = profile?.nama_lengkap || "Nolan Fortino Ramadhany";

  const roles = profile?.headline
    ? profile.headline.split(',').map((role: string) => role.trim()).filter(Boolean)
    : ["Full-Stack Web Developer", "AI Prompt Engineer", "UI/UX Enthusiast"];

  const tentang = profile?.tentang || "Saya seorang pengembang web yang fokus menciptakan aplikasi modern, interaktif, dan performa tinggi.";
  const heroImage = profile?.hero_image || null;
  const aboutImage = profile?.about_image || null;
  const github = profile?.github_link || "#";
  const linkedin = profile?.linkedin_link || "#";
  const instagram = profile?.instagram_link || "#";

  // Desain visual services
  const serviceStyles = [
    { icon: Layout, gradient: "from-cyan-400/20 to-blue-400/20" },
    { icon: Database, gradient: "from-purple-400/20 to-pink-400/20" },
    { icon: Smartphone, gradient: "from-emerald-400/20 to-cyan-400/20" },
    { icon: Code, gradient: "from-orange-400/20 to-rose-400/20" },
    { icon: Zap, gradient: "from-yellow-400/20 to-orange-400/20" },
    { icon: Globe, gradient: "from-blue-400/20 to-indigo-400/20" }
  ];

  return (
    <div className="min-h-screen font-sans bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-700 overflow-x-hidden selection:bg-cyan-500/40 selection:text-white">
      <VisitorTracker />
      <InteractiveBackground />
      {showTerminal && <HackerTerminal onClose={() => setShowTerminal(false)} />}

      <main className="relative z-10 w-full overflow-x-hidden flex flex-col">

        <section className="relative w-full pt-24 sm:pt-32 md:pt-40 lg:pt-44 pb-12 sm:pb-16 md:pb-24 lg:pb-28 flex items-center justify-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] bg-gradient-to-b from-cyan-400/15 via-purple-400/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-7xl">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-8 xl:gap-12 items-center w-full">

              <ScrollReveal direction="up" delay={0.1}>
                <div className="w-full p-6 sm:p-8 md:p-10 lg:p-10 xl:p-12 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl border border-white/40 dark:border-white/[0.08] shadow-[0_8px_40px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.2)_inset] dark:shadow-[0_8px_40px_-15px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)_inset] text-center lg:text-left flex flex-col items-center lg:items-start w-full overflow-hidden transition-all duration-500 hover:shadow-[0_16px_60px_-20px_rgba(6,182,212,0.2),0_0_0_1px_rgba(255,255,255,0.25)_inset] dark:hover:shadow-[0_16px_60px_-20px_rgba(6,182,212,0.15),0_0_0_1px_rgba(255,255,255,0.08)_inset]">

                  <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-cyan-50/80 to-purple-50/80 dark:from-cyan-950/60 dark:to-purple-950/60 backdrop-blur-xl border border-cyan-300/50 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold text-xs sm:text-sm mb-6 sm:mb-8 shadow-lg shadow-cyan-500/10 dark:shadow-cyan-500/5 cursor-default w-fit max-w-full animate-[pulse_3s_ease-in-out_infinite]">
                    <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                    </span>
                    <span className="truncate tracking-wide">Tersedia untuk pekerjaan baru</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black leading-[1.08] sm:leading-[1.1] tracking-tight mb-4 text-slate-900 dark:text-white w-full break-words">
                    <span className="drop-shadow-sm">Halo, Saya</span> <br className="hidden sm:block" />
                    <span
                      className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 dark:from-cyan-300 dark:via-blue-400 dark:to-purple-400 cursor-pointer select-none inline-block mt-1 sm:mt-2 w-full break-words animate-[shimmer_3s_ease-in-out_infinite] bg-[length:200%_auto]"
                      onClick={() => setTapCount(prev => prev + 1)}
                      title="Tap 3 times for a surprise!"
                    >
                      {namaPenuh}
                    </span>
                  </h1>

                  <div className="min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] flex items-center justify-center lg:justify-start w-full mb-4 sm:mb-6 px-2">
                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-cyan-600 dark:text-cyan-300 text-center lg:text-left leading-snug tracking-tight">
                      <TypewriterEffect words={roles} />
                    </h2>
                  </div>

                  <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 mb-8 sm:mb-10 max-w-2xl leading-relaxed font-light px-2 sm:px-0 tracking-wide">
                    {tentang}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto">
                    <MagneticElement>
                      <Link href="/portfolio" className="w-full sm:w-auto group relative px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 sm:gap-3 shrink-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700">
                        <span className="relative z-10 flex items-center gap-2">
                          Lihat Karya Saya <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                        </span>
                      </Link>
                    </MagneticElement>

                    <MagneticElement>
                      <Link href="/contact" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white/50 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 text-slate-800 dark:text-white border border-slate-200/60 dark:border-white/[0.12] rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-500 hover:scale-[1.03] active:scale-95 backdrop-blur-xl flex items-center justify-center gap-2 shrink-0 shadow-md hover:shadow-xl">
                        <Mail size={18} className="text-cyan-600 dark:text-cyan-400" /> Hubungi Saya
                      </Link>
                    </MagneticElement>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.3}>
                <div className="w-full flex justify-center mt-4 sm:mt-0">
                  <div className="relative w-56 h-56 xs:w-64 xs:h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[360px] lg:h-[360px] xl:w-[400px] xl:h-[400px] shrink-0">
                    <div className="absolute -inset-6 sm:-inset-8 bg-gradient-to-tr from-cyan-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-[spin_20s_linear_infinite] opacity-60"></div>
                    <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse opacity-70"></div>
                    <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-2xl border border-white/40 dark:border-white/[0.1] rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] rotate-3 transition-all duration-700 hover:rotate-0 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.3)_inset] dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)_inset] hover:shadow-[0_30px_80px_-25px_rgba(6,182,212,0.3),0_0_0_1px_rgba(255,255,255,0.4)_inset] dark:hover:shadow-[0_30px_80px_-25px_rgba(6,182,212,0.25),0_0_0_1px_rgba(255,255,255,0.1)_inset] overflow-hidden flex items-center justify-center">
                      {heroImage ? (
                        <img src={heroImage} alt={`Foto profil ${namaDepan}`} className="w-full h-full object-cover scale-105 opacity-95 hover:scale-110 transition-all duration-700" />
                      ) : (
                        <div className="text-slate-400 dark:text-white/30 font-black text-xl sm:text-2xl md:text-3xl tracking-widest">{namaDepan}</div>
                      )}
                    </div>
                    <div className="hidden sm:block absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-white/70 dark:bg-black/50 backdrop-blur-xl p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-xl border border-white/40 dark:border-white/[0.1] animate-[float_4s_ease-in-out_infinite] z-20">
                      <Code className="text-cyan-600 dark:text-cyan-400 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                    </div>
                    <div className="hidden sm:block absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-white/70 dark:bg-black/50 backdrop-blur-xl p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-xl border border-white/40 dark:border-white/[0.1] animate-[float_5s_ease-in-out_infinite_1s] z-20">
                      <Zap className="text-pink-500 dark:text-pink-400 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

        <div className="w-full max-w-full relative z-20 border-y border-slate-200/30 dark:border-white/[0.05] bg-gradient-to-r from-slate-100/40 via-white/30 to-slate-100/40 dark:from-black/30 dark:via-slate-900/20 dark:to-black/30 backdrop-blur-xl overflow-hidden shadow-inner">
          <TechMarquee />
        </div>

        <section className="py-16 sm:py-20 lg:py-28 relative bg-transparent w-full overflow-hidden">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[40vw] h-[50vh] bg-gradient-to-l from-purple-400/8 to-transparent rounded-full blur-[100px] pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl relative z-10">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="flex flex-col md:grid md:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] bg-white/25 dark:bg-slate-900/25 backdrop-blur-2xl border border-white/35 dark:border-white/[0.07] shadow-[0_8px_40px_-15px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.2)_inset] dark:shadow-[0_8px_40px_-15px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.04)_inset] transition-all duration-500 hover:shadow-[0_16px_60px_-20px_rgba(168,85,247,0.1),0_0_0_1px_rgba(255,255,255,0.25)_inset] w-full">

                <div className="relative group w-full max-w-[260px] xs:max-w-[280px] sm:max-w-[320px] md:max-w-full mx-auto md:mx-0">
                  <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-tr from-cyan-400/25 via-purple-400/25 to-pink-400/25 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] blur-xl sm:blur-2xl opacity-50 group-hover:opacity-80 transition-all duration-700 group-hover:blur-3xl"></div>
                  <div className="relative w-full aspect-[4/5] rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-slate-200/60 dark:bg-black/40 border border-white/40 dark:border-white/[0.08] shadow-xl group-hover:shadow-2xl transition-all duration-500">
                    {aboutImage ? (
                      <img src={aboutImage} alt={`Tentang ${namaDepan}`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 mix-blend-overlay hover:mix-blend-normal" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-base sm:text-lg md:text-xl uppercase tracking-widest text-center px-4 bg-gradient-to-br from-cyan-100/50 to-purple-100/50 dark:from-cyan-900/30 dark:to-purple-900/30">About Image</div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border-2 border-dashed border-cyan-400/20 dark:border-cyan-400/10 animate-[spin_40s_linear_infinite] pointer-events-none scale-105"></div>
                </div>

                <div className="space-y-4 sm:space-y-6 w-full text-center md:text-left">
                  <div className="inline-flex items-center justify-center md:justify-start gap-2.5 text-cyan-600 dark:text-cyan-300 font-bold tracking-widest uppercase text-[10px] sm:text-xs">
                    <span className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></span> Tentang Saya
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.15] text-slate-900 dark:text-white break-words tracking-tight">
                    Mengubah Ide Menjadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 dark:from-cyan-300 dark:via-blue-400 dark:to-purple-400 block sm:inline">Kenyataan Digital.</span>
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base md:text-lg font-light break-words tracking-wide">{tentang}</p>
                  <div className="pt-4 sm:pt-6 border-t border-slate-300/50 dark:border-white/[0.08] flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
                    {github && github !== "#" && (<MagneticElement><a href={github} target="_blank" rel="noreferrer" className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/50 dark:bg-black/30 hover:bg-slate-900 hover:text-white border border-white/40 dark:border-white/[0.1] text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm transition-all duration-300 shadow-sm hover:shadow-md">GitHub</a></MagneticElement>)}
                    {linkedin && linkedin !== "#" && (<MagneticElement><a href={linkedin} target="_blank" rel="noreferrer" className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/50 dark:bg-black/30 hover:bg-blue-600 hover:text-white border border-white/40 dark:border-white/[0.1] text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm transition-all duration-300 shadow-sm hover:shadow-md">LinkedIn</a></MagneticElement>)}
                    {instagram && instagram !== "#" && (<MagneticElement><a href={instagram} target="_blank" rel="noreferrer" className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/50 dark:bg-black/30 hover:bg-pink-600 hover:text-white border border-white/40 dark:border-white/[0.1] text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm transition-all duration-300 shadow-sm hover:shadow-md">Instagram</a></MagneticElement>)}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-10 sm:py-16 relative w-full overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 w-full max-w-5xl relative z-10">
            <ScrollReveal direction="up" delay={0.2}>
              <GithubStats />
            </ScrollReveal>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-28 relative w-full overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70vw] h-[30vh] bg-gradient-to-t from-cyan-400/6 via-purple-400/4 to-transparent rounded-full blur-[100px] pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl relative z-10">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="text-center mb-10 sm:mb-16 lg:mb-20">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
                  Apa Yang <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 dark:from-cyan-300 dark:via-blue-400 dark:to-purple-400 block sm:inline">Saya Lakukan</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-light max-w-xl mx-auto mt-3">Spesialisasi dalam membangun produk digital berkualitas tinggi dari konsep hingga produksi.</p>
              </div>
            </ScrollReveal>

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8 w-full">
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
                
                {/* LOOPING DINAMIS DARI DATABASE SERVICES */}
                {servicesData.length > 0 ? (
                  servicesData.map((service, i) => {
                    const style = serviceStyles[i % serviceStyles.length];
                    const Icon = style.icon;
                    return (
                      <ScrollReveal key={service.id || i} delay={0.1 + (i * 0.1)} direction="up">
                        <div className="group p-5 sm:p-6 lg:p-7 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] bg-white/25 dark:bg-slate-900/25 backdrop-blur-2xl border border-white/35 dark:border-white/[0.07] hover:border-cyan-400/40 dark:hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,255,255,0.15)_inset] dark:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.03)_inset] hover:shadow-[0_16px_40px_-15px_rgba(6,182,212,0.15),0_0_0_1px_rgba(255,255,255,0.25)_inset] w-full h-full">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${style.gradient} dark:bg-black/40 border border-white/40 dark:border-cyan-500/15 text-cyan-600 dark:text-cyan-300 flex items-center justify-center mb-3 sm:mb-4 lg:mb-5 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-cyan-500 group-hover:to-purple-500 group-hover:text-white group-hover:border-transparent transition-all duration-400 shadow-md group-hover:shadow-lg group-hover:shadow-purple-500/30`}>
                            <Icon size={20} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" strokeWidth={1.8} />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2 tracking-tight">{service.nama_layanan}</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-light tracking-wide">{service.deskripsi}</p>
                        </div>
                      </ScrollReveal>
                    );
                  })
                ) : (
                  <div className="col-span-full p-8 text-center border-2 border-dashed border-slate-500 rounded-2xl text-slate-400">
                    Layanan belum diisi dari Admin.
                  </div>
                )}
                
              </div>

              <ScrollReveal direction="up" delay={0.5}>
                <div className="lg:col-span-1 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] bg-white/25 dark:bg-slate-900/25 backdrop-blur-2xl border border-white/35 dark:border-white/[0.07] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,255,255,0.15)_inset] dark:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.03)_inset] p-4 sm:p-6 lg:p-7 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[350px] lg:min-h-[400px] w-full max-w-full overflow-hidden h-full transition-all duration-500 hover:shadow-[0_16px_40px_-15px_rgba(6,182,212,0.12),0_0_0_1px_rgba(255,255,255,0.2)_inset]">
                  <div className="w-full flex items-center gap-2 mb-2 sm:mb-4 justify-center text-slate-700 dark:text-white">
                    <Globe size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-cyan-500" />
                    <span className="font-bold text-sm sm:text-base lg:text-lg tracking-tight">Activity Globe</span>
                  </div>
                  <div className="w-full max-w-[260px] sm:max-w-[300px] lg:max-w-full flex justify-center items-center overflow-hidden">
                    <GithubGlobe />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-28 relative overflow-hidden mt-6 sm:mt-10 w-full max-w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/70 via-blue-600/70 to-purple-600/70 dark:from-cyan-900/85 dark:via-blue-900/85 dark:to-purple-900/85 backdrop-blur-xl w-full" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03)_0%,transparent_60%)] pointer-events-none" />
          <div className="absolute top-10 left-10 w-40 h-40 sm:w-60 sm:h-60 bg-white/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 right-10 w-40 h-40 sm:w-60 sm:h-60 bg-white/5 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_2s]" />
          <ScrollReveal direction="up" delay={0.1}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 sm:mb-6 leading-[1.15] tracking-tight px-2 drop-shadow-2xl">
                Punya Ide Proyek <br className="hidden md:block" />Yang Luar Biasa?
              </h2>
              <p className="text-white/70 text-sm sm:text-base md:text-lg font-light max-w-lg mx-auto mb-2 tracking-wide">Mari wujudkan bersama menjadi produk digital yang berdampak.</p>
              <MagneticElement>
                <Link href="/contact" className="inline-flex items-center gap-2 sm:gap-3 px-7 sm:px-10 py-3.5 sm:py-4.5 bg-white text-slate-900 rounded-full font-bold text-sm sm:text-base lg:text-lg hover:scale-105 transition-all duration-500 shadow-2xl shadow-black/20 hover:shadow-black/30 active:scale-95 mt-6 sm:mt-8 tracking-tight">
                  Mulai Diskusi <ArrowRight size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </Link>
              </MagneticElement>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}