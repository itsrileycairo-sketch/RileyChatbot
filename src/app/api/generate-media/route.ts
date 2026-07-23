import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json();

    if (type === 'image') {
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' }
      });
      const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
      if (!base64Image) throw new Error("Gagal gambar.");
      return NextResponse.json({ result: base64Image });
    }

    if (type === 'tts') {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: prompt,
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } } }
        }
      });
      
      const candidatePart = response.candidates?.[0]?.content?.parts?.[0];
      const audioBase64 = candidatePart?.inlineData?.data;
      const mimeType = candidatePart?.inlineData?.mimeType || 'audio/pcm;rate=24000';
      
      if (audioBase64) {
        // 🔥 FIX: Konversi PCM ke WAV langsung di Server biar Frontend terima beres
        if (mimeType.includes('audio/pcm')) {
          let sampleRate = 24000;
          const match = mimeType.match(/rate=(\d+)/);
          if (match) sampleRate = parseInt(match[1], 10);

          const pcmBuffer = Buffer.from(audioBase64, 'base64');
          const wavHeader = Buffer.alloc(44);
          
          wavHeader.write('RIFF', 0);
          wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4);
          wavHeader.write('WAVE', 8);
          wavHeader.write('fmt ', 12);
          wavHeader.writeUInt32LE(16, 16);
          wavHeader.writeUInt16LE(1, 20);
          wavHeader.writeUInt16LE(1, 22);
          wavHeader.writeUInt32LE(sampleRate, 24);
          wavHeader.writeUInt32LE(sampleRate * 2, 28);
          wavHeader.writeUInt16LE(2, 32);
          wavHeader.writeUInt16LE(16, 34);
          wavHeader.write('data', 36);
          wavHeader.writeUInt32LE(pcmBuffer.length, 40);

          const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);
          return NextResponse.json({ audio: wavBuffer.toString('base64'), mimeType: 'audio/wav' });
        }
        return NextResponse.json({ audio: audioBase64, mimeType: mimeType });
      }
      return NextResponse.json({ error: "Gagal generate audio." }, { status: 500 });
    }

    return NextResponse.json({ error: "Tipe media tidak valid" }, { status: 400 });
  } catch (error: any) {
    console.error("Media API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}