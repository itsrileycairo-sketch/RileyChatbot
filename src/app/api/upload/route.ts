import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Tidak ada file' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat nama file unik
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(file.name);
    
    // Tentukan jalur folder
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    // 🚀 PERBAIKAN KUNCI: Cek dan buat folder otomatis jika belum ada!
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Simpan file
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    return NextResponse.json({ success: true, fileUrl: `/uploads/${filename}` });
  } catch (e: any) {
    console.error("Detail Error Upload:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}