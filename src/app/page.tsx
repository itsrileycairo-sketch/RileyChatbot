import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Github, Linkedin, Mail, Instagram, ExternalLink,
  Code, Layout, Smartphone, Globe, Terminal, Database, Shield, Zap
} from "lucide-react";
import InteractiveBackground from "@/components/InteractiveBackground";
import VisitorTracker from "@/components/VisitorTracker";

// 🔥 1. FUNGSI UNTUK MENGAMBIL DATA DARI DATABASE TiDB
async function getProfileData() {
  try {
    // Kita panggil API profile yang sudah kita buat
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/profile`, { 
      cache: 'no-store' // Jangan di-cache, ambil data terbaru terus
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Gagal mengambil data profil:", error);
    return null;
  }
}

export default async function Home() {
  // 🔥 2. AMBIL DATANYA SEBELUM HALAMAN DIRENDER
  const profile = await getProfileData();

  // 3. Siapkan data default kalau database kosong
  const namaDepan = profile?.nama_lengkap ? profile.nama_lengkap.split(' ')[0] : "Nolan";
  const namaPenuh = profile?.nama_lengkap || "Nolan";
  const headline = profile?.headline || "Web Developer";
  const tentang = profile?.tentang || "Saya seorang pengembang web yang suka membangun aplikasi modern.";
  const heroImage = profile?.hero_image || null; // Link gambar dari ImgBB
  const aboutImage = profile?.about_image || null;
  const github = profile?.github_link || "#";
  const linkedin = profile?.linkedin_link || "#";
  const instagram = profile?.instagram_link || "#";

  return (
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-[#03030a] transition-colors duration-500 overflow-hidden selection:bg-cyan-500/30">
      <VisitorTracker />
      <InteractiveBackground />

      <main className="relative z-10">
        {/* 🔥 HERO SECTION */}
        <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-100 dark:via-[#03030a]/50 dark:to-[#050510] pointer-events-none" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center max-w-6xl mx-auto">
              {/* Bagian Kiri: Teks */}
              <div className="text-center lg:text-left order-2 lg:order-1 flex flex-col items-center lg:items-start animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100/50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800/50 text-cyan-700 dark:text-cyan-400 font-medium text-sm mb-8 backdrop-blur-sm hover:scale-105 transition-transform cursor-default">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                  </span>
                  Tersedia untuk pekerjaan baru
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6">
                  Halo, Saya <br className="hidden lg:block" />
                  <span className="relative inline-block mt-2">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400">
                      {namaPenuh}
                    </span>
                    <span className="absolute -bottom-2 left-0 w-full h-3 bg-cyan-200 dark:bg-cyan-900/50 -rotate-2 rounded-full blur-sm -z-10 opacity-70"></span>
                  </span>
                </h1>

                <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed font-light">
                  Seorang <b className="text-slate-900 dark:text-white font-bold">{headline}</b> yang berfokus pada penciptaan pengalaman digital yang luar biasa, interaktif, dan mudah diakses.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <Link
                    href="/portfolio"
                    className="w-full sm:w-auto group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] active:scale-95 flex items-center justify-center gap-3"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10 flex items-center gap-2">
                      Lihat Karya Saya <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto px-8 py-4 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 backdrop-blur-sm flex items-center justify-center gap-2"
                  >
                    <Mail size={20} /> Hubungi Saya
                  </Link>
                </div>
              </div>

              {/* 🔥 Bagian Kanan: Foto Profil (Hero Image) */}
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px]">
                  {/* Efek Lingkaran Kosmik di Belakang Foto */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-[3rem] rotate-6 blur-2xl opacity-40 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-bl from-cyan-500 to-purple-600 rounded-[3rem] -rotate-6 transition-transform duration-500 hover:rotate-0 shadow-2xl overflow-hidden">
                    {/* Logika Gambar: Kalau ada di DB pakai itu, kalau kosong tampilkan warna gradasi saja */}
                    {heroImage ? (
                      <img 
                        src={heroImage} 
                        alt={`Foto profil ${namaDepan}`}
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50 font-bold text-xl">
                        {namaDepan}
                      </div>
                    )}
                  </div>
                  {/* Floating Badges */}
                  <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-[float_4s_ease-in-out_infinite]">
                    <Code className="text-cyan-500 w-8 h-8" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-[float_5s_ease-in-out_infinite_1s]">
                    <Zap className="text-purple-500 w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 ABOUT SECTION */}
        <section className="py-32 relative bg-white dark:bg-[#050510] border-t border-slate-100 dark:border-slate-800/50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Foto About */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-100 to-purple-100 dark:from-cyan-900/20 dark:to-purple-900/20 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-2xl">
                   {/* Logika Gambar: Kalau ada di DB pakai itu, kalau kosong tampilkan warna biasa */}
                   {aboutImage ? (
                      <img 
                        src={aboutImage} 
                        alt={`Tentang ${namaDepan}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                         <span className="text-slate-400 dark:text-slate-600 font-bold text-2xl">About Image</span>
                      </div>
                    )}
                </div>
              </div>

              {/* Teks About */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold tracking-wider uppercase text-sm">
                  <span className="w-8 h-0.5 bg-cyan-600 dark:bg-cyan-400 rounded-full"></span>
                  Tentang Saya
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                  Mengubah Ide Menjadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">Kenyataan Digital.</span>
                </h2>
                <div className="space-y-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {/* Teks diambil langsung dari Database! */}
                  <p>{tentang}</p>
                </div>
                
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex gap-4">
                  {[
                    { icon: Github, link: github, color: "hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900" },
                    { icon: Linkedin, link: linkedin, color: "hover:bg-blue-600 hover:text-white" },
                    { icon: Instagram, link: instagram, color: "hover:bg-pink-600 hover:text-white" }
                  ].map((social, i) => (
                    <a key={i} href={social.link} target="_blank" rel="noreferrer" className={`w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-sm hover:shadow-xl ${social.color}`}>
                      <social.icon size={24} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="py-32 relative bg-slate-50 dark:bg-[#03030a]">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                Apa Yang <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">Saya Lakukan</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Membangun solusi digital yang komprehensif dari ujung ke ujung.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Layout, title: "Frontend Dev", desc: "Membangun antarmuka yang indah, responsif, dan animasi yang mulus menggunakan React & Next.js." },
                { icon: Database, title: "Backend Dev", desc: "Merancang arsitektur server yang kokoh, API yang aman, dan manajemen database yang efisien." },
                { icon: Smartphone, title: "Mobile First", desc: "Memastikan pengalaman yang sempurna di setiap perangkat, dari layar ponsel hingga monitor 4K." }
              ].map((service, i) => (
                <div key={i} className="group p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c1d] border border-slate-100 dark:border-slate-800/50 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500">
                    <service.icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{service.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-purple-700 dark:from-cyan-900 dark:to-purple-900" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
          
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
              Punya Ide Proyek <br className="hidden md:block" />Yang Luar Biasa?
            </h2>
            <p className="text-cyan-100 text-xl mb-12 max-w-2xl mx-auto font-light">
              Mari bekerja sama untuk mengubah visi Anda menjadi produk digital yang mengesankan.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-full font-black text-lg hover:scale-105 transition-transform hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95"
            >
              Mulai Diskusi <ArrowRight size={24} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}