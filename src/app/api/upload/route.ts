import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Tidak ada file' }, { status: 400 });
    }

    // 🔥 KITA TEMPEL LANGSUNG KUNCINYA DI SINI! (Bebas dari error Vercel)
    const IMGBB_API_KEY = "b3aa47bf0a03d83d985e9fab9cdf8e61";

    // 1. Ubah file jadi teks Base64 murni
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // 2. Buat paket kiriman khusus untuk ImgBB
    const imgbbData = new FormData();
    imgbbData.append('key', IMGBB_API_KEY);
    imgbbData.append('image', base64Image);

    // 3. Tembak ke satelit ImgBB!
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imgbbData,
    });

    const result = await response.json();

    if (result.success) {
      // 🚀 BERHASIL! Kembalikan link ke halaman Admin
      return NextResponse.json({ success: true, fileUrl: result.data.url });
    } else {
      console.error("ImgBB Menolak:", result);
      return NextResponse.json({ success: false, error: 'Ditolak ImgBB' }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}