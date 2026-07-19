import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Access",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 🔥 MENGAMBIL KREDENSIAL DENGAN AMAN DARI FILE .env.local
        // (Sistem Vercel akan otomatis menyuntikkan data ini saat online)
        const adminUser = process.env.ADMIN_USERNAME; 
        const adminPass = process.env.ADMIN_PASSWORD;

        // Memastikan .env sudah terkonfigurasi dengan benar (mencegah error server)
        if (!adminUser || !adminPass) {
          console.error("Kredensial Admin belum diatur di Environment Variables!");
          return null;
        }

        if (credentials?.username === adminUser && credentials?.password === adminPass) {
          return { id: "1", name: "Nolan Admin", email: "admin@nolan.com" };
        }
        return null; // Gagal login
      }
    })
  ],
  pages: {
    signIn: '/admin', // Mengarahkan ke custom login page Kakak
  },
  session: { strategy: "jwt" },
  // Rahasia acak untuk enkripsi JWT
  secret: process.env.NEXTAUTH_SECRET || 'rahasia_negara_super_kuat_123', 
});

export { handler as GET, handler as POST };