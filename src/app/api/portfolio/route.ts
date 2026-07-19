import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Mencegah caching

export async function GET() {
  try {
    // 🚀 UPGRADE: Mengambil semua data dari berbagai tabel, dipasang .catch agar aman jika tabel kosong
    const [profilRows]: any = await pool.query('SELECT * FROM profil_web WHERE id = 1').catch(() => [[]]);
    const [karyaRows]: any = await pool.query('SELECT * FROM karya ORDER BY id DESC').catch(() => [[]]);
    const [skillsRows]: any = await pool.query('SELECT * FROM skills').catch(() => [[]]);
    const [experiencesRows]: any = await pool.query('SELECT * FROM experiences ORDER BY id DESC').catch(() => [[]]);
    const [servicesRows]: any = await pool.query('SELECT * FROM services').catch(() => [[]]);
    
    // Fitur Baru
    const [blogsRows]: any = await pool.query('SELECT * FROM blogs ORDER BY id DESC').catch(() => [[]]);
    const [pricingRows]: any = await pool.query('SELECT * FROM pricing').catch(() => [[]]);

    // Mengirim semuanya sebagai satu paket JSON ke Frontend
    return NextResponse.json({
      profil: profilRows[0] || null,
      karya: karyaRows || [],
      skills: skillsRows || [],
      experiences: experiencesRows || [],
      services: servicesRows || [],
      blogs: blogsRows || [],
      pricing: pricingRows || []
    });
  } catch (error) {
    console.error("🔥 ERROR DATABASE (GET):", error);
    return NextResponse.json({ error: 'Gagal mengambil data portfolio' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { judul, kategori, deskripsi, image_url, link_project } = body;

    await pool.query(
      `INSERT INTO karya (judul, kategori, deskripsi, image_url, link_project) VALUES (?, ?, ?, ?, ?)`,
      [judul, kategori, deskripsi, image_url, link_project]
    );

    return NextResponse.json({ message: 'Karya berhasil ditambahkan!' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal menambah karya', detail: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });

    await pool.query('DELETE FROM karya WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Karya berhasil dihapus!' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal menghapus karya' }, { status: 500 });
  }
}