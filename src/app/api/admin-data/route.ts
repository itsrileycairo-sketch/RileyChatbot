import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// Whitelist tabel biar gak kena SQL Injection pas query dinamis
const ALLOWED_TABLES = ['skills', 'experiences', 'services'];

// FUNGSI TAMBAH DATA (Skill, Exp, Service)
export async function POST(req: Request) {
  try {
    const { table, data } = await req.json();

    if (!table || !data) {
      return NextResponse.json({ error: 'Data atau tabel tidak boleh kosong' }, { status: 400 });
    }

    if (!ALLOWED_TABLES.includes(table)) {
      return NextResponse.json({ error: 'Tabel tidak valid/diizinkan' }, { status: 400 });
    }

    if (table === 'skills') {
      await pool.query('INSERT INTO skills (nama_skill, persentase) VALUES (?, ?)', [data.nama_skill, data.persentase]);
    } else if (table === 'experiences') {
      await pool.query('INSERT INTO experiences (posisi, perusahaan, tahun, deskripsi) VALUES (?, ?, ?, ?)', [data.posisi, data.perusahaan, data.tahun, data.deskripsi]);
    } else if (table === 'services') {
      await pool.query('INSERT INTO services (nama_layanan, deskripsi) VALUES (?, ?)', [data.nama_layanan, data.deskripsi]);
    }

    return NextResponse.json({ message: 'Data berhasil ditambahkan!' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal menambah data', detail: error.message }, { status: 500 });
  }
}

// FUNGSI HAPUS DATA
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get('table');
    const id = searchParams.get('id'); // Fix: 'sear' diganti 'searchParams'

    if (!table || !id) {
      return NextResponse.json({ error: 'Parameter tidak valid' }, { status: 400 });
    }

    // Validasi nama tabel biar aman dari SQL Injection
    if (!ALLOWED_TABLES.includes(table)) {
      return NextResponse.json({ error: 'Tabel tidak diizinkan' }, { status: 400 });
    }

    await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
    return NextResponse.json({ message: 'Data berhasil dihapus!' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal menghapus data', detail: error.message }, { status: 500 });
  }
}