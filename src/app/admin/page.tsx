"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  PlusCircle, Trash2, LayoutDashboard, Settings, Code, Save,
  Image as ImageIcon, Link as LinkIcon, UploadCloud, X, Lock,
  Unlock, Briefcase, Star, FileText, Menu, BookOpen, Tag,
  MessageSquare, LineChart as ActivityIcon, Sun, Moon, ExternalLink,
  Monitor
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminDashboard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<
    | "analytics" | "settings" | "portfolio" | "resume"
    | "blog" | "pricing" | "pesan" | "uses"
  >("analytics");
  
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState<"hero" | "about" | "karya" | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [webContent, setWebContent] = useState({
    namaLengkap: "", headline: "", tentang: "", email: "",
    heroImage: "", aboutImage: "", github: "", linkedin: "", instagram: "",
  });
  
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any[]>([]);
  const [pesanMasuk, setPesanMasuk] = useState<any[]>([]);
  const [uses, setUses] = useState<any[]>([]);

  const [analyticsData, setAnalyticsData] = useState<{ chartData: any[]; topPages: any[] }>({
    chartData: [], topPages: [],
  });

  const [isAddingKarya, setIsAddingKarya] = useState(false);
  const [newKarya, setNewKarya] = useState({
    judul: "", kategori: "", deskripsi: "", image_url: "", link_project: "",
  });
  const [newSkill, setNewSkill] = useState({ nama_skill: "", persentase: "" });
  const [newExp, setNewExp] = useState({
    posisi: "", perusahaan: "", tahun: "", deskripsi: "",
  });
  const [newService, setNewService] = useState({
    nama_layanan: "", deskripsi: "",
  });
  const [newBlog, setNewBlog] = useState({ judul: "", konten_lengkap: "" });
  const [newPricing, setNewPricing] = useState({
    nama_paket: "", harga: "", deskripsi: "", fitur: "", is_popular: 0,
  });
  const [newUse, setNewUse] = useState({
    kategori: "Hardware", nama_item: "", deskripsi: ""
  });

  // 🔥 FIX SAKTI: KUNCI SCROLL BACKGROUND SAAT SIDEBAR TERBUKA!
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchSemuaData();
    }
  }, [status]);

  const fetchSemuaData = async () => {
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setPortfolios(data.karya || []);
        setSkills(data.skills || []);
        setExperiences(data.experiences || []);
        setServices(data.services || []);
        setBlogs(data.blogs || []);
        setPricing(data.pricing || []);
        setUses(data.uses || []);

        if (data.profil) {
          setWebContent({
            namaLengkap: data.profil.nama_lengkap || "",
            headline: data.profil.headline || "",
            tentang: data.profil.tentang || "",
            email: data.profil.email || "",
            heroImage: data.profil.hero_image || "",
            aboutImage: data.profil.about_image || "",
            github: data.profil.github_link || "",
            linkedin: data.profil.linkedin_link || "",
            instagram: data.profil.instagram_link || "",
          });
        }
      }

      const resPesan = await fetch("/api/admin-data?table=pesan");
      if (resPesan.ok) setPesanMasuk((await resPesan.json()) || []);

      const resAnalytics = await fetch("/api/analytics");
      if (resAnalytics.ok) {
        const parsedAnalytics = await resAnalytics.json();
        const formattedChartData =
          parsedAnalytics.chartData?.map((item: any) => ({
            ...item,
            date: new Date(item.date).toLocaleDateString("id-ID", {
              day: "numeric", month: "short",
            }),
          })) || [];
        setAnalyticsData({
          chartData: formattedChartData.reverse(),
          topPages: parsedAnalytics.topPages || [],
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(false);
    const res = await signIn("credentials", {
      redirect: false, username: username, password: password,
    });
    if (res?.error) {
      setLoginError(true);
      setIsLoggingIn(false);
    }
  };

  const handleAddDynamic = async (table: string, data: any, resetForm: () => void) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, data }),
      });
      if (res.ok) {
        resetForm();
        fetchSemuaData();
        alert("Data berhasil ditambahkan!");
      } else alert("Gagal menambah data!");
    } catch (error) {
      alert("Terjadi kesalahan server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDynamic = async (table: string, id: number) => {
    if (!confirm("Yakin mau hapus data ini?")) return;
    try {
      const res = await fetch(`/api/admin-data?table=${table}&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchSemuaData();
    } catch (error) {
      alert("Gagal menghapus");
    }
  };

  const handleDeleteKarya = async (id: number) => {
    if (!confirm("Yakin ingin menghapus karya ini?")) return;
    try {
      const res = await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchSemuaData();
    } catch (error) {
      alert("Gagal menghapus");
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "heroImage" | "aboutImage" | "karyaImage",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field === "heroImage" ? "hero" : field === "aboutImage" ? "about" : "karya");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("https://api.imgbb.com/1/upload?key=b3aa47bf0a03d83d985e9fab9cdf8e61", {
        method: "POST",
        body: formData, 
      });
      
      const data = await res.json();

      if (data.success) {
        const uploadedUrl = data.data.url;
        if (field === "karyaImage") {
          setNewKarya((prev) => ({ ...prev, image_url: uploadedUrl }));
        } else {
          setWebContent((prev) => ({ ...prev, [field]: uploadedUrl }));
        }
      } else {
        alert("Gagal unggah gambar ke ImgBB: " + (data.error?.message || "Kesalahan API"));
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem saat menghubungi ImgBB.");
    } finally {
      setUploading(null);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_lengkap: webContent.namaLengkap,
          headline: webContent.headline,
          tentang: webContent.tentang,
          email: webContent.email,
          hero_image: webContent.heroImage,
          about_image: webContent.aboutImage,
          github_link: webContent.github,
          linkedin_link: webContent.linkedin,
          instagram_link: webContent.instagram,
        }),
      });
      if (res.ok) alert("Pengaturan Web berhasil disimpan!");
    } catch (error) {
      alert("Server error!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveKarya = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKarya),
      });
      if (res.ok) {
        alert("Karya berhasil ditambahkan!");
        setIsAddingKarya(false);
        setNewKarya({
          judul: "", kategori: "", deskripsi: "", image_url: "", link_project: "",
        });
        fetchSemuaData();
      }
    } catch (error) {
      alert("Gagal menambah karya");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50/30 to-slate-100 dark:from-[#050510] dark:via-[#0a0a1a] dark:to-[#050510] transition-colors duration-500">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 animate-pulse flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.3)]">
            <Lock className="text-white w-10 h-10 animate-bounce" />
          </div>
          <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-400/20 to-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
        </div>
        <p className="mt-8 text-slate-600 dark:text-slate-400 font-medium animate-pulse tracking-widest uppercase text-sm">
          Memeriksa Akses Keamanan...
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#050510] dark:via-[#0a0a18] dark:to-[#050510] flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-[150px] animate-[float_8s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-[-15%] right-[-15%] w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[150px] animate-[float_10s_ease-in-out_infinite_2s]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-400/5 dark:bg-cyan-500/5 rounded-full blur-[100px] animate-pulse"></div>
        </div>
        
        <div className="bg-white/70 dark:bg-[#0c0c1d]/70 backdrop-blur-2xl p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] w-full max-w-md border border-white/50 dark:border-slate-800/50 border-t-[6px] border-t-cyan-500 z-10 transition-all duration-500 hover:shadow-[0_30px_70px_rgba(34,211,238,0.15)]">
          <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/50 dark:to-cyan-800/30 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg shadow-cyan-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Lock size={28} className="text-cyan-700 dark:text-cyan-300 sm:w-9 sm:h-9" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-white mb-3 text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400">
            Admin Secure Login
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6 sm:mb-8 font-medium text-center text-xs sm:text-sm">
            Silakan verifikasi identitas Anda.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            {loginError && (
              <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs sm:text-sm rounded-2xl text-center font-bold border border-red-200 dark:border-red-800 animate-shake backdrop-blur-sm transition-all">
                Username atau Password Salah!
              </div>
            )}
            <div className="relative group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 font-medium placeholder:text-slate-400 text-sm sm:text-base"
              />
            </div>
            <div className="relative group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 font-medium placeholder:text-slate-400 text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold py-3 sm:py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-cyan-600/30 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-base sm:text-lg tracking-wide disabled:opacity-70 disabled:hover:scale-100 touch-manipulation"
            >
              <Unlock size={18} className={isLoggingIn ? "animate-pulse" : ""} /> 
              {isLoggingIn ? "Memverifikasi..." : "Masuk Dashboard"}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-center">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-3 rounded-2xl text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-110 hover:shadow-lg touch-manipulation"
              aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#050510] dark:via-[#08081a] dark:to-[#050510] flex flex-col md:flex-row transition-colors duration-500 font-sans relative">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-3 sm:p-4 bg-white/90 dark:bg-[#0c0c1d]/90 backdrop-blur-xl shadow-lg border-b border-slate-200/50 dark:border-slate-800/50 transition-colors sticky top-0 z-20">
        <div className="text-lg sm:text-xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
          <Code size={20} className="text-cyan-500 sm:w-6 sm:h-6" /> CMS Riley
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all hover:scale-110 touch-manipulation"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all hover:scale-110 touch-manipulation"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Overlay Sidebar Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR - TINGGI DIKUNCI 100VH, GAK BISA BABLAS! */}
      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed top-0 left-0 z-40 w-64 sm:w-72 h-[100vh] bg-white dark:bg-[#0c0c1d] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none overflow-hidden`}
      >
        <div className="p-4 sm:p-6 text-xl sm:text-2xl font-black border-b border-slate-200 dark:border-slate-800 hidden md:flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent shrink-0">
          <Code className="text-cyan-500" size={24} /> CMS Riley
        </div>
        
        <nav className="flex-1 p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1.5 sm:space-y-2">
            {[
              { id: "analytics", label: "Dasbor Analitik", icon: ActivityIcon },
              { id: "settings", label: "Profil Web", icon: Settings },
              { id: "portfolio", label: "Portofolio", icon: LayoutDashboard },
              { id: "resume", label: "Resume & Layanan", icon: FileText },
              { id: "uses", label: "Alat Tempur (Uses)", icon: Monitor },
              { id: "blog", label: "Blog & Artikel", icon: BookOpen },
              { id: "pricing", label: "Paket Harga", icon: Tag },
              { id: "pesan", label: "Pesan Masuk", icon: MessageSquare },
            ].map((item) => (
              <li
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setSidebarOpen(false);
                }}
                className={`p-3 sm:p-3.5 rounded-2xl font-semibold cursor-pointer transition-all duration-300 flex items-center gap-3 group text-sm sm:text-base ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-lg shadow-cyan-500/30 scale-[1.02]"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:scale-[1.02]"
                }`}
              >
                <item.icon size={18} className={`sm:w-5 sm:h-5 transition-transform duration-300 ${activeTab === item.id ? "scale-110" : "group-hover:scale-110"}`} /> 
                {item.label}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Tombol - Nempel rapi di bawah area menu */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2 sm:gap-3 shrink-0 bg-slate-50/50 dark:bg-transparent">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 p-2.5 sm:p-3 rounded-2xl transition-all duration-300 font-semibold text-xs sm:text-sm hover:scale-[1.02]"
          >
            <ExternalLink size={14} className="sm:w-4 sm:h-4" /> Lihat Web Publik
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 p-2.5 sm:p-3 rounded-2xl transition-all duration-300 font-semibold text-xs sm:text-sm hover:scale-105 touch-manipulation"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />} Tema
            </button>
            <button
              onClick={() => signOut()}
              className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white p-2.5 sm:p-3 rounded-2xl transition-all duration-300 font-semibold text-xs sm:text-sm border border-red-200 dark:border-red-800/50 hover:border-red-500 hover:scale-105 touch-manipulation"
            >
              <Lock size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 text-slate-900 dark:text-slate-200 overflow-y-auto h-[100dvh] w-full transition-colors relative z-0 custom-scrollbar max-w-full">
        {activeTab === "analytics" && (
          <div className="animate-fade-in-up space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-2">
              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg shadow-cyan-500/30">
                <ActivityIcon className="text-white w-5 h-5 sm:w-7 sm:h-7" size={28} />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Dasbor <span className="bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">Analitik</span>
              </h1>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Total Kunjungan</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                  {analyticsData.chartData.reduce((acc: number, item: any) => acc + (item.views || 0), 0)}
                </p>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Hari Ini</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                  {analyticsData.chartData.length > 0 ? analyticsData.chartData[analyticsData.chartData.length - 1]?.views || 0 : 0}
                </p>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-1/2 animate-pulse"></div>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Rata² / Hari</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                  {analyticsData.chartData.length > 0 
                    ? Math.round(analyticsData.chartData.reduce((acc: number, item: any) => acc + (item.views || 0), 0) / analyticsData.chartData.length) 
                    : 0}
                </p>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full w-2/3 animate-pulse"></div>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Halaman Top</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 truncate">
                  {analyticsData.topPages.length > 0 ? analyticsData.topPages[0]?.path || "-" : "-"}
                </p>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full w-4/5 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 transition-all hover:shadow-xl duration-300 overflow-hidden">
                <h3 className="font-bold text-sm sm:text-lg text-slate-700 dark:text-slate-300 mb-4 sm:mb-8 flex items-center gap-2">
                  <ActivityIcon size={18} className="text-cyan-500" />
                  Traffic Kunjungan (7 Hari)
                </h3>
                <div className="h-[250px] sm:h-[300px] w-full -ml-4 sm:-ml-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsData.chartData}
                      margin={{ left: 0, right: 10, top: 5, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? "#1e293b" : "#f1f5f9"}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        tickMargin={8}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                        width={40}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 20px 40px -10px rgb(0 0 0 / 0.2)",
                          backgroundColor:
                            theme === "dark" ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(10px)",
                          color: theme === "dark" ? "#f8fafc" : "#0f172a",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="views"
                        name="Total Kunjungan"
                        stroke="#06b6d4"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#06b6d4", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 8, strokeWidth: 0, fill: "#06b6d4", className: "animate-pulse" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 transition-all hover:shadow-xl duration-300 overflow-hidden">
                <h3 className="font-bold text-sm sm:text-lg text-slate-700 dark:text-slate-300 mb-4 sm:mb-8 flex items-center gap-2">
                  <Star size={18} className="text-amber-500" />
                  Halaman Terpopuler (Top 5)
                </h3>
                <div className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.topPages}
                      layout="vertical"
                      margin={{ left: 0, right: 10, top: 5, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.6}/>
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity={1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? "#1e293b" : "#f1f5f9"}
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        dataKey="path"
                        type="category"
                        width={80}
                        tick={{
                          fontSize: 11,
                          fill: "#64748b",
                          fontWeight: 600,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{
                          fill: theme === "dark" ? "rgba(30,41,59,0.5)" : "rgba(241,245,249,0.5)",
                        }}
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 20px 40px -10px rgb(0 0 0 / 0.2)",
                          backdropFilter: "blur(10px)",
                          backgroundColor: theme === "dark" ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.9)",
                        }}
                        labelStyle={{ display: "none" }}
                      />
                      <Bar
                        dataKey="views"
                        name="Total Kunjungan"
                        fill="url(#barGradient)"
                        radius={[0, 10, 10, 0]}
                        barSize={22}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="animate-fade-in-up space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg shadow-cyan-500/30">
                  <Settings className="text-white w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Pengaturan <span className="bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">Profil</span>
                </h1>
              </div>
              <button onClick={handleSaveSettings} disabled={isSaving} className={`${isSaving ? "bg-slate-400" : "bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600"} text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold flex items-center gap-2 sm:gap-3 shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 w-full sm:w-auto hover:scale-105 active:scale-95 disabled:hover:scale-100 text-sm sm:text-base touch-manipulation justify-center`}>
                <Save size={18} className={isSaving ? "animate-spin" : ""} /> 
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>

            <div className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 space-y-8 sm:space-y-10 transition-all hover:shadow-xl duration-300">
              <div>
                <h3 className="text-lg sm:text-xl font-bold border-b border-slate-200/50 dark:border-slate-800/50 pb-3 sm:pb-4 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white">
                  <div className="p-1.5 sm:p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl">
                    <Settings size={16} className="text-cyan-500 sm:w-5 sm:h-5" />
                  </div>
                  Teks Utama
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={webContent.namaLengkap}
                      onChange={(e) =>
                        setWebContent({
                          ...webContent,
                          namaLengkap: e.target.value,
                        })
                      }
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                      Headline Pekerjaan
                    </label>
                    <input
                      type="text"
                      value={webContent.headline}
                      onChange={(e) =>
                        setWebContent({
                          ...webContent,
                          headline: e.target.value,
                        })
                      }
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                    Tentang Saya
                  </label>
                  <textarea
                    rows={3}
                    value={webContent.tentang}
                    onChange={(e) =>
                      setWebContent({ ...webContent, tentang: e.target.value })
                    }
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none resize-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                  ></textarea>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold border-b border-slate-200/50 dark:border-slate-800/50 pb-3 sm:pb-4 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white">
                  <div className="p-1.5 sm:p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl">
                    <ImageIcon size={16} className="text-cyan-500 sm:w-5 sm:h-5" />
                  </div>
                  Pengaturan Gambar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl text-center hover:bg-slate-50/50 dark:hover:bg-[#131326]/50 transition-all duration-300 hover:border-cyan-500/50 group">
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 sm:mb-6">
                      Gambar Beranda (Hero)
                    </label>
                    {webContent.heroImage && (
                      <img
                        src={webContent.heroImage}
                        className="h-32 sm:h-40 mx-auto mb-4 sm:mb-6 object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                        alt="hero"
                      />
                    )}
                    <label className="cursor-pointer bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/20 text-cyan-600 dark:text-cyan-400 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold inline-flex items-center gap-2 sm:gap-3 hover:from-cyan-100 hover:to-cyan-200 dark:hover:from-cyan-900/50 dark:hover:to-cyan-800/30 transition-all duration-300 hover:scale-105 active:scale-95 text-xs sm:text-sm touch-manipulation">
                      <UploadCloud size={16} className="sm:w-[18px] sm:h-[18px]" /> 
                      {uploading === "hero" ? "Mengunggah..." : "Pilih Gambar"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "heroImage")}
                        disabled={uploading !== null}
                      />
                    </label>
                  </div>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl text-center hover:bg-slate-50/50 dark:hover:bg-[#131326]/50 transition-all duration-300 hover:border-cyan-500/50 group">
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 sm:mb-6">
                      Gambar Tentang (About)
                    </label>
                    {webContent.aboutImage && (
                      <img
                        src={webContent.aboutImage}
                        className="h-32 sm:h-40 mx-auto mb-4 sm:mb-6 object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                        alt="about"
                      />
                    )}
                    <label className="cursor-pointer bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/20 text-cyan-600 dark:text-cyan-400 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold inline-flex items-center gap-2 sm:gap-3 hover:from-cyan-100 hover:to-cyan-200 dark:hover:from-cyan-900/50 dark:hover:to-cyan-800/30 transition-all duration-300 hover:scale-105 active:scale-95 text-xs sm:text-sm touch-manipulation">
                      <UploadCloud size={16} className="sm:w-[18px] sm:h-[18px]" /> 
                      {uploading === "about" ? "Mengunggah..." : "Pilih Gambar"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "aboutImage")}
                        disabled={uploading !== null}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold border-b border-slate-200/50 dark:border-slate-800/50 pb-3 sm:pb-4 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white">
                  <div className="p-1.5 sm:p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl">
                    <LinkIcon size={16} className="text-cyan-500 sm:w-5 sm:h-5" />
                  </div>
                  Sosial Media & Kontak
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {["email", "github", "linkedin", "instagram"].map(
                    (sosmed) => (
                      <div key={sosmed}>
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3 capitalize">
                          {sosmed}
                        </label>
                        <input
                          type={sosmed === "email" ? "email" : "text"}
                          value={(webContent as any)[sosmed]}
                          onChange={(e) =>
                            setWebContent({
                              ...webContent,
                              [sosmed]: e.target.value,
                            })
                          }
                          className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="animate-fade-in-up space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg shadow-cyan-500/30">
                  <LayoutDashboard className="text-white w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Manajemen <span className="bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">Karya</span>
                </h1>
              </div>
              <button
                onClick={() => setIsAddingKarya(!isAddingKarya)}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold flex items-center gap-2 sm:gap-3 shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 w-full sm:w-auto hover:scale-105 active:scale-95 text-sm sm:text-base touch-manipulation justify-center"
              >
                {isAddingKarya ? <X size={18} /> : <PlusCircle size={18} />} 
                {isAddingKarya ? "Batal Tambah" : "Tambah Karya"}
              </button>
            </div>

            {isAddingKarya && (
              <form
                onSubmit={handleSaveKarya}
                className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 mb-8 sm:mb-10 border-t-[6px] border-t-cyan-500 transition-all hover:shadow-xl duration-300"
              >
                <h3 className="font-bold text-lg sm:text-2xl mb-6 sm:mb-8 text-slate-800 dark:text-white flex items-center gap-2 sm:gap-3">
                  <PlusCircle className="text-cyan-500 w-5 h-5 sm:w-6 sm:h-6" />
                  Form Karya Baru
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                      Judul Proyek
                    </label>
                    <input
                      required
                      type="text"
                      value={newKarya.judul}
                      onChange={(e) =>
                        setNewKarya({ ...newKarya, judul: e.target.value })
                      }
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                      Kategori
                    </label>
                    <input
                      required
                      type="text"
                      value={newKarya.kategori}
                      onChange={(e) =>
                        setNewKarya({ ...newKarya, kategori: e.target.value })
                      }
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div className="mb-4 sm:mb-6">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                    Deskripsi
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newKarya.deskripsi}
                    onChange={(e) =>
                      setNewKarya({ ...newKarya, deskripsi: e.target.value })
                    }
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none resize-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                      Link Project
                    </label>
                    <input
                      type="text"
                      value={newKarya.link_project}
                      onChange={(e) =>
                        setNewKarya({
                          ...newKarya,
                          link_project: e.target.value,
                        })
                      }
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                      Upload Gambar
                    </label>
                    <label className="cursor-pointer flex items-center justify-center gap-2 sm:gap-3 w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-100/80 dark:bg-[#1e293b]/80 backdrop-blur-sm border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300 hover:border-cyan-500/50 hover:scale-[1.02] active:scale-95 text-xs sm:text-sm touch-manipulation">
                      <UploadCloud size={16} className="sm:w-[18px] sm:h-[18px]" /> 
                      {uploading === "karya"
                        ? "Mengunggah..."
                        : "Pilih File Gambar"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "karyaImage")}
                        disabled={uploading !== null}
                      />
                    </label>
                    {newKarya.image_url && (
                      <img src={newKarya.image_url} className="mt-3 sm:mt-4 h-16 sm:h-20 rounded-xl shadow-md" alt="preview" />
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold py-4 sm:py-5 rounded-2xl transition-all duration-300 shadow-lg shadow-cyan-600/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 text-sm sm:text-base touch-manipulation"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Proyek"}
                </button>
              </form>
            )}

            <div className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 overflow-hidden transition-all hover:shadow-xl duration-300">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50">
                      <th className="p-3 sm:p-4 md:p-6 font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                        Detail Karya
                      </th>
                      <th className="p-3 sm:p-4 md:p-6 font-bold text-slate-700 dark:text-slate-300 w-24 sm:w-32 text-center text-xs sm:text-sm">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
                    {portfolios.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-[#131326]/50 transition-all duration-300 group"
                      >
                        <td className="p-3 sm:p-4 md:p-6 flex items-center gap-3 sm:gap-4 md:gap-5">
                          <img
                            src={
                              item.image_url ||
                              "https://via.placeholder.com/150"
                            }
                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-xl sm:rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
                            alt="karya"
                          />
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm sm:text-base md:text-lg text-slate-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                              {item.judul}
                            </h3>
                            <span className="text-[10px] sm:text-xs bg-gradient-to-r from-cyan-100 to-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/20 text-cyan-700 dark:text-cyan-400 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full font-semibold border border-cyan-200/50 dark:border-cyan-800/50">
                              {item.kategori}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 md:p-6 text-center">
                          <button
                            onClick={() => handleDeleteKarya(item.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 active:scale-90 touch-manipulation"
                          >
                            <Trash2 size={16} className="sm:w-5 sm:h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "resume" && (
          <div className="animate-fade-in-up space-y-10 sm:space-y-14">
            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg shadow-amber-500/30">
                  <Star className="text-white w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                  Keahlian <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">(Skills)</span>
                </h2>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddDynamic("skills", newSkill, () =>
                    setNewSkill({ nama_skill: "", persentase: "" }),
                  );
                }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10"
              >
                <input
                  required
                  type="text"
                  placeholder="Nama Skill"
                  value={newSkill.nama_skill}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, nama_skill: e.target.value })
                  }
                  className="flex-1 px-4 sm:px-5 py-3 sm:py-4 bg-white/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                />
                <input
                  required
                  type="number"
                  placeholder="Persentase (0-100)"
                  value={newSkill.persentase}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, persentase: e.target.value })
                  }
                  className="w-full sm:w-40 md:w-48 px-4 sm:px-5 py-3 sm:py-4 bg-white/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                />
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white px-6 sm:px-8 py-3 sm:py-4 font-bold rounded-2xl shadow-lg hover:shadow-amber-500/40 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-70 text-sm sm:text-base touch-manipulation"
                >
                  <PlusCircle size={18} /> Tambah
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm sm:text-base text-slate-800 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                        {s.nama_skill}
                      </p>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700 ease-out" 
                          style={{ width: `${s.persentase}%` }}
                        ></div>
                      </div>
                      <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-black mt-2">
                        {s.persentase}%
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteDynamic("skills", s.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl transition-all duration-300 hover:scale-110 ml-3 sm:ml-4 touch-manipulation"
                    >
                      <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-200/50 dark:border-slate-800/50" />

            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/30">
                  <Briefcase className="text-white w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                  Pengalaman <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Karir</span>
                </h2>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddDynamic("experiences", newExp, () =>
                    setNewExp({
                      posisi: "",
                      perusahaan: "",
                      tahun: "",
                      deskripsi: "",
                    }),
                  );
                }}
                className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm mb-8 sm:mb-10 space-y-4 sm:space-y-6 transition-all hover:shadow-xl duration-300"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <input
                    required
                    type="text"
                    placeholder="Posisi"
                    value={newExp.posisi}
                    onChange={(e) =>
                      setNewExp({ ...newExp, posisi: e.target.value })
                    }
                    className="px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Perusahaan"
                    value={newExp.perusahaan}
                    onChange={(e) =>
                      setNewExp({ ...newExp, perusahaan: e.target.value })
                    }
                    className="px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Tahun"
                    value={newExp.tahun}
                    onChange={(e) =>
                      setNewExp({ ...newExp, tahun: e.target.value })
                    }
                    className="px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                  />
                </div>
                <textarea
                  required
                  rows={2}
                  placeholder="Deskripsi pekerjaan singkat..."
                  value={newExp.deskripsi}
                  onChange={(e) =>
                    setNewExp({ ...newExp, deskripsi: e.target.value })
                  }
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                ></textarea>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 sm:px-8 py-4 sm:py-5 w-full font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 disabled:opacity-70 text-sm sm:text-base touch-manipulation"
                >
                  Simpan Pengalaman
                </button>
              </form>
              <div className="space-y-3 sm:space-y-4">
                {experiences.map((e) => (
                  <div
                    key={e.id}
                    className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01] group"
                  >
                    <div className="flex-1 pr-2 sm:pr-4 mb-3 sm:mb-0">
                      <p className="font-bold text-sm sm:text-lg text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {e.posisi}{" "}
                        <span className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-500 ml-2">
                          di {e.perusahaan} ({e.tahun})
                        </span>
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {e.deskripsi}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteDynamic("experiences", e.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 sm:p-3 rounded-xl transition-all duration-300 hover:scale-110 touch-manipulation self-end sm:self-auto"
                    >
                      <Trash2 size={16} className="sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-200/50 dark:border-slate-800/50" />

            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg shadow-green-500/30">
                  <Code className="text-white w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                  Layanan <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Utama</span>
                </h2>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddDynamic("services", newService, () =>
                    setNewService({ nama_layanan: "", deskripsi: "" }),
                  );
                }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10"
              >
                <input
                  required
                  type="text"
                  placeholder="Nama Layanan"
                  value={newService.nama_layanan}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      nama_layanan: e.target.value,
                    })
                  }
                  className="w-full sm:w-1/3 px-4 sm:px-5 py-3 sm:py-4 bg-white/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                />
                <input
                  required
                  type="text"
                  placeholder="Deskripsi Singkat..."
                  value={newService.deskripsi}
                  onChange={(e) =>
                    setNewService({ ...newService, deskripsi: e.target.value })
                  }
                  className="flex-1 px-4 sm:px-5 py-3 sm:py-4 bg-white/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                />
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 font-bold rounded-2xl shadow-lg hover:shadow-green-500/40 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-70 text-sm sm:text-base touch-manipulation"
                >
                  <PlusCircle size={18} /> Tambah
                </button>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-slate-800/50 flex justify-between items-start shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <div className="pr-3 sm:pr-4 flex-1 min-w-0">
                      <p className="font-bold text-sm sm:text-lg text-slate-800 dark:text-white mb-1 sm:mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {s.nama_layanan}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        {s.deskripsi}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteDynamic("services", s.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl transition-all duration-300 hover:scale-110 touch-manipulation flex-shrink-0"
                    >
                      <Trash2 size={16} className="sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Uses Tab */}
        {activeTab === "uses" && (
          <div className="animate-fade-in-up space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-2">
              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/30">
                <Monitor className="text-white w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Manajemen <span className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">Alat Tempur</span>
              </h1>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddDynamic("uses_setup", newUse, () =>
                  setNewUse({ kategori: "Hardware", nama_item: "", deskripsi: "" }),
                );
              }}
              className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 mb-8 sm:mb-10 transition-all hover:shadow-xl duration-300"
            >
              <h3 className="font-bold text-lg sm:text-2xl mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white">
                <Monitor className="text-indigo-500 w-5 h-5 sm:w-6 sm:h-6" /> Tambah Alat Baru
              </h3>
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">Kategori</label>
                  <select
                    value={newUse.kategori}
                    onChange={(e) => setNewUse({ ...newUse, kategori: e.target.value })}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm sm:text-base"
                  >
                    <option value="Hardware">Hardware (Workstation)</option>
                    <option value="Software">Software & Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">Nama Alat</label>
                  <input
                    required
                    type="text"
                    value={newUse.nama_item}
                    onChange={(e) => setNewUse({ ...newUse, nama_item: e.target.value })}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm sm:text-base"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">Deskripsi / Alasan Pemakaian</label>
                  <input
                    required
                    type="text"
                    value={newUse.deskripsi}
                    onChange={(e) => setNewUse({ ...newUse, deskripsi: e.target.value })}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm sm:text-base"
                  />
                </div>
              </div>
              <button type="submit" disabled={isSaving} className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold w-full transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/20 text-sm sm:text-base touch-manipulation">
                Simpan Alat Tempur
              </button>
            </form>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {uses.map((u) => (
                <div key={u.id} className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-slate-800/50 flex justify-between items-start transition-all hover:shadow-xl">
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="text-[10px] sm:text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 sm:px-3 py-1 rounded-full font-bold mb-2 sm:mb-3 block w-fit border border-indigo-200 dark:border-indigo-800">
                      {u.kategori}
                    </span>
                    <h3 className="font-bold text-base sm:text-xl text-slate-900 dark:text-white mb-1 sm:mb-2 truncate">{u.nama_item}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{u.deskripsi}</p>
                  </div>
                  <button onClick={() => handleDeleteDynamic("uses_setup", u.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all hover:scale-110 touch-manipulation flex-shrink-0">
                    <Trash2 size={16} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === "blog" && (
          <div className="animate-fade-in-up space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-2">
              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg shadow-cyan-500/30">
                <BookOpen className="text-white w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Manajemen <span className="bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">Blog</span>
              </h1>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddDynamic("blogs", newBlog, () =>
                  setNewBlog({ judul: "", konten_lengkap: "" }),
                );
              }}
              className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 mb-8 sm:mb-10 transition-all hover:shadow-xl duration-300"
            >
              <h3 className="font-bold text-lg sm:text-2xl mb-6 sm:mb-8 text-slate-800 dark:text-white flex items-center gap-2 sm:gap-3">
                <BookOpen className="text-cyan-500 w-5 h-5 sm:w-6 sm:h-6" />
                Tulis Artikel Baru
              </h3>
              <div className="mb-6 sm:mb-8">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                  Judul Artikel
                </label>
                <input
                  required
                  type="text"
                  value={newBlog.judul}
                  onChange={(e) => setNewBlog({ ...newBlog, judul: e.target.value })}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                />
              </div>
              <div className="mb-8 sm:mb-10">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                  Isi Konten Lengkap
                </label>
                <textarea
                  required
                  rows={5}
                  value={newBlog.konten_lengkap}
                  onChange={(e) => setNewBlog({ ...newBlog, konten_lengkap: e.target.value })}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none resize-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold w-full transition-all duration-300 shadow-lg shadow-cyan-600/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95 disabled:opacity-70 text-sm sm:text-base touch-manipulation"
              >
                Terbitkan Artikel
              </button>
            </form>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {blogs.map((b) => (
                <div
                  key={b.id}
                  className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                >
                  <div>
                    <h3 className="font-bold text-base sm:text-xl text-slate-900 dark:text-white mb-3 sm:mb-4 leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {b.judul}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 sm:mb-6 leading-relaxed">
                      {b.konten_lengkap}
                    </p>
                    <span className="text-[10px] sm:text-xs text-cyan-700 dark:text-cyan-400 bg-cyan-50/80 dark:bg-cyan-900/30 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full font-bold border border-cyan-200/50 dark:border-cyan-800/50">
                      {new Date(b.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteDynamic("blogs", b.id)}
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 sm:p-3 rounded-xl self-end mt-4 sm:mt-6 transition-all duration-300 hover:scale-110 touch-manipulation"
                  >
                    <Trash2 size={16} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === "pricing" && (
          <div className="animate-fade-in-up space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-2">
              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg shadow-cyan-500/30">
                <Tag className="text-white w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Manajemen <span className="bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">Paket Harga</span>
              </h1>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddDynamic("pricing", newPricing, () =>
                  setNewPricing({
                    nama_paket: "",
                    harga: "",
                    deskripsi: "",
                    fitur: "",
                    is_popular: 0,
                  }),
                );
              }}
              className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 mb-8 sm:mb-10 transition-all hover:shadow-xl duration-300"
            >
              <h3 className="font-bold text-lg sm:text-2xl mb-6 sm:mb-8 text-slate-800 dark:text-white flex items-center gap-2 sm:gap-3">
                <Tag className="text-cyan-500 w-5 h-5 sm:w-6 sm:h-6" />
                Tambah Paket Baru
              </h3>
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                    Nama Paket
                  </label>
                  <input
                    required
                    type="text"
                    value={newPricing.nama_paket}
                    onChange={(e) =>
                      setNewPricing({
                        ...newPricing,
                        nama_paket: e.target.value,
                      })
                    }
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                    Harga (Misal: Rp 1.5M)
                  </label>
                  <input
                    required
                    type="text"
                    value={newPricing.harga}
                    onChange={(e) =>
                      setNewPricing({ ...newPricing, harga: e.target.value })
                    }
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                    Deskripsi Singkat
                  </label>
                  <input
                    required
                    type="text"
                    value={newPricing.deskripsi}
                    onChange={(e) =>
                      setNewPricing({
                        ...newPricing,
                        deskripsi: e.target.value,
                      })
                    }
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                    Fitur (Pisahkan dengan koma)
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Fitur 1, Fitur 2, Fitur 3"
                    value={newPricing.fitur}
                    onChange={(e) =>
                      setNewPricing({ ...newPricing, fitur: e.target.value })
                    }
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 cursor-pointer text-slate-700 dark:text-slate-300 font-bold p-4 sm:p-6 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm rounded-2xl border-2 border-slate-200 dark:border-slate-700 transition-all hover:border-cyan-500/50 text-sm sm:text-base">
                <input
                  type="checkbox"
                  className="w-5 h-5 sm:w-6 sm:h-6 accent-cyan-600 rounded-lg flex-shrink-0"
                  checked={newPricing.is_popular === 1}
                  onChange={(e) =>
                    setNewPricing({
                      ...newPricing,
                      is_popular: e.target.checked ? 1 : 0,
                    })
                  }
                />
                <span>Tandai sebagai Paket Paling Populer (Most Popular)</span>
              </label>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold w-full transition-all duration-300 shadow-lg shadow-cyan-600/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95 disabled:opacity-70 text-sm sm:text-base touch-manipulation"
              >
                Simpan Paket
              </button>
            </form>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {pricing.map((p) => (
                <div
                  key={p.id}
                  className={`bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-5 sm:p-8 rounded-2xl sm:rounded-3xl border relative transition-all duration-500 hover:shadow-2xl hover:scale-[1.03] ${
                    p.is_popular
                      ? "border-cyan-500 shadow-xl dark:shadow-[0_0_30px_rgba(34,211,238,0.15)] ring-2 ring-cyan-500/50"
                      : "border-slate-200/50 dark:border-slate-800/50 shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => handleDeleteDynamic("pricing", p.id)}
                    className="absolute top-3 right-3 sm:top-5 sm:right-5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl transition-all duration-300 hover:scale-110 z-10 touch-manipulation"
                  >
                    <Trash2 size={16} className="sm:w-5 sm:h-5" />
                  </button>
                  {p.is_popular ? (
                    <span className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-[10px] sm:text-xs font-black px-3 sm:px-5 py-1.5 sm:py-2 rounded-full mb-6 sm:mb-8 block w-fit tracking-wide shadow-lg shadow-cyan-500/30">
                      ⭐ POPULER
                    </span>
                  ) : null}
                  <h3 className="font-bold text-lg sm:text-2xl text-slate-900 dark:text-white mb-2 sm:mb-3">
                    {p.nama_paket}
                  </h3>
                  <p className="text-3xl sm:text-5xl text-cyan-600 dark:text-cyan-500 font-black my-4 sm:my-6">
                    {p.harga}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 sm:mb-8">
                    {p.deskripsi}
                  </p>
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 leading-relaxed transition-all">
                    <b className="mb-2 sm:mb-3 block text-slate-900 dark:text-white text-sm sm:text-base">
                      Fitur:
                    </b>
                    <ul className="list-disc pl-4 sm:pl-5 space-y-1.5 sm:space-y-2">
                      {p.fitur?.split(",").map((f: string, i: number) => (
                        <li key={i} className="text-slate-600 dark:text-slate-400">{f.trim()}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pesan Tab */}
        {activeTab === "pesan" && (
          <div className="animate-fade-in-up space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-2">
              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg shadow-cyan-500/30">
                <MessageSquare className="text-white w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Inbox <span className="bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">Pesan Masuk</span>
              </h1>
            </div>
            <div className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 transition-all hover:shadow-xl duration-300">
              {pesanMasuk.length === 0 ? (
                <div className="text-center py-12 sm:py-20">
                  <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8">
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
                    <MessageSquare
                      size={48}
                      className="relative mx-auto text-slate-300 dark:text-slate-700 sm:w-16 sm:h-16"
                    />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-lg">
                    Belum ada pesan baru yang masuk.
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs sm:text-sm mt-2">
                    Pesan dari pengunjung web akan muncul di sini.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {pesanMasuk.map((msg) => {
                    const utcDate =
                      typeof msg.created_at === "string" &&
                      !msg.created_at.includes("T")
                        ? msg.created_at.replace(" ", "T") + "Z"
                        : msg.created_at;

                    const waktuWIB = new Date(utcDate).toLocaleString("id-ID", {
                      timeZone: "Asia/Jakarta",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={msg.id}
                        className="bg-slate-50/80 dark:bg-[#131326]/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-slate-800/50 relative hover:border-cyan-500/50 transition-all duration-300 shadow-sm hover:shadow-xl group"
                      >
                        <button
                          onClick={() => handleDeleteDynamic("pesan", msg.id)}
                          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 touch-manipulation"
                        >
                          <Trash2 size={16} className="sm:w-5 sm:h-5" />
                        </button>
                        <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg flex-shrink-0">
                            {msg.nama?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-base sm:text-xl text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                              {msg.nama}
                            </h3>
                            <p className="text-cyan-600 dark:text-cyan-400 text-xs sm:text-sm font-medium truncate">
                              {msg.email}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 leading-relaxed transition-all whitespace-pre-wrap text-slate-700 dark:text-slate-300 shadow-inner text-xs sm:text-sm">
                          {msg.pesan}
                        </div>
                        <div className="mt-4 sm:mt-6 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-4 sm:pt-5">
                          <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            DITERIMA: {waktuWIB} WIB
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}