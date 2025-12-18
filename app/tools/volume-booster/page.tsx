// app/tools/volume-booster/page.tsx
import { Metadata } from 'next';
import VolumeBoosterClient from './components/VolumeBoosterClient';

export const metadata: Metadata = {
  title: 'Volume Booster - Make Audio Louder Online Free | AI AutoSite',
  description: 'Increase audio volume instantly in your browser. Make quiet audio louder, normalize volume, or reduce loud audio. 100% free, no upload required.',
  keywords: 'volume booster, increase volume, make audio louder, normalize audio, audio amplifier, free online, no upload, privacy',
  openGraph: {
    title: 'Volume Booster - Make Audio Louder Online',
    description: 'Increase audio volume instantly. 100% browser-based, no upload required.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Volume Booster - Make Audio Louder',
    description: 'Boost audio volume instantly. 100% private, no upload.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/volume-booster',
  },
};

export default function VolumeBoosterPage() {
  return <VolumeBoosterClient />;
}
