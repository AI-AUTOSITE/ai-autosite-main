// app/tools/extract-audio/page.tsx
import { Metadata } from 'next';
import ExtractAudioClient from './components/ExtractAudioClient';

export const metadata: Metadata = {
  title: 'Extract Audio from Video - MP4 to MP3 Online | AI AutoSite',
  description: 'Extract audio track from video files. Convert MP4, WebM to MP3 or WAV. 100% free, no upload required, works in your browser.',
  keywords: 'extract audio, video to audio, mp4 to mp3, video to mp3, extract sound, rip audio, free online',
  openGraph: {
    title: 'Extract Audio from Video Online',
    description: 'Extract audio from MP4, WebM videos. 100% browser-based.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Extract Audio from Video',
    description: 'Extract audio from videos instantly. 100% private.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/extract-audio',
  },
};

export default function ExtractAudioPage() {
  return <ExtractAudioClient />;
}
