// app/tools/merge-audio/page.tsx
import { Metadata } from 'next';
import MergeAudioClient from './components/MergeAudioClient';

export const metadata: Metadata = {
  title: 'Merge Audio - Combine Audio Files Online | AI AutoSite',
  description: 'Combine multiple audio files into one. Merge MP3, WAV files with crossfade transitions. 100% free, no upload required.',
  keywords: 'merge audio, combine audio, join audio, concatenate audio, audio merger, crossfade, free online',
  openGraph: {
    title: 'Merge Audio - Combine Audio Files',
    description: 'Combine multiple audio files with crossfade. 100% browser-based.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Merge Audio Files Online',
    description: 'Merge audio files instantly. 100% private.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/merge-audio',
  },
};

export default function MergeAudioPage() {
  return <MergeAudioClient />;
}
