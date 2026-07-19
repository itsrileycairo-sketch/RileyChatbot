import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    // Ambil file mentah dari browser
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'Tidak ada file' }, { status: 400 });
    }

    // Kunci API ImgBB
    const IMGBB_API_KEY = "b3aa47bf0a03d83d985e9fab9cdf8e61";

    // Siapkan kotak paket baru khusus untuk ImgBB
    const imgbbFormData = new FormData();
    // Masukkan file mentah (binary) langsung ke dalam kotak paket
    imgbbFormData.append('image', file);

    // Tembak langsung ke ImgBB. 
    // Catatan: Jangan set 'Content-Type' secara manual, biarkan fetch yang mengaturnya otomatis menjadi multipart/form-data.
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: imgbbFormData,
    });

    const result = await response.json();

    if (result.success) {
      // BERHASIL! Kembalikan link URL asli dari ImgBB
      return NextResponse.json({ success: true, fileUrl: result.data.url });
    } else {
      console.error("ImgBB Error Response:", result);
      return NextResponse.json({ success: false, error: result.error?.message || 'Ditolak Server ImgBB' }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Internal API Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}