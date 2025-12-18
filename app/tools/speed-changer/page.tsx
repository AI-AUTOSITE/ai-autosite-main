// app/tools/speed-changer/page.tsx
import { Metadata } from 'next';
import SpeedChangerClient from './components/SpeedChangerClient';

export const metadata: Metadata = {
  title: 'Speed Changer - Speed Up or Slow Down Audio | AI AutoSite',
  description: 'Change audio playback speed from 0.25x to 4x. Speed up or slow down MP3, WAV, and other audio files. 100% free, no upload required.',
  keywords: 'speed changer, audio speed, speed up audio, slow down audio, tempo changer, playback speed, free online',
  openGraph: {
    title: 'Speed Changer - Speed Up or Slow Down Audio',
    description: 'Change audio speed instantly. 100% browser-based, no upload required.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speed Changer - Audio Speed Control',
    description: 'Speed up or slow down audio instantly. 100% private.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/speed-changer',
  },
};

export default function SpeedChangerPage() {
  return <SpeedChangerClient />;
}
