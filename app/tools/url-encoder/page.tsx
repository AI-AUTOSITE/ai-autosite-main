import { Metadata } from 'next'
import UrlEncoderClient from './components/UrlEncoderClient'

export const metadata: Metadata = {
  title: 'URL Encoder / Decoder - Free Online Percent Encoding | AI AutoSite',
  description:
    'Encode and decode URLs with encodeURI vs encodeURIComponent options. Features URL parser, query string builder, and double-encoding detection. 100% private, browser-based.',
  keywords: 'url encoder, url decoder, percent encoding, encodeURIComponent, encodeURI, query string, url parser, online url encode',
  openGraph: {
    title: 'URL Encoder / Decoder - Free Online Tool',
    description: 'Encode and decode URLs with smart encoding detection and query builder. No tracking.',
    type: 'website',
    images: [
      {
        url: '/og-url-encoder.png',
        width: 1200,
        height: 630,
        alt: 'URL Encoder Decoder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URL Encoder / Decoder - Free & Private',
    description: 'Smart URL encoding with parser and query builder. Zero tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/url-encoder',
  },
}

export default function UrlEncoderPage() {
  return <UrlEncoderClient />
}
