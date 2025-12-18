// app/tools/loop-audio/page.tsx
import { Metadata } from 'next';
import LoopAudioClient from './components/LoopAudioClient';

export const metadata: Metadata = {
  title: 'Loop Audio - Create Audio Loops Online | AI AutoSite',
  description: 'Create seamless audio loops online. Repeat audio files with optional crossfade. Perfect for music and sound design. 100% free, no upload.',
  keywords: 'loop audio, audio loop, repeat audio, seamless loop, music loop, free online, no upload',
  openGraph: {
    title: 'Loop Audio - Create Seamless Loops',
    description: 'Create audio loops with crossfade. 100% browser-based.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loop Audio - Create Loops',
    description: 'Create seamless audio loops. 100% private.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/loop-audio',
  },
};

export default function LoopAudioPage() {
  return <LoopAudioClient />;
}
