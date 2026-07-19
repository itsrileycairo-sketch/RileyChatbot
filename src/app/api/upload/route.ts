import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Tidak ada file' }, { status: 400 });
    }

    // 🚀 1. Panggil Kunci Rahasia ImgBB dari Vercel / .env
    const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

    if (!IMGBB_API_KEY) {
      console.error("ALARM: IMGBB_API_KEY tidak ditemukan!");
      return NextResponse.json({ success: false, error: 'Kunci API ImgBB hilang' }, { status: 500 });
    }

    // 🚀 2. Ubah file gambar menjadi teks Base64 (Bahasa yang dimengerti ImgBB)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // 🚀 3. Siapkan paket untuk dikirim ke kurir ImgBB
    const formData = new FormData();
    formData.append('image', base64Image);

    // 🚀 4. Tembakkan gambar ke server ImgBB!
    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const imgbbData = await imgbbRes.json();

    if (imgbbData.success) {
      // 🚀 5. SUKSES! Kembalikan link URL publik dari ImgBB ke Dasbor Admin
      return NextResponse.json({ 
        success: true, 
        fileUrl: imgbbData.data.url // Ini link gambar permanennya!
      });
    } else {
      // Jika ImgBB menolak (misal gambar terlalu besar / API salah)
      console.error("ImgBB Error:", imgbbData);
      return NextResponse.json({ success: false, error: 'ImgBB menolak gambar' }, { status: 500 });
    }

  } catch (e: any) {
    console.error("Detail Error Upload Server:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}