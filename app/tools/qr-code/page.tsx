import { Metadata } from 'next'
import QRCodeClient from './components/QRCodeClient'

export const metadata: Metadata = {
  title: 'Free QR Code Generator - No Ads, No Expiration, Logo Free | AI AutoSite',
  description:
    'Create QR codes instantly with free logo embedding. No expiration, no ads, 100% private. Generate codes for URLs, WiFi, vCard contacts. Works offline.',
  keywords: [
    'free qr code generator',
    'qr code with logo free',
    'no expiration qr code',
    'wifi qr code generator',
    'vcard qr code',
    'custom qr code colors',
    'qr code maker no ads',
    'private qr code generator',
    'offline qr code',
    'svg qr code download',
  ].join(', '),
  openGraph: {
    title: 'Free QR Code Generator - Logo Embedding Free, No Expiration',
    description:
      'Create custom QR codes with free logo embedding. No 14-day limits like QRMonkey. 100% private, works offline.',
    type: 'website',
    images: [
      {
        url: '/og-qr-code.png',
        width: 1200,
        height: 630,
        alt: 'Free QR Code Generator with Logo - No Ads, No Expiration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Generator - Free Logo, No Expiration',
    description:
      'Generate QR codes with custom colors, styles, and free logo embedding. Your codes never expire.',
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
