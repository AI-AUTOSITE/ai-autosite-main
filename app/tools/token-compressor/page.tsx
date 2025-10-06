// app/tools/token-compressor/page.tsx
import { Metadata } from 'next'
import TokenCompressor from './components/TokenCompressor'

export const metadata: Metadata = {
  title: 'Free AI Token Compressor - No Ads, No Sign Up | AI AutoSite',
  description:
    'Compress files for AI sharing. 100% free, no ads, reduce tokens by 60%. Works offline.',
  keywords:
    'free token compressor, ai optimization, no ads, privacy, chatgpt tokens, claude tokens',
  openGraph: {
    title: 'AI Token Compressor - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. Compress tokens for AI without the BS.',
    type: 'website',
    images: [
      {
        url: '/og-token-compressor.png',
        width: 1200,
        height: 630,
        alt: 'Free Token Compressor - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Token Compressor - Save 60% on AI',
    description: 'Compress files privately. No uploads.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/token-compressor',
  },
}

export default function TokenCompressorPage() {
  return <TokenCompressor />
}
