import { Metadata } from 'next'
import TextCounterClient from './components/TextCounterClient'


export const metadata: Metadata = {
  title: 'Free Text Counter - No Ads, No Sign Up | AI AutoSite',
  description: 'Count words and characters instantly. 100% free, no ads, works offline. Perfect for essays and social media.',
  keywords: 'free word counter, character counter, no ads, privacy, no sign up, no tracking',
  openGraph: {
    title: 'Text Counter - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Count words and characters without the BS.',
    type: 'website',
    images: [{
      url: '/og-text-counter.png',
      width: 1200,
      height: 630,
      alt: 'Free Text Counter - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Counter - Free Forever',
    description: 'Count words offline. No tracking.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/text-counter'
  }
}

export default function TextCounterPage() {
  return <TextCounterClient />
}