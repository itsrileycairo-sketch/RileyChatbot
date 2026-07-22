import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { history, message, image } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ reply: "Waduh, API Key belum dipasang nih, gue gak bisa mikir!" }, { status: 400 });
    }

    // Ambil data portofolio dari MySQL
    let portfolioContext = "Tidak ada data karya saat ini.";
    try {
      const resData = await fetch("http://localhost:8000/api/portfolios");
      if (resData.ok) {
        const dbPortfolios = await resData.json();
        const cleanData = dbPortfolios.map((item: any) => ({
          id: item.id,
          judul: item.judul,
          kategori: item.kategori,
        }));
        portfolioContext = JSON.stringify(cleanData);
      }
    } catch (dbErr) {
      console.error("Gagal mengambil context database:", dbErr);
    }

    const systemInstructionText = `
      Lu adalah AI asisten tongkrongan buatan Nolan Fortino Ramadhany (panggilannya Kak Riley), mahasiswa S1 Teknik Komputer UTDI Yogyakarta.
      Sikapmu: Asik, gaul, agak kocak, layaknya teman tongkrongan. Kamu punya pengalaman setara Senior Software Architect.

      Gue udah ambil ringkasan data karya/portfolio asli dari database MySQL Kak Riley saat ini:
      ${portfolioContext}

      Aturan wajib saat lu ngejawab:
      1. Jawab pakai bahasa gaul, lu-gue, asik, jangan kaku.
      2. Kalo user nanya tentang karya/project tertentu, lu HARUS periksa data MySQL di atas. Sebutin judulnya dan WAJIB kasih tau ID-nya dengan format rapi seperti ini: [PORTFOLIO_LINK:ID] agar sistem bisa memunculkan kartunya secara otomatis!
      3. Jika ditanya soal error kodingan atau dikirim gambar error, langsung to-the-point berikan solusinya secara teknis tanpa basa-basi minta maaf.
      4. Balas singkat, padat, and asik.
    `;

    const contents = history.map((msg: any) => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }],
    }));

    const newParts: any[] = [{ text: message }];

    // 📸 Fitur Baca Gambar (Vision) TETAP DIPERTAHANKAN
    if (image) {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      newParts.push({ inline_data: { mime_type: mimeType, data: base64Data } });
    }

    contents.push({ role: 'user', parts: newParts });

    const requestBody = {
      system_instruction: { parts: [{ text: systemInstructionText }] },
      contents: contents
    };

    // 🚀 MENGGUNAKAN GEMINI 3.6 FLASH SESUAI REQUEST
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`;

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
    return NextResponse.json({ reply: `Waduh, otak gue nge-bug nih bro. [ ${error.message} ]` }, { status: 500 });
  }
}
