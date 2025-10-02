
import { Metadata } from 'next'
import Base64Client from './components/Base64Client'

export const metadata: Metadata = {
  title: 'Free Base64 Encoder/Decoder - No Ads, No Sign Up | AI AutoSite',
  description: 'Encode & decode Base64 instantly. 100% free, no ads, works offline in your browser. No data leaves your device.',
  keywords: 'free base64 encoder, base64 decoder, no ads, privacy, no tracking, developer tools',
  openGraph: {
    title: 'Base64 Tool - Zero Ads, 100% Privacy',
    description: 'Convert Base64 without ads or tracking. Works completely offline.',
    type: 'website',
    images: [{
      url: '/og-base64.png',
      width: 1200,
      height: 630,
      alt: 'Free Base64 Tool - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 Tool - Truly Free, No Ads',
    description: 'Encode/decode offline. Zero tracking.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/base64'
  }
}

export default function Base64Page() {
  return <Base64Client />
}