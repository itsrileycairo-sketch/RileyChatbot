import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// FUNGSI UNTUK MENCATAT PENGUNJUNG MASUK
export async function POST(req: Request) {
  try {
    const { path } = await req.json();
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    
    // 🔥 Jangan catat pergerakan kalau Kakak lagi asyik di halaman Admin!
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return NextResponse.json({ success: true, ignored: true });
    }

    await pool.query(
      'INSERT INTO page_views (path, user_agent) VALUES (?, ?)',
      [path, userAgent]
    );
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// FUNGSI UNTUK MENGIRIM DATA KE GRAFIK ADMIN PANEL
export async function GET() {
  try {
    // Ambil total pengunjung harian (7 hari terakhir)
    const [harian] = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as views 
      FROM page_views 
      GROUP BY DATE(created_at) 
      ORDER BY date DESC 
      LIMIT 7
    `);
    
    // Ambil 5 halaman yang paling sering di-kepo-in
    const [halamanTop] = await pool.query(`
      SELECT path, COUNT(*) as views 
      FROM page_views 
      GROUP BY path 
      ORDER BY views DESC 
      LIMIT 5
    `);

    return NextResponse.json({ chartData: harian, topPages: halamanTop });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}