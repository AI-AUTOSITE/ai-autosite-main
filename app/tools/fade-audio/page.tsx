// app/tools/fade-audio/page.tsx
import { Metadata } from 'next';
import FadeAudioClient from './components/FadeAudioClient';

export const metadata: Metadata = {
  title: 'Fade Audio - Add Fade In/Out Effects Online | AI AutoSite',
  description: 'Add smooth fade in and fade out effects to audio files. Create professional transitions for MP3, WAV, and more. 100% free, no upload required.',
  keywords: 'fade audio, fade in, fade out, audio effects, audio transition, free online, no upload',
  openGraph: {
    title: 'Fade Audio - Add Fade Effects Online',
    description: 'Add fade in and fade out effects instantly. 100% browser-based.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fade Audio - Fade Effects',
    description: 'Add fade effects instantly. 100% private, no upload.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/fade-audio',
  },
};

export default function FadeAudioPage() {
  return <FadeAudioClient />;
}
