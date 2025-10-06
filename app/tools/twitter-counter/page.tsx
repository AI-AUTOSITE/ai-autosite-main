import { Metadata } from 'next'
import TwitterCounterClient from './components/TwitterCounterClient'

export const metadata: Metadata = {
  title: 'Free Twitter Character Counter - No Ads, No Sign Up | AI AutoSite',
  description:
    'Count tweet characters instantly. 100% free, no ads, works offline. Auto-split threads.',
  keywords: 'free twitter counter, tweet counter, no ads, character limit, privacy, no tracking',
  openGraph: {
    title: 'Twitter Counter - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Count tweet characters without the BS.',
    type: 'website',
    images: [
      {
        url: '/og-twitter-counter.png',
        width: 1200,
        height: 630,
        alt: 'Free Twitter Counter - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Counter - 100% Private',
    description: 'Count characters offline. No tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/twitter-counter',
  },
}

export default function TwitterCounterPage() {
  return <TwitterCounterClient />
}
