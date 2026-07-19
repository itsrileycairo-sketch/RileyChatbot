import { NextResponse } from 'next/server';
// 🔥 HARUS PAKAI KURUNG KURAWAL! 🔥
import { pool } from '@/lib/db';

const sanitizeInput = (str: string) => {
    if (!str) return '';
    return String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { nama, email, pesan } = body;

        if (!nama || !email || !pesan) {
            return NextResponse.json({ error: 'Semua kolom wajib diisi!' }, { status: 400 });
        }

        const safeNama = sanitizeInput(nama);
        const safeEmail = sanitizeInput(email);
        const safePesan = sanitizeInput(pesan);

        await pool.query(
            'INSERT INTO pesan (nama, email, pesan) VALUES (?, ?, ?)',
            [safeNama, safeEmail, safePesan]
        );

        return NextResponse.json({ message: 'Pesan berhasil terkirim ke Admin!' });

    } catch (error: any) {
        console.error("Error Simpan Pesan:", error);
        return NextResponse.json({ error: 'Gagal mengirim pesan.', detail: error.message }, { status: 500 });
    }
}