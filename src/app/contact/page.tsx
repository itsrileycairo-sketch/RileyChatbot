'use client';
import { useEffect, useState } from 'react';
import Chatbot from '@/components/Chatbot';
import { Mail } from 'lucide-react'; // KUNCI: Hanya import Mail, jangan import Github dll!

export default function Contact() {
  const [content, setContent] = useState<any>({ email: '', github_link: '', linkedin_link: '', instagram_link: '' });

  useEffect(() => {
    const fetchContent = async () => {
      const res = await fetch('/api/profile');
      if (res.ok) setContent(await res.json());
    };
    fetchContent();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Mari Bekerja Sama</h1>
          <p className="text-xl text-gray-600">Punya ide proyek sistem cerdas atau arsitektur web? Hubungi saya kapan saja.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-center items-center text-center hover:shadow-xl transition">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <Mail size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Langsung</h2>
            <p className="text-gray-500 mb-6">Saya membalas dalam 1x24 jam.</p>
            <a href={`mailto:${content.email || '#'}`} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
              {content.email || 'Email belum diatur'}
            </a>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Sosial Media & Profesional</h3>
            <div className="space-y-6">
              {content.github_link && content.github_link !== '#' && (
                <a href={content.github_link} target="_blank" className="flex items-center gap-4 text-gray-600 hover:text-blue-600 transition group">
                  <div className="p-3 bg-gray-100 rounded-full group-hover:bg-blue-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  </div>
                  <span className="font-semibold text-lg">GitHub Repository</span>
                </a>
              )}
              {content.linkedin_link && content.linkedin_link !== '#' && (
                <a href={content.linkedin_link} target="_blank" className="flex items-center gap-4 text-gray-600 hover:text-blue-600 transition group">
                  <div className="p-3 bg-gray-100 rounded-full group-hover:bg-blue-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </div>
                  <span className="font-semibold text-lg">LinkedIn Connection</span>
                </a>
              )}
              {content.instagram_link && content.instagram_link !== '#' && (
                <a href={content.instagram_link} target="_blank" className="flex items-center gap-4 text-gray-600 hover:text-blue-600 transition group">
                  <div className="p-3 bg-gray-100 rounded-full group-hover:bg-blue-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </div>
                  <span className="font-semibold text-lg">Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </main>
  );
}