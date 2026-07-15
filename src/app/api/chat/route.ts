import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ reply: "Waduh, API Key belum dipasang nih, gue gak bisa mikir!" }, { status: 400 });
        }

        // JALUR OPTION A (RAG): Ambil data portofolio dari MySQL
        let portfolioContext = "Tidak ada data karya saat ini.";
        try {
            // Catatan: Pastikan server Laravel di port 8000 Kak Riley sedang jalan kalau mau fetch ini
            const resData = await fetch("http://localhost:8000/api/portfolios");
            if (resData.ok) {
                const dbPortfolios = await resData.json();
                
                // 🚀 OPERASI DIET TOKEN
                const cleanData = dbPortfolios.map((item: any) => ({
                    id: item.id,
                    judul: item.judul,
                    kategori: item.kategori,
                }));
                portfolioContext = JSON.stringify(cleanData);
            }
        } catch (dbErr) {
            console.error("Gagal mengambil context database (mungkin server MySQL belum nyala):", dbErr);
        }

        const prompt = `
        Lu adalah AI asisten tongkrongan buatan Nolan Fortino Ramadhany (panggilannya Kak Riley), mahasiswa S1 Teknik Komputer UTDI Yogyakarta.
        
        Gue udah ambil ringkasan data karya/portfolio asli dari database MySQL Kak Riley saat ini:
        ${portfolioContext}

        Aturan wajib saat lu ngejawab:
        1. Jawab pakai bahasa gaul, lu-gue, asik, jangan kaku.
        2. Kalo user nanya atau nyari tentang karya/project/portfolio tertentu, lu HARUS periksa data MySQL di atas, sebutin judulnya, ceritain fungsinya (ngarang dikit gapapa yang penting asik sesuai judul), dan lu WAJIB kasih tau ID-nya dengan format rapi seperti ini: [PORTFOLIO_LINK:ID] agar sistem bisa memunculkan kartunya secara otomatis!
        3. Contoh cara ngasih rekomendasi link: "Gue saranin lu liat project Smart Lamp, keren abis bro! [PORTFOLIO_LINK:2]"
        4. Balas singkat, padat, dan asik.

        Pertanyaan dari user: "${message}"
        Balasan asik lu:
        `;

        // 🚀 MENGGUNAKAN gemini-3.5-flash SESUAI KODE ASLI KAK RILEY DENGAN STREAMING
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error?.message || "Google API nolak");
        }

        // 🚀 RETURN STREAM RESPONSE LANGSUNG KE FRONTEND
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