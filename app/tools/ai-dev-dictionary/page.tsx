// app/tools/ai-dev-dictionary/page.tsx
import { Metadata } from 'next'
import AIDevDictionaryClient from './components/AIDevDictionaryClient'

export const metadata: Metadata = {
  title: 'Free AI Dev Dictionary - No Ads, No Sign Up | AI AutoSite',
  description: 'Learn 100+ UI/dev terms for better AI prompts. 100% free, no ads, no tracking. Interactive examples included.',
  keywords: 'ai dictionary free, no ads, ui terms, modal, toast, development terminology, privacy',
  openGraph: {
    title: 'AI Dev Dictionary - Truly Free Learning Tool',
    description: 'Zero ads, zero tracking. Master tech terms with interactive examples.',
    type: 'website',
    images: [{
      url: '/og-ai-dictionary.png',
      width: 1200,
      height: 630,
      alt: 'Free AI Dev Dictionary - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Dev Dictionary - Free, No Ads Ever',
    description: '100+ terms explained without ads or tracking.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/ai-dev-dictionary'
  }
}

export default function AIDevDictionaryPage() {
  return <AIDevDictionaryClient />
}