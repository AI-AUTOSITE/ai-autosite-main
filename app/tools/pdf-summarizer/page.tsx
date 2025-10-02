import { Metadata } from 'next'
import PDFSummarizerClient from './components/PDFSummarizerClient'

export const metadata: Metadata = {
  title: 'Free PDF Summarizer - No Ads, No Sign Up | AI AutoSite',
  description: 'Summarize PDFs with AI instantly. 100% free, no ads, no tracking. Perfect for students.',
  keywords: 'free pdf summarizer, no ads, ai summary, study tool, privacy, no sign up',
  openGraph: {
    title: 'PDF Summarizer - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. AI-powered summaries without the BS.',
    type: 'website',
    images: [{
      url: '/og-pdf-summarizer.png',
      width: 1200,
      height: 630,
      alt: 'Free PDF Summarizer - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Summarizer - Free AI Tool',
    description: 'Summarize PDFs without ads or tracking.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/pdf-summarizer'
  }
}

export default function PDFSummarizerPage() {
  return <PDFSummarizerClient />
}