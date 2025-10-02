import { Metadata } from 'next'
import LoremIpsumClient from './components/LoremIpsumClient'

export const metadata: Metadata = {
  title: 'Free Lorem Ipsum Generator - No Ads, No Sign Up | AI AutoSite',
  description: 'Generate placeholder text instantly. 100% free, no ads, works offline. Create dummy text easily.',
  keywords: 'free lorem ipsum, no ads, dummy text, placeholder, privacy, no sign up',
  openGraph: {
    title: 'Lorem Ipsum Generator - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. Generate placeholder text without the BS.',
    type: 'website',
    images: [{
      url: '/og-lorem-ipsum.png',
      width: 1200,
      height: 630,
      alt: 'Free Lorem Ipsum Generator - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lorem Ipsum - Free Forever',
    description: 'Dummy text without ads or tracking.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/lorem-ipsum'
  }
}

export default function LoremIpsumPage() {
  return <LoremIpsumClient />
}