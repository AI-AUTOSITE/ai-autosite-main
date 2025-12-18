// app/tools/reverse-audio/page.tsx
import { Metadata } from 'next';
import ReverseAudioClient from './components/ReverseAudioClient';

export const metadata: Metadata = {
  title: 'Reverse Audio - Play Audio Backwards Online | AI AutoSite',
  description: 'Reverse audio files online. Play MP3, WAV, and other audio files backwards. Create reverse sound effects. 100% free, no upload required.',
  keywords: 'reverse audio, play backwards, audio reverser, reverse sound, sound effects, free online, no upload',
  openGraph: {
    title: 'Reverse Audio - Play Audio Backwards',
    description: 'Reverse audio files instantly. 100% browser-based, no upload required.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reverse Audio - Play Backwards',
    description: 'Reverse audio files instantly. 100% private, no upload.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/reverse-audio',
  },
};

export default function ReverseAudioPage() {
  return <ReverseAudioClient />;
}
