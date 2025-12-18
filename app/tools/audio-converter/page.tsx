// app/tools/audio-converter/page.tsx
import { Metadata } from 'next';
import AudioConverterClient from './components/AudioConverterClient';

export const metadata: Metadata = {
  title: 'Audio Converter - Convert MP3, WAV, OGG, FLAC Online | AI AutoSite',
  description: 'Convert between audio formats online. Support MP3, WAV, OGG, FLAC, M4A. Choose bit depth and bitrate. 100% free, no upload required.',
  keywords: 'audio converter, convert audio, mp3 converter, wav converter, ogg converter, flac converter, free online',
  openGraph: {
    title: 'Audio Converter - Convert Audio Files Online',
    description: 'Convert between MP3, WAV, OGG, FLAC. 100% browser-based.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audio Converter Online',
    description: 'Convert audio files instantly. 100% private.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/audio-converter',
  },
};

export default function AudioConverterPage() {
  return <AudioConverterClient />;
}
