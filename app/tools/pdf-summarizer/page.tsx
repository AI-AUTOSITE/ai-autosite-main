import { Metadata } from 'next'
import PDFSummarizerClient from './components/PDFSummarizerClient'

export const metadata: Metadata = {
  title: 'PDF Summarizer - AI-Powered Summary Generator | AI AutoSite',
  description: 'Extract key points from PDFs instantly. AI-powered summarizer for students and researchers. Free PDF summary tool.',
  keywords: 'pdf summarizer, pdf summary, ai summarizer, study tool, pdf reader, document summary',
  openGraph: {
    title: 'PDF Summarizer - Quick Study Reviews',
    description: 'AI-powered PDF summary generator',
    type: 'website',
  },
}

export default function PDFSummarizerPage() {
  return <PDFSummarizerClient />
}