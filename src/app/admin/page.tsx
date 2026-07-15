'use client';
import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, LayoutDashboard, Settings, Code, Save, Image as ImageIcon, Link, UploadCloud, X } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'settings' | 'portfolio'>('settings');
  
  // State Pengaturan Web
  const [webContent, setWebContent] = useState({
    namaLengkap: '', headline: '', tentang: '', email: '',
    heroImage: '', aboutImage: '', github: '', linkedin: '', instagram: ''
  });
  
  // State Portofolio
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [isAddingKarya, setIsAddingKarya] = useState(false);
  const [newKarya, setNewKarya] = useState({ judul: '', kategori: '', deskripsi: '', image_url: '', link_project: '' });
  
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState<'hero' | 'about' | 'karya' | null>(null);

  // Fetch Data Awal
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Web Profile
        const resProfile = await fetch('/api/profile');
        if (resProfile.ok) {
          const data = await resProfile.json();
          setWebContent({
            namaLengkap: data.nama_lengkap || '', headline: data.headline || '', tentang: data.tentang || '',
            email: data.email || '', heroImage: data.hero_image || '', aboutImage: data.about_image || '',
            github: data.github_link || '', linkedin: data.linkedin_link || '', instagram: data.instagram_link || ''
          });
        }
        // Fetch Portofolio
        fetchPortfolios();
      } catch (error) { console.error("Gagal load DB"); }
    };
    fetchData();
  }, []);

  const fetchPortfolios = async () => {
    const res = await fetch('/api/portfolio');
    if (res.ok) setPortfolios(await res.json());
  };

  // Handler Upload Gambar Fisik
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'heroImage' | 'aboutImage' | 'karyaImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field === 'heroImage' ? 'hero' : field === 'aboutImage' ? 'about' : 'karya');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        if (field === 'karyaImage') {
          setNewKarya(prev => ({ ...prev, image_url: data.fileUrl }));
        } else {
          setWebContent(prev => ({ ...prev, [field]: data.fileUrl }));
        }
      } else { alert('Gagal unggah gambar!'); }
    } catch (err) { alert('Terjadi kesalahan unggah.'); } 
    finally { setUploading(null); }
  };

  // Simpan Pengaturan Web
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama_lengkap: webContent.namaLengkap, headline: webContent.headline, tentang: webContent.tentang,
          email: webContent.email, hero_image: webContent.heroImage, about_image: webContent.aboutImage,
          github_link: webContent.github, linkedin_link: webContent.linkedin, instagram_link: webContent.instagram
        })
      });
      if (res.ok) alert('Pengaturan Web berhasil disimpan!');
    } catch (error) { alert('Server error!'); } 
    finally { setIsSaving(false); }
  };

  // Simpan Karya Baru
  const handleSaveKarya = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKarya)
      });
      if (res.ok) {
        alert('Karya berhasil ditambahkan!');
        setIsAddingKarya(false);
        setNewKarya({ judul: '', kategori: '', deskripsi: '', image_url: '', link_project: '' });
        fetchPortfolios(); // Refresh tabel
      }
    } catch (error) { alert('Gagal menambah karya'); }
    finally { setIsSaving(false); }
  };

  // Hapus Karya
  const handleDeleteKarya = async (id: number) => {
    if (!confirm('Yakin ingin menghapus karya ini?')) return;
    try {
      const res = await fetch(`/api/portfolio?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchPortfolios();
    } catch (error) { alert('Gagal menghapus'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl">
        <div className="p-6 text-2xl font-black border-b border-slate-800 flex items-center gap-3">
          <Code className="text-blue-400" size={28} /> CMS Riley
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li onClick={() => setActiveTab('settings')} className={`p-3 rounded-lg font-medium cursor-pointer transition flex items-center gap-3 ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}><Settings size={20} /> Pengaturan Web</li>
            <li onClick={() => setActiveTab('portfolio')} className={`p-3 rounded-lg font-medium cursor-pointer transition flex items-center gap-3 ${activeTab === 'portfolio' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}><LayoutDashboard size={20} /> Data Portofolio</li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-10 text-gray-900 overflow-y-auto h-screen">
        {/* --- TAB PENGATURAN WEB --- */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Pengaturan Konten Frontend</h1>
              </div>
              <button suppressHydrationWarning onClick={handleSaveSettings} disabled={isSaving} className={`${isSaving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition`}>
                <Save size={20} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
              <div>
                <h3 className="text-xl font-bold border-b pb-2 mb-4 flex items-center gap-2"><Settings size={20}/> Teks Utama</h3>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap (Hero Title)</label>
                    <input suppressHydrationWarning type="text" value={webContent.namaLengkap} onChange={(e) => setWebContent({...webContent, namaLengkap: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Headline Pekerjaan / Status</label>
                    <input suppressHydrationWarning type="text" value={webContent.headline} onChange={(e) => setWebContent({...webContent, headline: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Paragraf "Tentang Saya"</label>
                  <textarea suppressHydrationWarning rows={4} value={webContent.tentang} onChange={(e) => setWebContent({...webContent, tentang: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none"></textarea>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold border-b pb-2 mb-4 flex items-center gap-2"><ImageIcon size={20}/> Pengaturan Gambar</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center hover:bg-gray-50 transition">
                    <label className="block text-sm font-bold text-gray-700 mb-4">Gambar Beranda (Hero)</label>
                    {webContent.heroImage && <img src={webContent.heroImage} className="h-32 mx-auto mb-4 object-cover rounded-lg shadow" />}
                    <label className="cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2">
                      <UploadCloud size={18} /> {uploading === 'hero' ? 'Mengunggah...' : 'Pilih File Gambar'}
                      <input suppressHydrationWarning type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'heroImage')} disabled={uploading !== null} />
                    </label>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center hover:bg-gray-50 transition">
                    <label className="block text-sm font-bold text-gray-700 mb-4">Gambar Tentang (About)</label>
                    {webContent.aboutImage && <img src={webContent.aboutImage} className="h-32 mx-auto mb-4 object-cover rounded-lg shadow" />}
                    <label className="cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2">
                      <UploadCloud size={18} /> {uploading === 'about' ? 'Mengunggah...' : 'Pilih File Gambar'}
                      <input suppressHydrationWarning type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'aboutImage')} disabled={uploading !== null} />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold border-b pb-2 mb-4 flex items-center gap-2"><Link size={20}/> Sosial Media & Kontak</h3>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Email</label><input suppressHydrationWarning type="email" value={webContent.email} onChange={(e) => setWebContent({...webContent, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Link GitHub</label><input suppressHydrationWarning type="text" value={webContent.github} onChange={(e) => setWebContent({...webContent, github: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Link LinkedIn</label><input suppressHydrationWarning type="text" value={webContent.linkedin} onChange={(e) => setWebContent({...webContent, linkedin: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Link Instagram</label><input suppressHydrationWarning type="text" value={webContent.instagram} onChange={(e) => setWebContent({...webContent, instagram: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" /></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB DATA PORTOFOLIO --- */}
        {activeTab === 'portfolio' && (
           <div className="animate-fade-in-up">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Karya</h1>
                <button onClick={() => setIsAddingKarya(!isAddingKarya)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg transition">
                  {isAddingKarya ? <X size={20} /> : <PlusCircle size={20} />}
                  {isAddingKarya ? 'Batal Tambah' : 'Tambah Karya'}
                </button>
              </div>

              {/* FORM TAMBAH KARYA */}
              {isAddingKarya && (
                <form onSubmit={handleSaveKarya} className="bg-white p-6 rounded-2xl shadow-md border border-blue-200 mb-8 border-t-4 border-t-blue-600">
                  <h3 className="font-bold text-xl mb-4 text-blue-800">Form Karya Baru</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Judul Proyek</label>
                      <input suppressHydrationWarning required type="text" value={newKarya.judul} onChange={(e) => setNewKarya({...newKarya, judul: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Kategori (Msl: IoT, Web)</label>
                      <input suppressHydrationWarning required type="text" value={newKarya.kategori} onChange={(e) => setNewKarya({...newKarya, kategori: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Proyek</label>
                    <textarea suppressHydrationWarning required rows={3} value={newKarya.deskripsi} onChange={(e) => setNewKarya({...newKarya, deskripsi: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none resize-none"></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Link Live / GitHub</label>
                      <input suppressHydrationWarning type="text" value={newKarya.link_project} onChange={(e) => setNewKarya({...newKarya, link_project: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="Opsional..." />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Upload Gambar Proyek</label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2 hover:bg-gray-200">
                          <UploadCloud size={18} /> {uploading === 'karya' ? 'Mengunggah...' : 'Pilih File'}
                          <input suppressHydrationWarning type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'karyaImage')} disabled={uploading !== null} />
                        </label>
                        {newKarya.image_url && <span className="text-green-600 text-sm font-bold flex items-center gap-1">✔ Gambar siap</span>}
                      </div>
                    </div>
                  </div>
                  <button suppressHydrationWarning type="submit" disabled={isSaving} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
                    {isSaving ? 'Menyimpan ke Database...' : 'Simpan Proyek Ini'}
                  </button>
                </form>
              )}

              {/* TABEL KARYA */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="p-4 font-semibold text-gray-600 w-16">ID</th>
                      <th className="p-4 font-semibold text-gray-600">Detail Karya</th>
                      <th className="p-4 font-semibold text-gray-600 w-32 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolios.length === 0 ? (
                      <tr><td colSpan={3} className="p-8 text-center text-gray-500">Belum ada karya. Silakan tambah karya baru.</td></tr>
                    ) : (
                      portfolios.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="p-4 text-gray-600 font-medium">#{item.id}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <img src={item.image_url || 'https://via.placeholder.com/150'} alt={item.judul} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                              <div>
                                <h3 className="font-bold text-gray-800">{item.judul}</h3>
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{item.kategori}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 flex justify-center gap-3 mt-3">
                            <button onClick={() => handleDeleteKarya(item.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition" title="Hapus">
                              <Trash2 size={20} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
           </div>
        )}
      </main>
    </div>
  );
}