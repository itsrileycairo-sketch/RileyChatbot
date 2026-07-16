'use client';
import { useState, useEffect } from 'react';
import {
  PlusCircle, Trash2, LayoutDashboard, Settings, Code, Save,
  Image as ImageIcon, Link, UploadCloud, X, Lock, Unlock,
  Briefcase, Star, FileText, Menu
} from 'lucide-react';

export default function AdminDashboard() {
  // === SISTEM KEAMANAN (LOGIN) ===
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === 'rileycairo') {
      setIsLocked(false);
    } else {
      alert('TETOT! PIN Salah bosku! 🚨');
      setPin('');
    }
  };

  // === STATE APLIKASI ===
  const [activeTab, setActiveTab] = useState<'settings' | 'portfolio' | 'resume'>('settings');
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState<'hero' | 'about' | 'karya' | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Untuk toggle sidebar di mobile

  // Data State
  const [webContent, setWebContent] = useState({
    namaLengkap: '', headline: '', tentang: '', email: '',
    heroImage: '', aboutImage: '', github: '', linkedin: '', instagram: ''
  });
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  // Form State
  const [isAddingKarya, setIsAddingKarya] = useState(false);
  const [newKarya, setNewKarya] = useState({
    judul: '', kategori: '', deskripsi: '', image_url: '', link_project: ''
  });

  const [newSkill, setNewSkill] = useState({ nama_skill: '', persentase: '' });
  const [newExp, setNewExp] = useState({ posisi: '', perusahaan: '', tahun: '', deskripsi: '' });
  const [newService, setNewService] = useState({ nama_layanan: '', deskripsi: '' });

  // === FETCH DATA AWAL ===
  useEffect(() => {
    if (!isLocked) {
      const fetchData = async () => {
        try {
          const resProfile = await fetch('/api/profile');
          if (resProfile.ok) {
            const data = await resProfile.json();
            setWebContent({
              namaLengkap: data.nama_lengkap || '',
              headline: data.headline || '',
              tentang: data.tentang || '',
              email: data.email || '',
              heroImage: data.hero_image || '',
              aboutImage: data.about_image || '',
              github: data.github_link || '',
              linkedin: data.linkedin_link || '',
              instagram: data.instagram_link || ''
            });
          }
          fetchSemuaData();
        } catch (error) {
          console.error("Gagal load DB");
        }
      };
      fetchData();
    }
  }, [isLocked]);

  const fetchSemuaData = async () => {
    const res = await fetch('/api/portfolio');
    if (res.ok) {
      const data = await res.json();
      setPortfolios(data.karya || []);
      setSkills(data.skills || []);
      setExperiences(data.experiences || []);
      setServices(data.services || []);
    }
  };

  // === HANDLER SIMPAN & HAPUS ===
  const handleAddDynamic = async (table: string, data: any, resetForm: () => void) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, data })
      });
      if (res.ok) {
        resetForm();
        fetchSemuaData();
      } else {
        alert('Gagal menambah data!');
      }
    } catch (error) {
      alert('Terjadi kesalahan server.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDynamic = async (table: string, id: number) => {
    if (!confirm('Yakin mau hapus data ini?')) return;
    try {
      const res = await fetch(`/api/admin-data?table=${table}&id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchSemuaData();
    } catch (error) {
      alert('Gagal menghapus');
    }
  };

  const handleDeleteKarya = async (id: number) => {
    if (!confirm('Yakin ingin menghapus karya ini?')) return;
    try {
      const res = await fetch(`/api/portfolio?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchSemuaData();
    } catch (error) {
      alert('Gagal menghapus');
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'heroImage' | 'aboutImage' | 'karyaImage'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field === 'heroImage' ? 'hero' : field === 'aboutImage' ? 'about' : 'karya');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        if (field === 'karyaImage') setNewKarya(prev => ({ ...prev, image_url: data.fileUrl }));
        else setWebContent(prev => ({ ...prev, [field]: data.fileUrl }));
      } else alert('Gagal unggah gambar!');
    } catch (err) {
      alert('Terjadi kesalahan unggah.');
    } finally {
      setUploading(null);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama_lengkap: webContent.namaLengkap,
          headline: webContent.headline,
          tentang: webContent.tentang,
          email: webContent.email,
          hero_image: webContent.heroImage,
          about_image: webContent.aboutImage,
          github_link: webContent.github,
          linkedin_link: webContent.linkedin,
          instagram_link: webContent.instagram
        })
      });
      if (res.ok) alert('Pengaturan Web berhasil disimpan!');
    } catch (error) {
      alert('Server error!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveKarya = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKarya)
      });
      if (res.ok) {
        alert('Karya berhasil ditambahkan!');
        setIsAddingKarya(false);
        setNewKarya({ judul: '', kategori: '', deskripsi: '', image_url: '', link_project: '' });
        fetchSemuaData();
      }
    } catch (error) {
      alert('Gagal menambah karya');
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // TAMPILAN HALAMAN LOGIN (GEMBOK)
  // ==========================================
  if (isLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex flex-col items-center justify-center p-4 selection:bg-blue-500">
        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md text-center border-t-8 border-blue-600">
          <div className="bg-blue-100 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Area Terlarang!</h1>
          <p className="text-slate-500 mb-8 font-medium">
            Masukkan PIN rahasia untuk mengakses brankas CMS Riley.
          </p>
          <form onSubmit={handleLogin} className="space-y-4" suppressHydrationWarning>
            <input
              suppressHydrationWarning
              type="password"
              placeholder="••••••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center tracking-[0.5em] text-2xl px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold"
              required
            />
            <button
              suppressHydrationWarning
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <Unlock size={20} /> Buka Gembok
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN DASHBOARD (SETELAH LOGIN)
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Tombol hamburger mobile */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm border-b">
        <div className="text-2xl font-black text-blue-600 flex items-center gap-2">
          <Code size={24} /> CMS Riley
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 hover:text-blue-600 transition"
        >
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block md:w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20 md:z-10 absolute md:relative w-64 h-full transition-all duration-300`}
      >
        <div className="p-6 text-2xl font-black border-b border-slate-800 flex items-center gap-3 hidden md:flex">
          <Code className="text-blue-400" size={28} /> CMS Riley
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li
              onClick={() => {
                setActiveTab('settings');
                setSidebarOpen(false);
              }}
              className={`p-3 rounded-lg font-medium cursor-pointer transition flex items-center gap-3 ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Settings size={20} /> Profil Web
            </li>
            <li
              onClick={() => {
                setActiveTab('portfolio');
                setSidebarOpen(false);
              }}
              className={`p-3 rounded-lg font-medium cursor-pointer transition flex items-center gap-3 ${
                activeTab === 'portfolio'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <LayoutDashboard size={20} /> Portofolio
            </li>
            <li
              onClick={() => {
                setActiveTab('resume');
                setSidebarOpen(false);
              }}
              className={`p-3 rounded-lg font-medium cursor-pointer transition flex items-center gap-3 ${
                activeTab === 'resume'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <FileText size={20} /> Resume & Layanan
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setIsLocked(true)}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-lg transition font-bold"
          >
            <Lock size={18} /> Kunci Kembali
          </button>
        </div>
      </aside>

      {/* Overlay untuk sidebar mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 text-gray-900 overflow-y-auto h-screen bg-white md:bg-gray-50">
        {/* TAB 1: PENGATURAN WEB */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Pengaturan Profil
              </h1>
              <button
                suppressHydrationWarning
                onClick={handleSaveSettings}
                disabled={isSaving}
                className={`${
                  isSaving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                } text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg transition w-full sm:w-auto`}
              >
                <Save size={20} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
              <div>
                <h3 className="text-xl font-bold border-b pb-2 mb-4 flex items-center gap-2">
                  <Settings size={20} /> Teks Utama
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nama Lengkap (Hero Title)
                    </label>
                    <input
                      type="text"
                      value={webContent.namaLengkap}
                      onChange={(e) =>
                        setWebContent({ ...webContent, namaLengkap: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Headline Pekerjaan
                    </label>
                    <input
                      type="text"
                      value={webContent.headline}
                      onChange={(e) =>
                        setWebContent({ ...webContent, headline: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Paragraf "Tentang Saya"
                  </label>
                  <textarea
                    rows={4}
                    value={webContent.tentang}
                    onChange={(e) =>
                      setWebContent({ ...webContent, tentang: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500 transition"
                  ></textarea>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold border-b pb-2 mb-4 flex items-center gap-2">
                  <ImageIcon size={20} /> Pengaturan Gambar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center hover:bg-gray-50 transition">
                    <label className="block text-sm font-bold text-gray-700 mb-4">
                      Gambar Beranda (Hero)
                    </label>
                    {webContent.heroImage && (
                      <img
                        src={webContent.heroImage}
                        className="h-32 mx-auto mb-4 object-cover rounded-lg shadow"
                      />
                    )}
                    <label className="cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2 hover:bg-blue-200 transition">
                      <UploadCloud size={18} />{' '}
                      {uploading === 'hero' ? 'Mengunggah...' : 'Pilih File Gambar'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'heroImage')}
                        disabled={uploading !== null}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold border-b pb-2 mb-4 flex items-center gap-2">
                  <Link size={20} /> Sosial Media & Kontak
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={webContent.email}
                      onChange={(e) =>
                        setWebContent({ ...webContent, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Link GitHub
                    </label>
                    <input
                      type="text"
                      value={webContent.github}
                      onChange={(e) =>
                        setWebContent({ ...webContent, github: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Link LinkedIn
                    </label>
                    <input
                      type="text"
                      value={webContent.linkedin}
                      onChange={(e) =>
                        setWebContent({ ...webContent, linkedin: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Link Instagram
                    </label>
                    <input
                      type="text"
                      value={webContent.instagram}
                      onChange={(e) =>
                        setWebContent({ ...webContent, instagram: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PORTOFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Manajemen Karya
              </h1>
              <button
                onClick={() => setIsAddingKarya(!isAddingKarya)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg transition w-full sm:w-auto"
              >
                {isAddingKarya ? <X size={20} /> : <PlusCircle size={20} />}
                {isAddingKarya ? 'Batal Tambah' : 'Tambah Karya'}
              </button>
            </div>

            {isAddingKarya && (
              <form
                onSubmit={handleSaveKarya}
                className="bg-white p-6 rounded-2xl shadow-md border border-blue-200 mb-8 border-t-4 border-t-blue-600"
              >
                <h3 className="font-bold text-xl mb-4 text-blue-800">
                  Form Karya Baru
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Judul Proyek
                    </label>
                    <input
                      required
                      type="text"
                      value={newKarya.judul}
                      onChange={(e) =>
                        setNewKarya({ ...newKarya, judul: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Kategori
                    </label>
                    <input
                      required
                      type="text"
                      value={newKarya.kategori}
                      onChange={(e) =>
                        setNewKarya({ ...newKarya, kategori: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newKarya.deskripsi}
                    onChange={(e) =>
                      setNewKarya({ ...newKarya, deskripsi: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Link Project
                    </label>
                    <input
                      type="text"
                      value={newKarya.link_project}
                      onChange={(e) =>
                        setNewKarya({ ...newKarya, link_project: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Upload Gambar
                    </label>
                    <label className="cursor-pointer bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2 hover:bg-gray-200 transition">
                      <UploadCloud size={18} />{' '}
                      {uploading === 'karya' ? 'Mengunggah...' : 'Pilih File'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'karyaImage')}
                        disabled={uploading !== null}
                      />
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Simpan Proyek
                </button>
              </form>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="p-4 font-semibold text-gray-600">Detail Karya</th>
                    <th className="p-4 font-semibold text-gray-600 w-32 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolios.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="p-4 flex items-center gap-4">
                        <img
                          src={item.image_url || 'https://via.placeholder.com/150'}
                          className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-bold text-sm md:text-base">{item.judul}</h3>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {item.kategori}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteKarya(item.id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: RESUME, SKILLS, SERVICES */}
        {activeTab === 'resume' && (
          <div className="animate-fade-in-up space-y-10">
            {/* SKILLS */}
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
                <Star className="text-yellow-500" /> Manajemen Keahlian
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddDynamic('skills', newSkill, () =>
                    setNewSkill({ nama_skill: '', persentase: '' })
                  );
                }}
                className="flex flex-col sm:flex-row gap-3 mb-6"
              >
                <input
                  required
                  type="text"
                  placeholder="Nama Skill (Misal: Next.js)"
                  value={newSkill.nama_skill}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, nama_skill: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  required
                  type="number"
                  placeholder="Persentase (0-100)"
                  value={newSkill.persentase}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, persentase: e.target.value })
                  }
                  className="w-full sm:w-48 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 text-white px-6 py-2 font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1"
                >
                  <PlusCircle size={20} /> Tambah
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm hover:shadow-md transition"
                  >
                    <div>
                      <p className="font-bold text-gray-800">{s.nama_skill}</p>
                      <p className="text-sm text-blue-600 font-black">{s.persentase}%</p>
                    </div>
                    <button
                      onClick={() => handleDeleteDynamic('skills', s.id)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* PENGALAMAN */}
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
                <Briefcase className="text-blue-500" /> Pengalaman Karir
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddDynamic('experiences', newExp, () =>
                    setNewExp({ posisi: '', perusahaan: '', tahun: '', deskripsi: '' })
                  );
                }}
                className="bg-white p-6 rounded-xl border shadow-sm mb-6 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    required
                    type="text"
                    placeholder="Posisi"
                    value={newExp.posisi}
                    onChange={(e) =>
                      setNewExp({ ...newExp, posisi: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Perusahaan"
                    value={newExp.perusahaan}
                    onChange={(e) =>
                      setNewExp({ ...newExp, perusahaan: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Tahun"
                    value={newExp.tahun}
                    onChange={(e) =>
                      setNewExp({ ...newExp, tahun: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 text-white px-6 py-2 w-full font-bold rounded-lg hover:bg-blue-700 transition"
                >
                  Simpan Pengalaman
                </button>
              </form>
              <div className="space-y-3">
                {experiences.map((e) => (
                  <div
                    key={e.id}
                    className="bg-white p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">
                        {e.posisi}{' '}
                        <span className="text-sm font-normal text-gray-500">
                          di {e.perusahaan} ({e.tahun})
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{e.deskripsi}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteDynamic('experiences', e.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded ml-auto mt-2 sm:mt-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* LAYANAN */}
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
                <Code className="text-green-500" /> Manajemen Layanan Utama
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddDynamic('services', newService, () =>
                    setNewService({ nama_layanan: '', deskripsi: '' })
                  );
                }}
                className="flex flex-col sm:flex-row gap-3 mb-6"
              >
                <input
                  required
                  type="text"
                  placeholder="Nama Layanan"
                  value={newService.nama_layanan}
                  onChange={(e) =>
                    setNewService({ ...newService, nama_layanan: e.target.value })
                  }
                  className="w-full sm:w-1/3 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  required
                  type="text"
                  placeholder="Deskripsi Singkat..."
                  value={newService.deskripsi}
                  onChange={(e) =>
                    setNewService({ ...newService, deskripsi: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 text-white px-6 py-2 font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1"
                >
                  <PlusCircle size={20} /> Tambah
                </button>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white p-4 rounded-xl border flex justify-between items-start shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-gray-800">{s.nama_layanan}</p>
                      <p className="text-sm text-gray-500">{s.deskripsi}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteDynamic('services', s.id)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}