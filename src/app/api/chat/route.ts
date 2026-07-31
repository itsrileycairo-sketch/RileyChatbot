import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { history, message, image, document } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ reply: "Waduh, API Key belum dipasang nih, gue gak bisa mikir!" }, { status: 400 });
    }

    // 🔥 1. SEDOT SEMUA DATA PORTFOLIO & PROFIL DARI TIDB (DATABASE UTAMA KITA)
    let portfolioContext = "Tidak ada data karya saat ini.";
    let profileContext = "Nolan Fortino Ramadhany (Kak Riley)";
    let skillsContext = "";
    let experiencesContext = "";
    let servicesContext = "";

    try {
      const [profilRows]: any = await pool.query('SELECT * FROM profil_web WHERE id = 1').catch(() => [[]]);
      const [karyaRows]: any = await pool.query('SELECT * FROM karya ORDER BY id DESC').catch(() => [[]]);
      const [skillsRows]: any = await pool.query('SELECT * FROM skills').catch(() => [[]]);
      const [experiencesRows]: any = await pool.query('SELECT * FROM experiences ORDER BY id DESC').catch(() => [[]]);
      const [servicesRows]: any = await pool.query('SELECT * FROM services').catch(() => [[]]);

      if (profilRows.length > 0) {
        const p = profilRows[0];
        profileContext = `Nama Lengkap: ${p.nama_lengkap}, Headline: ${p.headline}, Tentang: ${p.tentang}, Email: ${p.email}, GitHub: ${p.github_link}, LinkedIn: ${p.linkedin_link}, Instagram: ${p.instagram_link}`;
      }

      if (karyaRows.length > 0) {
        const cleanData = karyaRows.map((item: any) => ({
          id: item.id,
          judul: item.judul,
          kategori: item.kategori,
          deskripsi: item.deskripsi,
          link_project: item.link_project
        }));
        portfolioContext = JSON.stringify(cleanData);
      }

      if (skillsRows.length > 0) {
        skillsContext = skillsRows.map((s: any) => `${s.nama_skill} (${s.persentase}%)`).join(', ');
      }

      if (experiencesRows.length > 0) {
        experiencesContext = experiencesRows.map((e: any) => `${e.posisi} di ${e.perusahaan} (${e.tahun}) - ${e.deskripsi}`).join(' | ');
      }

      if (servicesRows.length > 0) {
        servicesContext = servicesRows.map((s: any) => `${s.nama_layanan}: ${s.deskripsi}`).join(' | ');
      }

    } catch (dbErr) {
      console.error("Gagal mengambil context database TiDB:", dbErr);
    }

    // Ambil waktu saat ini
    const now = new Date().toLocaleString('id-ID', { 
      timeZone: 'Asia/Jakarta', 
      dateStyle: 'full', 
      timeStyle: 'long' 
    });

    const systemInstructionText = `
      Lu adalah AI asisten tongkrongan buatan Nolan Fortino Ramadhany (panggilannya Kak Riley), mahasiswa S1 Teknik Komputer UTDI Yogyakarta.
      Sikapmu: Asik, gaul, agak kocak, layaknya teman tongkrongan. Kamu punya pengalaman setara Senior Software Architect.

      INFO PENTING SAAT INI:
      - Waktu dan Tanggal: ${now}

      DATA PROFIL UTAMA KAK RILEY:
      ${profileContext}

      DAFTAR KEAHLIAN (SKILLS):
      ${skillsContext}

      PENGALAMAN KERJA / KARIR:
      ${experiencesContext}

      LAYANAN YANG DITAWARKAN:
      ${servicesContext}

      DAFTAR KARYA / PORTFOLIO ASLI DARI DATABASE:
      ${portfolioContext}

      Aturan wajib saat lu ngejawab:
      1. Jawab pakai bahasa gaul, lu-gue, asik, jangan kaku.
      2. Kalo user nanya tentang karya/project tertentu, lu HARUS periksa data PORTFOLIO di atas. Sebutin judulnya dan WAJIB kasih tau ID-nya dengan format rapi seperti ini: [PORTFOLIO_LINK:ID] agar sistem bisa memunculkan kartunya secara otomatis!
      3. Jika ditanya soal riwayat hidup, pengalaman, atau skill Kak Riley, gunakan data profil, skills, dan pengalaman karir di atas.
      4. Jika ditanya soal error kodingan atau dikirim gambar error, langsung to-the-point berikan solusinya secara teknis tanpa basa-basi minta maaf.
      5. Balas singkat, padat, and asik.
    `;

    const contents = history.map((msg: any) => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }],
    }));

    const newParts: any[] = [{ text: message }];

    if (image) {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      newParts.push({ inline_data: { mime_type: mimeType, data: base64Data } });
    } else if (document) {
      const mimeType = document.mimeType;
      const base64Data = document.base64.split(',')[1];
      newParts.push({ inline_data: { mime_type: mimeType, data: base64Data } });
    }

    contents.push({ role: 'user', parts: newParts });

    const requestBody = {
      system_instruction: { parts: [{ text: systemInstructionText }] },
      contents: contents
    };

    // Menggunakan model Gemini 1.5 Flash (atau model sesuai environment Vercel lu)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error?.message || "Google API nolak");
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error("🔥 Error Chat API:", error);
    return NextResponse.json({ reply: `Waduh, otak gue nge-bug nih bro. [ ${error.message} ]` }, { status: 500 });
  }
}