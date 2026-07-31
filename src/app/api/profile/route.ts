import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Cek apakah baris profil dengan id = 1 sudah ada di database
    const [existing]: any = await pool.query('SELECT id FROM profil_web WHERE id = 1');

    if (existing.length === 0) {
      // 2a. Kalau belum ada, kita buatin baru (INSERT)
      await pool.query(`
        INSERT INTO profil_web 
        (id, nama_lengkap, headline, tentang, email, hero_image, about_image, github_link, linkedin_link, instagram_link) 
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        body.nama_lengkap || '',
        body.headline || '',
        body.tentang || '',
        body.email || '',
        body.hero_image || '',
        body.about_image || '',
        body.github_link || '',
        body.linkedin_link || '',
        body.instagram_link || ''
      ]);
    } else {
      // 2b. Kalau sudah ada, kita perbarui datanya (UPDATE)
      await pool.query(`
        UPDATE profil_web SET 
          nama_lengkap = ?, 
          headline = ?, 
          tentang = ?, 
          email = ?, 
          hero_image = ?, 
          about_image = ?, 
          github_link = ?, 
          linkedin_link = ?, 
          instagram_link = ?
        WHERE id = 1
      `, [
        body.nama_lengkap || '',
        body.headline || '',
        body.tentang || '',
        body.email || '',
        body.hero_image || '',
        body.about_image || '',
        body.github_link || '',
        body.linkedin_link || '',
        body.instagram_link || ''
      ]);
    }

    return NextResponse.json({ message: 'Profil berhasil disimpan mantap!' });
  } catch (error: any) {
    console.error("🔥 Error Update Profil:", error);
    return NextResponse.json({ error: 'Gagal update profil', detail: error.message }, { status: 500 });
  }
}