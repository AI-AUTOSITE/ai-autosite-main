import { Metadata } from 'next'
import HashtagGeneratorClient from './components/HashtagGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Hashtag Generator - No Ads, No Sign Up | AI AutoSite',
  description: 'Generate 30 perfect hashtags instantly. 100% free, no ads, no tracking. Works for all platforms.',
  keywords: 'free hashtag generator, no ads, instagram tags, privacy, no sign up, tiktok hashtags',
  openGraph: {
    title: 'Hashtag Generator - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Perfect hashtags for social media instantly.',
    type: 'website',
    images: [{
      url: '/og-hashtag-generator.png',
      width: 1200,
      height: 630,
      alt: 'Free Hashtag Generator - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hashtag Generator - 100% Free',
    description: '30 perfect tags without ads or tracking.'
  }
}

export default function HashtagGeneratorPage() {
  return <HashtagGeneratorClient />
}