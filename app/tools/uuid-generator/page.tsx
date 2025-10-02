import { Metadata } from 'next'
import UuidGeneratorClient from './components/UuidGeneratorClient'


export const metadata: Metadata = {
  title: 'Free UUID Generator - No Ads, No Sign Up | AI AutoSite',
  description: 'Generate random UUIDs instantly. 100% free, no ads, works offline. Bulk generation available.',
  keywords: 'free uuid generator, guid generator, no ads, unique id, privacy, no tracking',
  openGraph: {
    title: 'UUID Generator - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. Generate unique IDs without the BS.',
    type: 'website',
    images: [{
      url: '/og-uuid-generator.png',
      width: 1200,
      height: 630,
      alt: 'Free UUID Generator - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UUID Generator - Free & Private',
    description: 'Generate UUIDs offline. Zero tracking.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/uuid-generator'
  }
}

export default function UuidGeneratorPage() {
  return <UuidGeneratorClient />
}