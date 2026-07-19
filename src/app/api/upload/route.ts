import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Tidak ada file' }, { status: 400 });
    }

    const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

    if (!IMGBB_API_KEY) {
      console.error("ALARM: IMGBB_API_KEY tidak ada!");
      return NextResponse.json({ success: false, error: 'API Key ImgBB hilang' }, { status: 500 });
    }

    // 1. Ubah gambar jadi Base64 yang bersih
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // 2. Gunakan FormData bawaan server (paling stabil untuk file besar)
    const formData = new FormData();
    // Kirim string base64 murni ke field 'image'
    formData.append('image', base64Image); 

    // 3. Eksekusi ke ImgBB tanpa custom Header (biarkan fetch mengatur boundary otomatis)
    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const imgbbData = await imgbbRes.json();

    if (imgbbData.success) {
      // 4. BERHASIL! Kembalikan link gambar
      return NextResponse.json({ 
        success: true, 
        fileUrl: imgbbData.data.url 
      });
    } else {
      console.error("ImgBB Menolak (dengan pesan):", imgbbData);
      return NextResponse.json({ success: false, error: imgbbData.error?.message || 'Gagal upload' }, { status: 500 });
    }

  } catch (e: any) {
    console.error("Error Upload Server Internal:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}