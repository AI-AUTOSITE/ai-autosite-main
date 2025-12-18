// app/tools/mp3-to-wav/page.tsx
import { Metadata } from 'next';
import Mp3ToWavClient from './components/Mp3ToWavClient';

export const metadata: Metadata = {
  title: 'MP3 to WAV Converter - Free Online, No Upload | AI AutoSite',
  description: 'Convert MP3 to WAV format instantly in your browser. 100% free, no upload required, completely private. High-quality conversion with adjustable bit depth (16, 24, 32-bit).',
  keywords: 'mp3 to wav, convert mp3, audio converter, wav converter, free converter, online converter, no upload, privacy',
  openGraph: {
    title: 'MP3 to WAV Converter - Free Online',
    description: 'Convert MP3 to WAV format instantly. 100% browser-based, no upload required.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MP3 to WAV Converter - Free Online',
    description: 'Convert MP3 to WAV instantly. 100% private, no upload.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/mp3-to-wav',
  },
};

export default function Mp3ToWavPage() {
  return <Mp3ToWavClient />;
}
