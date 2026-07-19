import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Tidak ada file yang dipilih' }, { status: 400 });
    }

    // 1. Ambil API Key dari Vercel / .env
    const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

    if (!IMGBB_API_KEY) {
      console.error("ALARM: IMGBB_API_KEY tidak ditemukan di environment variables!");
      return NextResponse.json({ success: false, error: 'API Key ImgBB tidak diatur' }, { status: 500 });
    }

    // 🚀 2. CARA BARU YANG 100% AMPUH: Kirim sebagai Blob/File mentah!
    // Kita bungkus file asli langsung ke dalam FormData baru untuk ImgBB
    const formDataToImgbb = new FormData();
    formDataToImgbb.append('image', file); 

    // 🚀 3. Tembakkan ke server ImgBB
    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formDataToImgbb, // Kirim file mentah
    });

    const imgbbData = await imgbbRes.json();

    if (imgbbData.success) {
      // 🚀 4. SUKSES! Dapatkan link permanen
      // ImgBB memberikan link langsung di dalam objek data.url
      return NextResponse.json({ 
        success: true, 
        fileUrl: imgbbData.data.url 
      });
    } else {
      console.error("ImgBB Menolak File:", imgbbData);
      return NextResponse.json({ success: false, error: imgbbData.error?.message || 'ImgBB gagal memproses' }, { status: 500 });
    }

  } catch (e: any) {
    console.error("Server Error di /api/upload:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}