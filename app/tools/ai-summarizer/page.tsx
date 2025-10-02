// app/tools/ai-summarizer/page.tsx

import { Metadata } from 'next'
import AISummarizerClient from './components/AISummarizerClient'

export const metadata: Metadata = {
  title: 'Free AI Text Summarizer - No Ads, No Sign Up | AI AutoSite',
  description: 'Summarize any text instantly with AI. 100% free, no ads, no tracking, no registration required.',
  keywords: 'free text summarizer, no ads, ai summary, content summary, privacy, no sign up',
  openGraph: {
    title: 'AI Summarizer - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Summarize text without the BS.',
    type: 'website',
    images: [{
      url: '/og-summarizer.png',
      width: 1200,
      height: 630,
      alt: 'Free AI Summarizer - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Text Summarizer - Free, No Tracking',
    description: 'Instant summaries without ads.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/ai-summarizer'
  }
}

export default function AISummarizerPage() {
  return <AISummarizerClient />
}