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
        // Ganti dengan kredensial rahasia Kakak
        const adminUser = 'nolan'; 
        const adminPass = 'rileycairo';

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
  secret: process.env.NEXTAUTH_SECRET || 'rahasia_negara_super_kuat_123',
});

export { handler as GET, handler as POST };