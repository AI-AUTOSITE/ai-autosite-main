import { Metadata } from 'next'
import JsonCsvClient from './components/JsonCsvClient'

export const metadata: Metadata = {
  title: 'Free JSON to CSV Converter - No Ads, No Sign Up | AI AutoSite',
  description: 'Convert JSON to CSV instantly. 100% free, no ads, works offline in your browser.',
  keywords: 'free json to csv, no ads, data converter, privacy, no sign up, no tracking',
  openGraph: {
    title: 'JSON to CSV - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. Convert data formats without the BS.',
    type: 'website',
    images: [{
      url: '/og-json-csv.png',
      width: 1200,
      height: 630,
      alt: 'Free JSON to CSV Converter - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to CSV - Free Forever',
    description: 'Convert data without ads or tracking.'
  }
}

export default function JsonCsvPage() {
  return <JsonCsvClient />
}