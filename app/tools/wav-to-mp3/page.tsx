// app/tools/wav-to-mp3/page.tsx
import { Metadata } from 'next';
import WavToMp3Client from './components/WavToMp3Client';

export const metadata: Metadata = {
  title: 'WAV to MP3 Converter - Free Online, No Upload | AI AutoSite',
  description: 'Convert WAV to MP3 format instantly in your browser. Reduce file size by up to 90%. 100% free, no upload required, completely private.',
  keywords: 'wav to mp3, convert wav, audio converter, mp3 encoder, free converter, online converter, compress audio, no upload, privacy',
  openGraph: {
    title: 'WAV to MP3 Converter - Free Online',
    description: 'Compress WAV to MP3 instantly. Reduce file size by 90%. 100% browser-based.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WAV to MP3 Converter - Free Online',
    description: 'Convert WAV to MP3 instantly. 100% private, no upload.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/wav-to-mp3',
  },
};

export default function WavToMp3Page() {
  return <WavToMp3Client />;
}
