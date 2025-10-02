
import { Metadata } from 'next'
import UnitConverterClient from './components/UnitConverterClient'


export const metadata: Metadata = {
  title: 'Free Unit Converter - No Ads, No Sign Up | AI AutoSite',
  description: 'Convert units instantly. 100% free, no ads, works offline. Length, weight, temperature, volume conversions.',
  keywords: 'free unit converter, no ads, metric converter, imperial, privacy, no sign up',
  openGraph: {
    title: 'Unit Converter - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Convert any measurement without the BS.',
    type: 'website',
    images: [{
      url: '/og-unit-converter.png',
      width: 1200,
      height: 630,
      alt: 'Free Unit Converter - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unit Converter - 100% Free Forever',
    description: 'Convert units offline. No tracking.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/unit-converter'
  }
}

export default function UnitConverterPage() {
  return <UnitConverterClient />
}