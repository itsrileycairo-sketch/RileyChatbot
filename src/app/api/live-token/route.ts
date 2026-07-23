import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY belum dipasang di .env.local" }, { status: 400 });
    }
    return NextResponse.json({ apiKey });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}