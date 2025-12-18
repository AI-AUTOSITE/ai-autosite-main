// app/tools/voice-transcription/page.tsx
import { Metadata } from 'next'
import VoiceTranscription from './components/VoiceTranscription'

export const metadata: Metadata = {
  title: 'Free Voice Transcription - 100% Private, No Uploads | AI AutoSite',
  description:
    'Convert speech to text with AI Whisper. 100% browser-based, completely private, no data uploads. Works offline. Unlimited free transcription.',
  keywords: 'voice transcription, speech to text, whisper, free transcription, private, offline, no upload, audio to text',
  openGraph: {
    title: 'Voice Transcription - Free, Private, Unlimited',
    description: 'AI-powered speech-to-text. Your audio never leaves your device. 100% free.',
    type: 'website',
    images: [
      {
        url: '/og-voice-transcription.png',
        width: 1200,
        height: 630,
        alt: 'Free Voice Transcription Tool - Privacy First',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voice Transcription - 100% Free & Private',
    description: 'Convert audio to text locally. No uploads, no limits.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/voice-transcription',
  },
}

export default function VoiceTranscriptionPage() {
  return <VoiceTranscription />
}
