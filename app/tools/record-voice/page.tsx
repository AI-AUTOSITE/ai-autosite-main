// app/tools/record-voice/page.tsx
import { Metadata } from 'next';
import RecordVoiceClient from './components/RecordVoiceClient';

export const metadata: Metadata = {
  title: 'Record Voice - Free Online Audio Recorder | AI AutoSite',
  description: 'Record audio from your microphone and download as WAV or MP3. Free online voice recorder, no upload required, 100% private.',
  keywords: 'voice recorder, audio recorder, record microphone, record voice, free recorder, online recorder, wav recorder, mp3 recorder, no upload',
  openGraph: {
    title: 'Record Voice - Free Online Audio Recorder',
    description: 'Record audio from your microphone. Download as WAV or MP3. 100% private.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Record Voice - Free Online Audio Recorder',
    description: 'Record and download audio instantly. 100% private, no upload.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/record-voice',
  },
};

export default function RecordVoicePage() {
  return <RecordVoiceClient />;
}
