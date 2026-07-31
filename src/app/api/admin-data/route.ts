import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// 🔥 FIX: achievements dan profil_web masukin ke daftar izin!
const ALLOWED_TABLES = ['skills', 'experiences', 'services', 'blogs', 'pricing', 'pesan', 'uses_setup', 'achievements', 'profil_web'];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get('table');

    if (!table || !ALLOWED_TABLES.includes(table as string)) {
      return NextResponse.json({ error: 'Tabel invalid' }, { status: 400 });
    }

    const tableName = table as string;
    // @ts-ignore: Supaya VS Code gak bawel
    const [rows] = await pool.query(`SELECT * FROM ${tableName} ORDER BY id DESC`);
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const table = body.table as string;
    const data = body.data;

    // 🔥 DETEKTOR KITA NYALAIN
    console.log("Mencoba insert ke tabel:", table);

    if (!table || !data || !ALLOWED_TABLES.includes(table)) {
      console.log("Ditolak karena tabel tidak diizinkan.");
      return NextResponse.json({ error: 'Data atau tabel tidak boleh kosong/invalid' }, { status: 400 });
    }

    if (table === 'skills') {
      await pool.query('INSERT INTO skills (nama_skill, persentase) VALUES (?, ?)', [data.nama_skill, data.persentase]);
    } else if (table === 'experiences') {
      await pool.query('INSERT INTO experiences (posisi, perusahaan, tahun, deskripsi) VALUES (?, ?, ?, ?)', [data.posisi, data.perusahaan, data.tahun, data.deskripsi]);
    } else if (table === 'services') {
      await pool.query('INSERT INTO services (nama_layanan, deskripsi) VALUES (?, ?)', [data.nama_layanan, data.deskripsi]);
    } else if (table === 'blogs') {
      await pool.query('INSERT INTO blogs (judul, konten_lengkap) VALUES (?, ?)', [data.judul, data.konten_lengkap]);
    } else if (table === 'pricing') {
      await pool.query('INSERT INTO pricing (nama_paket, harga, deskripsi, fitur, is_popular) VALUES (?, ?, ?, ?, ?)', [data.nama_paket, data.harga, data.deskripsi, data.fitur, data.is_popular]);
    } else if (table === 'uses_setup') {
      await pool.query('INSERT INTO uses_setup (kategori, nama_item, deskripsi) VALUES (?, ?, ?)', [data.kategori, data.nama_item, data.deskripsi]);
      console.log("Sukses masukin data alat tempur!");
    } else if (table === 'achievements') {
      // 🔥 FIX: Nambahin logika simpan buat Achievements!
      await pool.query('INSERT INTO achievements (judul, tahun, deskripsi) VALUES (?, ?, ?)', [data.judul, data.tahun, data.deskripsi]);
    }

    return NextResponse.json({ message: 'Data berhasil ditambahkan!' });
  } catch (error: any) {
    console.error("🔥 DATABASE ERROR:", error);
    return NextResponse.json({ error: 'Gagal menambah data', detail: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get('table');
    const id = searchParams.get('id');

    if (!table || !id || !ALLOWED_TABLES.includes(table as string)) {
      return NextResponse.json({ error: 'Parameter tidak valid' }, { status: 400 });
    }

    const tableName = table as string;
    // @ts-ignore
    await pool.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    return NextResponse.json({ message: 'Data berhasil dihapus!' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal menghapus data', detail: error.message }, { status: 500 });
  }
}