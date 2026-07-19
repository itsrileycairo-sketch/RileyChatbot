import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// Kasih tahu TypeScript kalau ini PASTI array of strings
const ALLOWED_TABLES: string[] = ['skills', 'experiences', 'services', 'blogs', 'pricing', 'pesan'];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get('table');

    // Kita paksa table jadi string (as string) biar TypeScript gak protes
    if (!table || !ALLOWED_TABLES.includes(table as string)) {
      return NextResponse.json({ error: 'Tabel invalid' }, { status: 400 });
    }

    const tableName = table as string;
    // @ts-ignore: Supaya VS Code gak bawel soal dynamic SQL table
    const [rows] = await pool.query(`SELECT * FROM ${tableName} ORDER BY id DESC`);
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Beri tipe eksplisit dari JSON yang masuk
    const body = await req.json();
    const table = body.table as string;
    const data = body.data;

    if (!table || !data || !ALLOWED_TABLES.includes(table)) {
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
    }

    return NextResponse.json({ message: 'Data berhasil ditambahkan!' });
  } catch (error: any) {
    // 🔥 FIX MUTLAK: Hilangkan ${table} dari sini karena beda alam (scope)
    console.error("Error Insert Data:", error);
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
    // @ts-ignore: Supaya VS Code gak bawel soal dynamic SQL table
    await pool.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    return NextResponse.json({ message: 'Data berhasil dihapus!' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal menghapus data', detail: error.message }, { status: 500 });
  }
}