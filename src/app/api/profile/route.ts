import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows]: any = await pool.query('SELECT * FROM profil_web LIMIT 1');
    if (rows.length > 0) {
      return NextResponse.json(rows[0]);
    }
    return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
  } catch (error: any) {
    // ALARM ERROR: Ini akan mencetak alasan pasti kenapa database menolak koneksi!
    console.error("🔥 ERROR FATAL DATABASE (GET):", error); 
    return NextResponse.json({ error: 'Gagal konek DB', detail: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      nama_lengkap, headline, tentang, email, 
      hero_image, about_image, github_link, linkedin_link, instagram_link 
    } = body;

    await pool.query(
      `UPDATE profil_web SET 
        nama_lengkap = ?, headline = ?, tentang = ?, email = ?,
        hero_image = ?, about_image = ?, github_link = ?, linkedin_link = ?, instagram_link = ? 
       WHERE id = 1`,
      [
        nama_lengkap, headline, tentang, email, 
        hero_image, about_image, github_link, linkedin_link, instagram_link
      ]
    );

    return NextResponse.json({ message: 'Sukses diupdate!' });
  } catch (error: any) {
    console.error("🔥 ERROR FATAL DATABASE (POST):", error);
    return NextResponse.json({ error: 'Gagal update DB', detail: error.message }, { status: 500 });
  }
}