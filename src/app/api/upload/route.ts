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
      return NextResponse.json({ success: false, error: 'Kunci API ImgBB hilang' }, { status: 500 });
    }

    // 🚀 1. Ubah Gambar jadi Teks Raksasa (Base64)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // 🚀 2. CARA PALING AMPUH: Gunakan URLSearchParams alih-alih FormData
    // Ini memaksa browser mengirim teks murni tanpa merusak formatnya
    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append('image', base64Image);

    // 🚀 3. Tembak ke ImgBB dengan Header khusus
    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlEncodedData,
    });

    const imgbbData = await imgbbRes.json();

    if (imgbbData.success) {
      // 🚀 4. SUKSES BESAR!
      return NextResponse.json({ 
        success: true, 
        fileUrl: imgbbData.data.url 
      });
    } else {
      console.error("ImgBB Menolak:", imgbbData);
      return NextResponse.json({ success: false, error: 'Ditolak ImgBB' }, { status: 500 });
    }

  } catch (e: any) {
    console.error("Error Upload Server:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}