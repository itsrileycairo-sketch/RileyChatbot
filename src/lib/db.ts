import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '4000'),
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },
  connectTimeout: 10000 // Tunggu maksimal 10 detik
});

// RADAR PENDETEKSI: Mencoba koneksi saat server baru menyala
pool.getConnection()
  .then((conn) => {
    console.log("✅ MANTAP! KONEKSI KE TIDB CLOUD SUKSES!");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ WADUH GAGAL KONEK KE CLOUD! Alasannya:", err.message);
  });