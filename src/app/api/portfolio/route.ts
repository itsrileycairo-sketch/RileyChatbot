import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM karya ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data karya' }, { status: 500 });
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

// FUNGSI BARU: Untuk menghapus karya dari Database
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