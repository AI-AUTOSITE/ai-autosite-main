import { Metadata } from 'next'
import QRCodeClient from './components/QRCodeClient'

export const metadata: Metadata = {
  title: 'Free QR Code Generator - No Ads, No Sign Up | AI AutoSite',
  description:
    'Create QR codes instantly. 100% free, no ads, works offline. Generate codes for URLs, text, WiFi.',
  keywords: 'free qr code generator, no ads, qr maker, privacy, no sign up, no tracking',
  openGraph: {
    title: 'QR Code Generator - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Create QR codes without the BS.',
    type: 'website',
    images: [
      {
        url: '/og-qr-code.png',
        width: 1200,
        height: 630,
        alt: 'Free QR Code Generator - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Maker - 100% Private',
    description: 'Generate QR codes offline. No tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/qr-code',
  },
}

export default function QRCodePage() {
  return <QRCodeClient />
}
