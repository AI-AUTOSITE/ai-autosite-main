// app/tools/trim-audio/page.tsx
import { Metadata } from 'next';
import TrimAudioClient from './components/TrimAudioClient';

export const metadata: Metadata = {
  title: 'Trim Audio - Cut Audio Files Online Free | AI AutoSite',
  description: 'Cut and trim audio files online. Remove unwanted parts from MP3, WAV, and other audio files. 100% free, no upload required.',
  keywords: 'trim audio, cut audio, audio cutter, audio trimmer, mp3 cutter, wav cutter, free online, no upload',
  openGraph: {
    title: 'Trim Audio - Cut Audio Files Online',
    description: 'Cut and trim audio files instantly. 100% browser-based, no upload required.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trim Audio - Cut Audio Files Online',
    description: 'Trim audio files instantly. 100% private, no upload.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/trim-audio',
  },
};

export default function TrimAudioPage() {
  return <TrimAudioClient />;
}
