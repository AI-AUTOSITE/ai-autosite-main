import { Metadata } from 'next'
import WordCounterProClient from './components/WordCounterProClient'

export const metadata: Metadata = {
  title: 'Word Counter Pro - Advanced Text Analysis | AI AutoSite',
  description: 'Count words, characters, sentences with social media limits, readability scores, and keyword density. Perfect for writers and content creators. 100% private.',
  keywords: 'word counter, character counter, text analysis, reading time, social media limits, keyword density, readability score',
  openGraph: { title: 'Word Counter Pro - Advanced Text Analysis', description: 'Complete text analysis with social media limits and readability scores.' },
  twitter: { card: 'summary_large_image', title: 'Word Counter Pro' },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://ai-autosite.com/tools/word-counter-pro' },
}

export default function WordCounterProPage() {
  return <WordCounterProClient />
}
