// app/tools/text-to-audio/page.tsx
import { Metadata } from 'next';
import TextToAudioClient from './components/TextToAudioClient';

export const metadata: Metadata = {
  title: 'Text to Audio - Text to Speech Online Free | AI AutoSite',
  description: 'Convert text to speech with natural-sounding voices. Multiple languages and voice options. 100% free, browser-based, no upload required.',
  keywords: 'text to speech, tts, text to audio, voice synthesis, speech synthesis, read aloud, free online',
  openGraph: {
    title: 'Text to Audio - Text to Speech Online',
    description: 'Convert text to speech with natural voices. 100% browser-based.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text to Speech Online',
    description: 'Convert text to speech instantly. 100% private.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/text-to-audio',
  },
};

export default function TextToAudioPage() {
  return <TextToAudioClient />;
}
