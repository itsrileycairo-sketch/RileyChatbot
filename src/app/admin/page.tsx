"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  PlusCircle,
  Trash2,
  LayoutDashboard,
  Settings,
  Code,
  Save,
  Image as ImageIcon,
  Link as LinkIcon,
  UploadCloud,
  X,
  Lock,
  Unlock,
  Briefcase,
  Star,
  FileText,
  Menu,
  BookOpen,
  Tag,
  MessageSquare,
  LineChart as ActivityIcon,
  Sun,
  Moon,
  ExternalLink,
  Monitor,
  Trophy,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
    | "analytics"
    | "settings"
    | "portfolio"
    | "resume"
    | "blog"
    | "pricing"
    | "pesan"
    | "uses"
    | "achievements"
  >("analytics");

  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState<"hero" | "about" | "karya" | null>(
    null,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [webContent, setWebContent] = useState({
    namaLengkap: "",
    headline: "",
    tentang: "",
    email: "",
    heroImage: "",
    aboutImage: "",
    github: "",
    linkedin: "",
    instagram: "",
  });

  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any[]>([]);
  const [pesanMasuk, setPesanMasuk] = useState<any[]>([]);
  const [uses, setUses] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  const [analyticsData, setAnalyticsData] = useState<{
    chartData: any[];
    topPages: any[];
  }>({
    chartData: [],
    topPages: [],
  });

  const [isAddingKarya, setIsAddingKarya] = useState(false);
  const [newKarya, setNewKarya] = useState({
    judul: "",
    kategori: "",
    deskripsi: "",
    image_url: "",
    link_project: "",
  });
  const [newSkill, setNewSkill] = useState({ nama_skill: "", persentase: "" });
  const [newExp, setNewExp] = useState({
    posisi: "",
    perusahaan: "",
    tahun: "",
    deskripsi: "",
  });
  const [newService, setNewService] = useState({
    nama_layanan: "",
    deskripsi: "",
  });
  const [newBlog, setNewBlog] = useState({ judul: "", konten_lengkap: "" });
  const [newPricing, setNewPricing] = useState({
    nama_paket: "",
    harga: "",
    deskripsi: "",
    fitur: "",
    is_popular: 0,
  });
  const [newUse, setNewUse] = useState({
    kategori: "Hardware (Workstation)",
    nama_item: "",
    deskripsi: "",
  });
  const [newAchievement, setNewAchievement] = useState({
    judul: "",
    tahun: "",
    deskripsi: "",
  });

  // Prevent scrolling when mobile sidebar is open
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

  // Fetch data only after authentication
  useEffect(() => {
    if (status === "authenticated") {
      fetchSemuaData();
    }
  }, [status]);

  const fetchSemuaData = async () => {
    try {
      // 1. Fetch Public Portfolio Data (Profil, Karya, Skills, Exp, Services, Blogs, Pricing)
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setPortfolios(data.karya || []);
        setSkills(data.skills || []);
        setExperiences(data.experiences || []);
        setServices(data.services || []);
        setBlogs(data.blogs || []);
        setPricing(data.pricing || []);

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

      // 2. Fetch Admin Specific Data (Pesan, Uses, Achievements)
      const resPesan = await fetch("/api/admin-data?table=pesan");
      if (resPesan.ok) setPesanMasuk((await resPesan.json()) || []);

      const resUses = await fetch("/api/admin-data?table=uses_setup");
      if (resUses.ok) setUses((await resUses.json()) || []);

      const resAch = await fetch("/api/admin-data?table=achievements");
      if (resAch.ok) setAchievements((await resAch.json()) || []);

      // 3. Fetch Analytics
      const resAnalytics = await fetch("/api/analytics");
      if (resAnalytics.ok) {
        const parsedAnalytics = await resAnalytics.json();
        const formattedChartData =
          parsedAnalytics.chartData?.map((item: any) => ({
            ...item,
            date: new Date(item.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            }),
          })) || [];
        setAnalyticsData({
          chartData: formattedChartData.reverse(), // Show newest on right
          topPages: parsedAnalytics.topPages || [],
        });
      }
    } catch (e) {
      console.error("Error fetching dashboard data:", e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(false);
    const res = await signIn("credentials", {
      redirect: false,
      username: username,
      password: password,
    });
    if (res?.error) {
      setLoginError(true);
      setIsLoggingIn(false);
    }
  };

  // --- GENERIC CRUD HANDLERS FOR DYNAMIC TABLES ---

  const handleAddDynamic = async (
    table: string,
    data: any,
    resetForm: () => void,
  ) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, data }),
      });
      if (res.ok) {
        resetForm();
        fetchSemuaData(); // Refresh data
        alert(`Data ${table} berhasil ditambahkan!`);
      } else {
        const errData = await res.json();
        alert(`Gagal menambah data: ${errData.error}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDynamic = async (table: string, id: number) => {
    if (
      !confirm("Yakin mau hapus data ini? Tindakan ini tidak bisa dibatalkan.")
    )
      return;
    try {
      const res = await fetch(`/api/admin-data?table=${table}&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchSemuaData(); // Refresh data
      } else {
        alert("Gagal menghapus data.");
      }
    } catch (error) {
      alert("Gagal menghubungi server.");
    }
  };

  // --- SPECIAL HANDLING FOR PORTFOLIO (Complex data) ---

  const handleDeleteKarya = async (id: number) => {
    if (!confirm("Yakin ingin menghapus karya ini?")) return;
    try {
      // Portfolio uses specific API
      const res = await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchSemuaData();
    } catch (error) {
      alert("Gagal menghapus");
    }
  };

  const handleSaveKarya = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Portfolio uses specific API for POST
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKarya),
      });
      if (res.ok) {
        alert("Karya berhasil ditambahkan!");
        setIsAddingKarya(false);
        setNewKarya({
          judul: "",
          kategori: "",
          deskripsi: "",
          image_url: "",
          link_project: "",
        });
        fetchSemuaData();
      } else {
        alert("Gagal menambah karya ke database.");
      }
    } catch (error) {
      alert("Gagal menghubungi server");
    } finally {
      setIsSaving(false);
    }
  };

  // --- FILE UPLOAD HANDLER (ImgBB) ---

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "heroImage" | "aboutImage" | "karyaImage",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit size 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("File terlalu besar. Maksimal 2MB");
      return;
    }

    setUploading(
      field === "heroImage"
        ? "hero"
        : field === "aboutImage"
          ? "about"
          : "karya",
    );

    const formData = new FormData();
    formData.append("image", file);

    try {
      // PERINGATAN: Di production, gunakan API route internal untuk menyembunyikan API KEY
      const apiKey = "b3aa47bf0a03d83d985e9fab9cdf8e61"; // WARNING: EXPOSED KEY
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
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
        alert(
          "Gagal unggah gambar ke ImgBB: " +
            (data.error?.message || "Kesalahan API"),
        );
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem saat menghubungi ImgBB.");
    } finally {
      setUploading(null);
    }
  };

  // --- SAVE WEB SETTINGS (PROFIL) ---

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
      if (res.ok) {
        alert("Pengaturan Web berhasil disimpan!");
        fetchSemuaData(); // Refresh local state
      } else {
        alert("Gagal menyimpan profil.");
      }
    } catch (error) {
      alert("Server error saat menyimpan profil!");
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state (CSS Only)
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

  // --- LOGIN SCREEN ---
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#050510] dark:via-[#0a0a18] dark:to-[#050510] flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
        {/* Background Decorations */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-[150px] animate-[float_8s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-[-15%] right-[-15%] w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[150px] animate-[float_10s_ease-in-out_infinite_2s]"></div>
        </div>

        <div className="bg-white/70 dark:bg-[#0c0c1d]/70 backdrop-blur-2xl p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] w-full max-w-md border border-white/50 dark:border-slate-800/50 border-t-[6px] border-t-cyan-500 z-10 transition-all duration-500 hover:shadow-[0_30px_70px_rgba(34,211,238,0.15)] relative">
          <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/50 dark:to-cyan-800/30 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg shadow-cyan-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Lock
              size={28}
              className="text-cyan-700 dark:text-cyan-300 sm:w-9 sm:h-9"
            />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-white mb-3 text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400">
            Admin Secure Login
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6 sm:mb-8 font-medium text-center text-xs sm:text-sm">
            Silakan verifikasi identitas Anda untuk mengakses command center.
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
              <Unlock
                size={18}
                className={isLoggingIn ? "animate-pulse" : ""}
              />
              {isLoggingIn ? "Memverifikasi..." : "Masuk Dashboard"}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-3 rounded-2xl text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-110 hover:shadow-lg touch-manipulation"
              aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link
              href="/"
              className="p-3 rounded-2xl text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-110 hover:shadow-lg touch-manipulation"
            >
              <ExternalLink size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#050510] dark:via-[#08081a] dark:to-[#050510] flex flex-col md:flex-row transition-colors duration-500 font-sans relative">
      {/* Global CSS for Animations & Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-5px);
          }
          40%,
          80% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-3 sm:p-4 bg-white/90 dark:bg-[#0c0c1d]/90 backdrop-blur-xl shadow-lg border-b border-slate-200/50 dark:border-slate-800/50 transition-colors sticky top-0 z-20 w-full">
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
            aria-label="Toggle Menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:sticky top-0 left-0 md:top-0 z-40 w-64 sm:w-72 max-w-[85vw] md:max-w-none h-screen bg-white dark:bg-[#0c0c1d] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none overflow-hidden shrink-0`}
      >
        <div className="p-4 sm:p-6 text-xl sm:text-2xl font-black border-b border-slate-200 dark:border-slate-800 hidden md:flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent shrink-0">
          <Code className="text-cyan-500" size={24} /> CMS Riley
        </div>

        <nav className="flex-1 p-3 sm:p-4 overflow-y-auto custom-scrollbar space-y-10">
          {/* Main Menu */}
          <ul className="space-y-1.5 sm:space-y-2">
            {[
              { id: "analytics", label: "Dasbor Analitik", icon: ActivityIcon },
              { id: "settings", label: "Profil Web", icon: Settings },
              {
                id: "portfolio",
                label: "Portofolio (Karya)",
                icon: LayoutDashboard,
              },
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
                <item.icon
                  size={18}
                  className={`sm:w-5 sm:h-5 transition-transform duration-300 ${activeTab === item.id ? "scale-110" : "group-hover:scale-110"}`}
                />
                {item.label}
              </li>
            ))}
          </ul>

          {/* Resume & Content */}
          <div className="space-y-3">
            <h4 className="px-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">
              Konten Resume
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { id: "resume", label: "Skills & Pengalaman", icon: FileText },
                { id: "achievements", label: "Pencapaian", icon: Trophy },
                { id: "uses", label: "Setup (Uses)", icon: Monitor },
              ].map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSidebarOpen(false);
                  }}
                  className={`p-3 rounded-xl font-medium cursor-pointer transition-all flex items-center gap-3 group text-sm ${activeTab === item.id ? "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-cyan-600 dark:hover:text-cyan-400"}`}
                >
                  <item.icon size={16} /> {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Marketing & Communication */}
          <div className="space-y-3">
            <h4 className="px-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">
              Marketing
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
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
                  className={`p-3 rounded-xl font-medium cursor-pointer transition-all flex items-center gap-3 group text-sm ${activeTab === item.id ? "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-cyan-600 dark:hover:text-cyan-400"}`}
                >
                  <item.icon size={16} /> {item.label}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2 shrink-0 bg-slate-50/50 dark:bg-transparent">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 p-2.5 rounded-xl transition-all duration-300 font-semibold text-xs sm:text-sm hover:scale-[1.02]"
          >
            <ExternalLink size={14} /> Lihat Web Publik
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 p-2.5 rounded-xl transition-all text-xs font-semibold hover:scale-105 touch-manipulation"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />} Tema
            </button>
            <button
              onClick={() => signOut()}
              className="flex-1 flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white p-2.5 rounded-xl transition-all text-xs font-semibold border border-red-200 dark:border-red-800/50 hover:border-red-500 hover:scale-105 touch-manipulation"
            >
              <Lock size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 text-slate-900 dark:text-slate-200 overflow-y-auto h-[100dvh] transition-colors relative z-0 custom-scrollbar min-w-0">
        {/* --- TAB: ANALYTICS --- */}
        {activeTab === "analytics" && (
          <div className="animate-fade-in-up space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-2">
              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg shadow-cyan-500/30">
                <ActivityIcon className="text-white w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Dasbor{" "}
                <span className="bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Analitik
                </span>
              </h1>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                {
                  label: "Total Kunjungan",
                  value: analyticsData.chartData.reduce(
                    (acc, item) => acc + (item.views || 0),
                    0,
                  ),
                  color: "from-cyan-500 to-cyan-600",
                  percentage: "w-full",
                },
                {
                  label: "Hari Ini",
                  value:
                    analyticsData.chartData.length > 0
                      ? analyticsData.chartData[
                          analyticsData.chartData.length - 1
                        ]?.views || 0
                      : 0,
                  color: "from-purple-500 to-purple-600",
                  percentage: "w-1/2",
                },
                {
                  label: "Rata² / Hari",
                  value:
                    analyticsData.chartData.length > 0
                      ? Math.round(
                          analyticsData.chartData.reduce(
                            (acc, item) => acc + (item.views || 0),
                            0,
                          ) / analyticsData.chartData.length,
                        )
                      : 0,
                  color: "from-amber-500 to-amber-600",
                  percentage: "w-2/3",
                },
                {
                  label: "Halaman Top",
                  value:
                    analyticsData.topPages.length > 0
                      ? analyticsData.topPages[0]?.path || "-"
                      : "-",
                  color: "from-green-500 to-green-600",
                  percentage: "w-4/5",
                  isText: true,
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] min-w-0"
                >
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                    {card.label}
                  </p>
                  <p
                    className={`text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 ${card.isText ? "text-lg sm:text-xl truncate" : ""}`}
                  >
                    {card.value}
                  </p>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${card.color} rounded-full ${card.percentage} animate-pulse`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              {/* Line Chart Traffic */}
              <div className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
                <h3 className="font-bold text-sm sm:text-lg text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-2">
                  <ActivityIcon size={18} className="text-cyan-500" /> Traffic
                  Kunjungan (7 Data Terakhir)
                </h3>
                <div className="h-[250px] sm:h-[300px] w-full -ml-4 sm:-ml-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsData.chartData}
                      margin={{ left: 0, right: 10, top: 5, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorViews"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#06b6d4"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#06b6d4"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? "#1e293b" : "#f1f5f9"}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        tickMargin={8}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                          backgroundColor:
                            theme === "dark"
                              ? "rgba(15,23,42,0.9)"
                              : "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(5px)",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="views"
                        name="Kunjungan"
                        stroke="#06b6d4"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#06b6d4",
                          strokeWidth: 2,
                          stroke: theme === "dark" ? "#0c0c1d" : "#fff",
                        }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: "#a855f7" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart Pages */}
              <div className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
                <h3 className="font-bold text-sm sm:text-lg text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-2">
                  <Star size={18} className="text-amber-500" /> Halaman
                  Terpopuler
                </h3>
                <div className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.topPages}
                      layout="vertical"
                      margin={{ left: -10, right: 10, top: 5, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="barGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop
                            offset="0%"
                            stopColor="#a855f7"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="#06b6d4"
                            stopOpacity={1}
                          />
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
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        dataKey="path"
                        type="category"
                        width={70}
                        tick={{
                          fontSize: 10,
                          fill: "#64748b",
                          fontWeight: 500,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{
                          fill:
                            theme === "dark"
                              ? "rgba(56,189,248,0.05)"
                              : "rgba(6,182,212,0.05)",
                        }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          backgroundColor:
                            theme === "dark"
                              ? "rgba(15,23,42,0.9)"
                              : "rgba(255,255,255,0.9)",
                          fontSize: "12px",
                        }}
                        labelStyle={{ display: "none" }}
                      />
                      <Bar
                        dataKey="views"
                        name="Kunjungan"
                        fill="url(#barGradient)"
                        radius={[0, 8, 8, 0]}
                        barSize={18}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: SETTINGS (PROFIL) --- */}
        {activeTab === "settings" && (
          <div className="animate-fade-in-up space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg shadow-cyan-500/30">
                  <Settings className="text-white w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Pengaturan{" "}
                  <span className="bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Web
                  </span>
                </h1>
              </div>
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className={`${isSaving ? "bg-slate-400" : "bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600"} text-white px-6 py-3 sm:py-3.5 rounded-2xl font-bold flex items-center gap-2.5 shadow-lg hover:shadow-cyan-500/40 transition-all w-full sm:w-auto hover:scale-105 active:scale-95 text-sm sm:text-base justify-center`}
              >
                <Save size={18} className={isSaving ? "animate-spin" : ""} />
                {isSaving ? "Menyimpan..." : "Simpan Profil"}
              </button>
            </div>

            <div className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 space-y-10">
              {/* Teks Utama */}
              <section>
                <h3 className="text-lg sm:text-xl font-bold border-b border-slate-200 dark:border-slate-800 pb-4 mb-8 flex items-center gap-3 text-slate-800 dark:text-white">
                  <FileText className="text-cyan-500" /> Konten Teks Utama
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {[
                    { label: "Nama Lengkap", key: "namaLengkap" },
                    { label: "Headline Pekerjaan", key: "headline" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={(webContent as any)[field.key]}
                        onChange={(e) =>
                          setWebContent({
                            ...webContent,
                            [field.key]: e.target.value,
                          })
                        }
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition text-sm sm:text-base text-slate-900 dark:text-white font-medium"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                    Tentang Saya (About)
                  </label>
                  <textarea
                    rows={4}
                    value={webContent.tentang}
                    onChange={(e) =>
                      setWebContent({ ...webContent, tentang: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-2xl outline-none resize-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition text-sm sm:text-base text-slate-900 dark:text-white font-medium"
                  ></textarea>
                </div>
              </section>

              {/* Upload Gambar */}
              <section>
                <h3 className="text-lg sm:text-xl font-bold border-b border-slate-200 dark:border-slate-800 pb-4 mb-8 flex items-center gap-3 text-slate-800 dark:text-white">
                  <ImageIcon className="text-cyan-500" /> Visual & Gambar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      label: "Gambar Hero (Beranda)",
                      key: "heroImage",
                      uploadKey: "heroImage",
                      uploadingId: "hero",
                    },
                    {
                      label: "Gambar About (Tentang)",
                      key: "aboutImage",
                      uploadKey: "aboutImage",
                      uploadingId: "about",
                    },
                  ].map((img) => (
                    <div
                      key={img.key}
                      className="border-2 border-dashed border-slate-200 dark:border-slate-700 p-6 rounded-3xl text-center bg-slate-50/50 dark:bg-[#131326]/30"
                    >
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                        {img.label}
                      </label>
                      {(webContent as any)[img.key] && (
                        <img
                          src={(webContent as any)[img.key]}
                          alt={img.key}
                          className="h-32 sm:h-40 mx-auto mb-5 object-cover rounded-2xl shadow-md"
                        />
                      )}
                      <label className="cursor-pointer bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 px-5 py-3 rounded-xl font-bold inline-flex items-center gap-2.5 hover:bg-cyan-200 dark:hover:bg-cyan-900 transition-all hover:scale-105 active:scale-95 text-sm disabled:opacity-50 disabled:pointer-events-none">
                        <UploadCloud size={16} />
                        {uploading === img.uploadingId
                          ? "Mengunggah..."
                          : "Ganti Gambar"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, img.uploadKey as any)
                          }
                          disabled={uploading !== null}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </section>

              {/* Sosmed */}
              <section>
                <h3 className="text-lg sm:text-xl font-bold border-b border-slate-200 dark:border-slate-800 pb-4 mb-8 flex items-center gap-3 text-slate-800 dark:text-white">
                  <LinkIcon className="text-cyan-500" /> Link Sosial Media &
                  Kontak
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: "Email Kontak", key: "email", type: "email" },
                    { label: "Link GitHub", key: "github", type: "text" },
                    { label: "Link LinkedIn", key: "linkedin", type: "text" },
                    { label: "Link Instagram", key: "instagram", type: "text" },
                  ].map((sosmed) => (
                    <div key={sosmed.key}>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                        {sosmed.label}
                      </label>
                      <input
                        type={sosmed.type}
                        value={(webContent as any)[sosmed.key]}
                        onChange={(e) =>
                          setWebContent({
                            ...webContent,
                            [sosmed.key]: e.target.value,
                          })
                        }
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 text-slate-900 dark:text-white font-medium text-sm"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* --- TAB: PORTFOLIO (KARYA) --- */}
        {activeTab === "portfolio" && (
          <div className="animate-fade-in-up space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg shadow-cyan-500/30">
                  <LayoutDashboard className="text-white w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Manajemen{" "}
                  <span className="bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Karya
                  </span>
                </h1>
              </div>
              <button
                onClick={() => setIsAddingKarya(!isAddingKarya)}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white px-6 py-3 sm:py-3.5 rounded-2xl font-bold flex items-center gap-2.5 shadow-lg transition-all w-full sm:w-auto hover:scale-105 justify-center text-sm sm:text-base"
              >
                {isAddingKarya ? <X size={18} /> : <PlusCircle size={18} />}
                {isAddingKarya ? "Batal" : "Tambah Karya"}
              </button>
            </div>

            {/* Form Tambah Karya */}
            {isAddingKarya && (
              <form
                onSubmit={handleSaveKarya}
                className="bg-white dark:bg-[#0c0c1d] p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 mb-8 border-t-4 border-t-cyan-500 animate-fade-in-up space-y-6"
              >
                <h3 className="font-bold text-lg sm:text-xl text-slate-800 dark:text-white flex items-center gap-2.5">
                  <PlusCircle className="text-cyan-500" /> Input Proyek Baru
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    required
                    type="text"
                    placeholder="Judul Proyek"
                    value={newKarya.judul}
                    onChange={(e) =>
                      setNewKarya({ ...newKarya, judul: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 text-slate-900 dark:text-white text-sm"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Kategori (misal: Web App)"
                    value={newKarya.kategori}
                    onChange={(e) =>
                      setNewKarya({ ...newKarya, kategori: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <textarea
                  required
                  placeholder="Deskripsi proyek..."
                  rows={3}
                  value={newKarya.deskripsi}
                  onChange={(e) =>
                    setNewKarya({ ...newKarya, deskripsi: e.target.value })
                  }
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-2xl outline-none resize-none focus:border-cyan-500 text-slate-900 dark:text-white text-sm"
                ></textarea>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                  <input
                    type="text"
                    placeholder="Link Project (Opsional)"
                    value={newKarya.link_project}
                    onChange={(e) =>
                      setNewKarya({ ...newKarya, link_project: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-cyan-500 text-slate-900 dark:text-white text-sm"
                  />
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="cursor-pointer flex-1 flex items-center justify-center gap-2.5 w-full px-5 py-3.5 bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 transition text-xs disabled:opacity-50">
                      <UploadCloud size={16} />{" "}
                      {uploading === "karya"
                        ? "Mengunggah..."
                        : "Upload Gambar"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "karyaImage")}
                        disabled={uploading !== null}
                      />
                    </label>
                    {newKarya.image_url && (
                      <img
                        src={newKarya.image_url}
                        alt="preview"
                        className="h-14 w-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-bold py-4 rounded-2xl transition hover:scale-[1.01] active:scale-95 disabled:opacity-70 text-sm"
                >
                  {isSaving ? "Menyimpan ke Database..." : "Simpan Proyek"}
                </button>
              </form>
            )}

            {/* Tabel List Karya */}
            <div className="bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#131326]/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="p-5 font-bold text-slate-700 dark:text-slate-300 text-sm">
                        Visual
                      </th>
                      <th className="p-5 font-bold text-slate-700 dark:text-slate-300 text-sm">
                        Judul & Kategori
                      </th>
                      <th className="p-5 font-bold text-slate-700 dark:text-slate-300 text-sm">
                        Deskripsi
                      </th>
                      <th className="p-5 font-bold text-slate-700 dark:text-slate-300 text-sm w-24 text-center">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {portfolios.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-[#131326]/30 transition group"
                      >
                        <td className="p-5">
                          <img
                            src={
                              item.image_url ||
                              "https://via.placeholder.com/150"
                            }
                            className="w-20 h-14 object-cover rounded-xl shadow group-hover:scale-105 transition"
                            alt={item.judul}
                          />
                        </td>
                        <td className="p-5">
                          <p className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
                            {item.judul}
                          </p>
                          <span className="text-xs bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full font-medium border border-cyan-100 dark:border-cyan-900">
                            {item.kategori}
                          </span>
                        </td>
                        <td className="p-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                          <p className="line-clamp-2">{item.deskripsi}</p>
                        </td>
                        <td className="p-5 text-center">
                          <button
                            onClick={() => handleDeleteKarya(item.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 p-3 rounded-xl transition hover:scale-110 active:scale-90"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {portfolios.length === 0 && (
                  <div className="text-center py-16 text-slate-500 dark:text-slate-600 text-sm">
                    Belum ada karya yang ditambahkan.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: RESUME (SKILLS & EXPERIENCE) --- */}
        {activeTab === "resume" && (
          <div className="animate-fade-in-up space-y-12">
            {/* Bagian Skills */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                  <Star className="text-white" size={24} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Keahlian <span className="text-amber-500">(Skills)</span>
                </h2>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddDynamic("skills", newSkill, () =>
                    setNewSkill({ nama_skill: "", persentase: "" }),
                  );
                }}
                className="flex flex-col sm:flex-row gap-4 mb-10 bg-white dark:bg-[#0c0c1d] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <input
                  required
                  type="text"
                  placeholder="Nama Skill (misal: ReactJS)"
                  value={newSkill.nama_skill}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, nama_skill: e.target.value })
                  }
                  className="flex-1 px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-amber-500 text-sm"
                />
                <input
                  required
                  type="number"
                  placeholder="Prsntse (0-100)"
                  min={0}
                  max={100}
                  value={newSkill.persentase}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, persentase: e.target.value })
                  }
                  className="w-full sm:w-36 px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-amber-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-7 py-3.5 font-bold rounded-xl shadow hover:scale-105 transition active:scale-95 text-sm"
                >
                  Tambah
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white dark:bg-[#0c0c1d] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center group hover:border-amber-500/30 transition shadow-sm hover:shadow-md"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="font-bold text-base text-slate-900 dark:text-white mb-2 truncate group-hover:text-amber-600 transition">
                        {s.nama_skill}
                      </p>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                          style={{ width: `${s.persentase}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-black mt-1.5">
                        {s.persentase}%
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteDynamic("skills", s.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 p-2 rounded-lg transition-all scale-90 group-hover:scale-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Bagian Experience */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <Briefcase className="text-white" size={24} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Pengalaman <span className="text-blue-500">Karir</span>
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
                className="bg-white dark:bg-[#0c0c1d] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-10 space-y-5"
              >
                <h4 className="font-bold text-lg text-slate-800 dark:text-white">
                  Form Pengalaman Baru
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    required
                    type="text"
                    placeholder="Posisi (misal: Senior Dev)"
                    value={newExp.posisi}
                    onChange={(e) =>
                      setNewExp({ ...newExp, posisi: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 text-sm"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Perusahaan"
                    value={newExp.perusahaan}
                    onChange={(e) =>
                      setNewExp({ ...newExp, perusahaan: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 text-sm"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Tahun (misal: 2020 - 2023)"
                    value={newExp.tahun}
                    onChange={(e) =>
                      setNewExp({ ...newExp, tahun: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 text-sm"
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
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none resize-none focus:border-blue-500 text-sm"
                ></textarea>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition text-sm disabled:opacity-50"
                >
                  Simpan Pengalaman Karir
                </button>
              </form>

              <div className="space-y-4">
                {experiences.map((e) => (
                  <div
                    key={e.id}
                    className="bg-white dark:bg-[#0c0c1d] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-start group hover:border-blue-500/30 transition shadow-sm hover:shadow-md"
                  >
                    <div className="flex-1 min-w-0 pr-5">
                      <p className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition">
                        {e.posisi}
                      </p>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
                        {e.perusahaan}{" "}
                        <span className="text-slate-400 dark:text-slate-600 ml-2">
                          | {e.tahun}
                        </span>
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {e.deskripsi}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteDynamic("experiences", e.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 p-2.5 rounded-lg transition-all flex-shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Bagian Services */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <Code className="text-white" size={24} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Layanan <span className="text-green-500">Utama</span>
                </h2>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddDynamic("services", newService, () =>
                    setNewService({ nama_layanan: "", deskripsi: "" }),
                  );
                }}
                className="flex flex-col sm:flex-row gap-4 mb-10 bg-white dark:bg-[#0c0c1d] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <input
                  required
                  type="text"
                  placeholder="Nama Layanan (misal: Web Dev)"
                  value={newService.nama_layanan}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      nama_layanan: e.target.value,
                    })
                  }
                  className="w-full sm:w-1/3 px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-green-500 text-sm"
                />
                <input
                  required
                  type="text"
                  placeholder="Deskripsi singkat layanan..."
                  value={newService.deskripsi}
                  onChange={(e) =>
                    setNewService({ ...newService, deskripsi: e.target.value })
                  }
                  className="flex-1 px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-green-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-7 py-3.5 font-bold rounded-xl shadow hover:scale-105 transition active:scale-95 text-sm disabled:opacity-50"
                >
                  Tambah
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white dark:bg-[#0c0c1d] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-start group hover:border-green-500/30 transition shadow-sm hover:shadow-md"
                  >
                    <div className="min-w-0 pr-4">
                      <p className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-green-600 transition truncate">
                        {s.nama_layanan}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {s.deskripsi}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteDynamic("services", s.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 p-2 rounded-lg transition-all flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* --- TAB: ACHIEVEMENTS (PENCAPAIAN) --- */}
        {activeTab === "achievements" && (
          <div className="animate-fade-in-up space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl shadow-lg">
                <Trophy className="text-white" size={24} />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Manajemen <span className="text-amber-500">Pencapaian</span>
              </h1>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddDynamic("achievements", newAchievement, () =>
                  setNewAchievement({ judul: "", tahun: "", deskripsi: "" }),
                );
              }}
              className="bg-white dark:bg-[#0c0c1d] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6"
            >
              <h3 className="font-bold text-xl text-slate-800 dark:text-white">
                Input Pencapaian / Penghargaan
              </h3>
              <div className="grid md:grid-cols-4 gap-5">
                <input
                  required
                  type="text"
                  placeholder="Judul (misal: Juara 1 UI/UX)"
                  value={newAchievement.judul}
                  onChange={(e) =>
                    setNewAchievement({
                      ...newAchievement,
                      judul: e.target.value,
                    })
                  }
                  className="md:col-span-3 px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-amber-500 text-sm"
                />
                <input
                  required
                  type="text"
                  placeholder="Tahun"
                  value={newAchievement.tahun}
                  onChange={(e) =>
                    setNewAchievement({
                      ...newAchievement,
                      tahun: e.target.value,
                    })
                  }
                  className="px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-amber-500 text-sm"
                />
              </div>
              <input
                required
                type="text"
                placeholder="Deskripsi singkat atau penyelenggara..."
                value={newAchievement.deskripsi}
                onChange={(e) =>
                  setNewAchievement({
                    ...newAchievement,
                    deskripsi: e.target.value,
                  })
                }
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-amber-500 text-sm"
              />
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold py-3.5 rounded-xl transition hover:scale-[1.01] active:scale-95 disabled:opacity-50 text-sm"
              >
                Simpan Pencapaian
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-white dark:bg-[#0c0c1d] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-start group hover:border-amber-500/30 transition shadow-sm hover:shadow-md"
                >
                  <div className="min-w-0 pr-4">
                    <span className="inline-block text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-3 py-1 rounded-full mb-3 border border-amber-100 dark:border-amber-900">
                      {ach.tahun}
                    </span>
                    <p className="font-bold text-lg text-slate-900 dark:text-white mb-1.5 group-hover:text-amber-600 transition leading-tight">
                      {ach.judul}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {ach.deskripsi}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteDynamic("achievements", ach.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 p-2 rounded-lg transition-all flex-shrink-0 scale-90 group-hover:scale-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB: USES (SETUP) --- */}
        {activeTab === "uses" && (
          <div className="animate-fade-in-up space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg">
                <Monitor className="text-white" size={24} />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Setup <span className="text-indigo-500">& Alat Tempur</span>
              </h1>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddDynamic("uses_setup", newUse, () =>
                  setNewUse({
                    kategori: "Hardware (Workstation)",
                    nama_item: "",
                    deskripsi: "",
                  }),
                );
              }}
              className="bg-white dark:bg-[#0c0c1d] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6"
            >
              <h3 className="font-bold text-xl text-slate-800 dark:text-white">
                Input Alat / Software Baru
              </h3>
              <div className="grid md:grid-cols-3 gap-5">
                <select
                  value={newUse.kategori}
                  onChange={(e) =>
                    setNewUse({ ...newUse, kategori: e.target.value })
                  }
                  className="px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-sm text-slate-700 dark:text-slate-300"
                >
                  <option value="Hardware (Workstation)">
                    Hardware (Workstation)
                  </option>
                  <option value="Software & Tools">Software & Tools</option>
                  <option value="OS & Terminal">OS & Terminal</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <input
                  required
                  type="text"
                  placeholder="Nama Alat/Soft (misal: Macbook Pro)"
                  value={newUse.nama_item}
                  onChange={(e) =>
                    setNewUse({ ...newUse, nama_item: e.target.value })
                  }
                  className="md:col-span-2 px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <input
                required
                type="text"
                placeholder="Deskripsi singkat atau alasan pakai..."
                value={newUse.deskripsi}
                onChange={(e) =>
                  setNewUse({ ...newUse, deskripsi: e.target.value })
                }
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-sm"
              />
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold py-3.5 rounded-xl transition hover:scale-[1.01] active:scale-95 disabled:opacity-50 text-sm"
              >
                Simpan Alat Tempur
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {uses.map((u) => (
                <div
                  key={u.id}
                  className="bg-white dark:bg-[#0c0c1d] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-start group hover:border-indigo-500/30 transition shadow-sm hover:shadow-md"
                >
                  <div className="min-w-0 pr-4">
                    <span className="inline-block text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full mb-3 border border-indigo-100 dark:border-indigo-900">
                      {u.kategori}
                    </span>
                    <p className="font-bold text-lg text-slate-900 dark:text-white mb-1.5 group-hover:text-indigo-600 transition truncate leading-tight">
                      {u.nama_item}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {u.deskripsi}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteDynamic("uses_setup", u.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 p-2 rounded-lg transition-all flex-shrink-0 scale-90 group-hover:scale-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB: BLOG & ARTIKEL --- */}
        {activeTab === "blog" && (
          <div className="animate-fade-in-up space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                <BookOpen className="text-white" size={24} />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Manajemen <span className="text-purple-500">Blog</span>
              </h1>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddDynamic("blogs", newBlog, () =>
                  setNewBlog({ judul: "", konten_lengkap: "" }),
                );
              }}
              className="bg-white dark:bg-[#0c0c1d] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6"
            >
              <h3 className="font-bold text-xl text-slate-800 dark:text-white">
                Tulis Artikel Baru
              </h3>
              <input
                required
                type="text"
                placeholder="Judul Artikel Menarik"
                value={newBlog.judul}
                onChange={(e) =>
                  setNewBlog({ ...newBlog, judul: e.target.value })
                }
                className="w-full px-5 py-4 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-purple-500 font-medium text-slate-900 dark:text-white text-base"
              />
              <textarea
                required
                placeholder="Tulis konten lengkap artikel di sini (mendukung Markdown)..."
                rows={10}
                value={newBlog.konten_lengkap}
                onChange={(e) =>
                  setNewBlog({ ...newBlog, konten_lengkap: e.target.value })
                }
                className="w-full px-5 py-4 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-2xl outline-none resize-none focus:border-purple-500 text-sm leading-relaxed text-slate-800 dark:text-slate-300 font-mono"
              ></textarea>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-4 rounded-2xl transition hover:scale-[1.01] active:scale-95 disabled:opacity-50 text-base shadow-lg shadow-purple-500/20"
              >
                Publikasikan Artikel
              </button>
            </form>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {blogs.map((b) => (
                <div
                  key={b.id}
                  className="bg-white dark:bg-[#0c0c1d] p-7 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col group hover:border-purple-500/30 transition shadow-sm hover:shadow-xl"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white leading-tight group-hover:text-purple-600 transition line-clamp-2">
                      {b.judul}
                    </h3>
                    <button
                      onClick={() => handleDeleteDynamic("blogs", b.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 p-2.5 rounded-xl transition-all flex-shrink-0 scale-90 group-hover:scale-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-1">
                    {b.konten_lengkap}
                  </p>
                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-5 mt-auto">
                    <span className="text-xs text-slate-400 dark:text-slate-600 font-medium">
                      ID: {b.id}
                    </span>
                    <span className="text-xs bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-4 py-1.5 rounded-full font-bold border border-purple-100 dark:border-purple-900">
                      {new Date(b.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {blogs.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-[#0c0c1d] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner">
                <BookOpen
                  size={48}
                  className="mx-auto text-slate-200 dark:text-slate-800 mb-6"
                />
                <p className="text-slate-500 dark:text-slate-600 text-lg font-medium">
                  Belum ada artikel blog.
                </p>
                <p className="text-slate-400 dark:text-slate-700 text-sm mt-1">
                  Mulai tulis artikel pertamamu di form atas!
                </p>
              </div>
            )}
          </div>
        )}

        {/* --- TAB: PRICING (PAKET HARGA) --- */}
        {activeTab === "pricing" && (
          <div className="animate-fade-in-up space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-gradient-to-br from-green-400 to-cyan-500 rounded-2xl shadow-lg">
                <Tag className="text-white" size={24} />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Skema <span className="text-green-500">Harga</span>
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
              className="bg-white dark:bg-[#0c0c1d] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6"
            >
              <h3 className="font-bold text-xl text-slate-800 dark:text-white">
                Buat Paket Harga Baru
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                <input
                  required
                  type="text"
                  placeholder="Nama Paket (misal: MVP Plan)"
                  value={newPricing.nama_paket}
                  onChange={(e) =>
                    setNewPricing({ ...newPricing, nama_paket: e.target.value })
                  }
                  className="px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-green-500 text-sm"
                />
                <input
                  required
                  type="text"
                  placeholder="Harga (misal: Rp 15jt atau Start from...)"
                  value={newPricing.harga}
                  onChange={(e) =>
                    setNewPricing({ ...newPricing, harga: e.target.value })
                  }
                  className="px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-green-500 text-sm"
                />
              </div>
              <input
                required
                type="text"
                placeholder="Deskripsi singkat paket..."
                value={newPricing.deskripsi}
                onChange={(e) =>
                  setNewPricing({ ...newPricing, deskripsi: e.target.value })
                }
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-green-500 text-sm"
              />
              <input
                required
                type="text"
                placeholder="Fitur utama (pisahkan dengan koma, misal: 5 Halaman, Revisi 3x)"
                value={newPricing.fitur}
                onChange={(e) =>
                  setNewPricing({ ...newPricing, fitur: e.target.value })
                }
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#131326] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-green-500 text-sm"
              />
              <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-600 dark:text-slate-400 p-4 bg-slate-50 dark:bg-[#131326] rounded-xl border border-slate-100 dark:border-slate-700">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-green-500"
                  checked={newPricing.is_popular === 1}
                  onChange={(e) =>
                    setNewPricing({
                      ...newPricing,
                      is_popular: e.target.checked ? 1 : 0,
                    })
                  }
                />
                Set sebagai paket{" "}
                <span className="font-bold text-green-600">
                  "Paling Populer"
                </span>{" "}
                (akan dighlight)
              </label>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold py-3.5 rounded-xl transition hover:scale-[1.01] active:scale-95 disabled:opacity-50 text-sm shadow-lg shadow-green-500/20"
              >
                Simpan Paket Harga
              </button>
            </form>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pricing.map((p) => (
                <div
                  key={p.id}
                  className={`bg-white dark:bg-[#0c0c1d] p-7 rounded-3xl border relative transition group hover:shadow-2xl ${p.is_popular ? "border-green-500 shadow-xl ring-2 ring-green-500/20" : "border-slate-200 dark:border-slate-800 shadow"}`}
                >
                  <button
                    onClick={() => handleDeleteDynamic("pricing", p.id)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 p-2 rounded-lg transition-all scale-90 group-hover:scale-100 z-10"
                  >
                    <Trash2 size={16} />
                  </button>
                  {p.is_popular ? (
                    <span className="absolute -top-3 left-6 bg-gradient-to-r from-green-500 to-cyan-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md tracking-wide">
                      🌟 POPULER
                    </span>
                  ) : null}
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 mt-2">
                    {p.nama_paket}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mb-5">
                    {p.deskripsi}
                  </p>
                  <p className="text-3xl font-black text-green-600 dark:text-green-500 mb-6">
                    {p.harga}
                  </p>
                  <div className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-5">
                    {p.fitur?.split(",").map((f: string, i: number) => (
                      <p key={i} className="flex items-center gap-2.5">
                        <PlusCircle
                          size={14}
                          className="text-green-400 dark:text-green-600"
                        />{" "}
                        {f.trim()}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB: PESAN MASUK --- */}
        {activeTab === "pesan" && (
          <div className="animate-fade-in-up space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl shadow-lg">
                <MessageSquare className="text-white" size={24} />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Pesan <span className="text-rose-500">Masuk</span>
              </h1>
            </div>

            <div className="bg-white dark:bg-[#0c0c1d] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner space-y-6">
              {pesanMasuk.length === 0 && (
                <div className="text-center py-20 text-slate-500 dark:text-slate-600 space-y-4">
                  <MessageSquare size={48} className="mx-auto opacity-20" />
                  <p className="font-medium text-lg">Inbox kosong, Bos.</p>
                  <p className="text-sm">
                    Belum ada pesan dari pengunjung web publik.
                  </p>
                </div>
              )}
              {pesanMasuk.map((msg) => {
                // Handle MySQL datetime format (replace space with T, add Z)
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
                    className="bg-slate-50 dark:bg-[#131326] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 relative group hover:border-rose-300 dark:hover:border-rose-900 transition shadow-sm hover:shadow-md"
                  >
                    <button
                      onClick={() => handleDeleteDynamic("pesan", msg.id)}
                      className="absolute top-4 right-4 text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-950 p-2.5 rounded-xl transition-all scale-90 group-hover:scale-100"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="flex items-center gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                        {msg.nama?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                          {msg.nama}
                        </p>
                        <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">
                          {msg.email}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-[#0c0c1d] p-5 rounded-xl border border-slate-100 dark:border-slate-800/50 shadow-inner whitespace-pre-wrap">
                      {msg.pesan}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-5 font-mono text-right">
                      Diterima: {waktuWIB} WIB
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
