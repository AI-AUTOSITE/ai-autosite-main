// app/tools/ai-summarizer/page.tsx

import { Metadata } from 'next'
import AISummarizerClient from './components/AISummarizerClient'

export const metadata: Metadata = {
  title: 'AI Text Summarizer - Free Summary Tool | AI AutoSite',
  description: 'Transform long text into concise summaries with AI. Choose summary length and tone. Free, instant, no sign-up required.',
  keywords: 'AI summarizer, text summary, content summary, AI text tool, summarize text, quick summary',
  openGraph: {
    title: 'AI Text Summarizer - Free Online Tool',
    description: 'Instantly summarize any text with AI',
    type: 'website',
  }
}

export default function AISummarizerPage() {
  return <AISummarizerClient />
}