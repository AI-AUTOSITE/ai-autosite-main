import { Metadata } from 'next'
import FaviconGeneratorClient from './components/FaviconGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Favicon Generator - No Ads, No Sign Up | AI AutoSite',
  description:
    'Generate all favicon sizes instantly. 100% free, no ads, works offline. No uploads required.',
  keywords: 'free favicon generator, no ads, ico creator, privacy, no tracking, no sign up',
  openGraph: {
    title: 'Favicon Generator - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Create all favicon sizes instantly in your browser.',
    type: 'website',
    images: [
      {
        url: '/og-favicon-generator.png',
        width: 1200,
        height: 630,
        alt: 'Free Favicon Generator - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Favicon Generator - 100% Free, No BS',
    description: 'Generate favicons without ads or tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/favicon-generator',
  },
}

export default function FaviconGeneratorPage() {
  return <FaviconGeneratorClient />
}
