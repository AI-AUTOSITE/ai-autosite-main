// app/tools/ai-summarizer/page.tsx
import { Metadata } from 'next'
import AISummarizerComponent from './components/AISummarizer'

export const metadata: Metadata = {
  title: 'AI Text Summarizer - Free Online Text Summarization Tool | AI AutoSite',
  description: 'Transform lengthy content into concise summaries with our AI-powered text summarizer. Choose summary length and tone. Free, instant, no sign-up required.',
  keywords: 'AI summarizer, text summarization, content summary, AI text tool, summarize text, quick summary, document summarizer',
  openGraph: {
    title: 'AI Text Summarizer - Free Online Tool',
    description: 'Instantly summarize any text with AI. Choose summary length and tone.',
    type: 'website',
  }
}

export default function AISummarizerPage() {
  return <AISummarizerComponent />
}