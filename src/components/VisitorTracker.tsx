'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      // Tembak sinyal ke API secara diam-diam (background)
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname }),
      }).catch(() => {}); // Hiraukan kalau error, biar web nggak terganggu
    }
  }, [pathname]);

  return null; // Komponen ini siluman, tidak menampilkan apa-apa di layar
}