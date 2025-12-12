import { Metadata } from 'next'
import BgEraserClient from './components/BgEraserClient'

export const metadata: Metadata = {
  title: 'Free Background Remover - No Ads, No Sign Up | AI AutoSite',
  description:
    'Remove image backgrounds instantly with AI. 100% free, no ads, works offline. Images never leave your browser.',
  keywords: 'free background remover, remove background, transparent png, cutout, no ads, privacy, no sign up, ai background removal',
  openGraph: {
    title: 'Background Eraser - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. Remove backgrounds without uploading anywhere.',
    type: 'website',
    images: [
      {
        url: '/og-bg-eraser.png',
        width: 1200,
        height: 630,
        alt: 'Free Background Eraser - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Background Eraser - Free Forever, Private',
    description: 'Remove backgrounds offline. Zero uploads.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/bg-eraser',
  },
}

export default function BgEraserPage() {
  return <BgEraserClient />
}
