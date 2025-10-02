import { Metadata } from 'next'
import JsonFormatClient from './components/JsonFormatClient'

export const metadata: Metadata = {
  title: 'Free JSON Formatter - No Ads, No Sign Up | AI AutoSite',
  description: 'Format JSON instantly. Make it pretty or minified. 100% free, no ads, works offline.',
  keywords: 'free json formatter, no ads, json beautify, privacy, no sign up, no tracking',
  openGraph: {
    title: 'JSON Formatter - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Format JSON without uploading anywhere.',
    type: 'website',
    images: [{
      url: '/og-json-format.png',
      width: 1200,
      height: 630,
      alt: 'Free JSON Formatter - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Format - 100% Free & Private',
    description: 'Format JSON offline. Zero tracking.'
  }
}

export default function JsonFormatPage() {
  return <JsonFormatClient />
}