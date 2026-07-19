import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Nolan Portfolio';
    const desc = searchParams.get('desc') || 'Full-Stack Developer | AI & IoT';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#050510',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            borderTop: '20px solid #22d3ee',
          }}
        >
          <h1
            style={{
              fontSize: 70,
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '0 50px',
              // Hapus properti textShadow karena tidak selalu disupport secara stabil di versi Edge ImageResponse
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 30,
              color: '#94a3b8',
              marginTop: 10,
            }}
          >
            {desc}
          </p>
          <div
            style={{
              display: 'flex',
              marginTop: 40,
              padding: '15px 40px',
              backgroundColor: '#22d3ee',
              borderRadius: '50px',
              color: '#050510',
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            Lihat Portofolio 🚀
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, { status: 500 });
  }
}