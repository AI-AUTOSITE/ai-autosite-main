// app/tools/japanese-ocr/page.tsx
import { Metadata } from 'next'
import JapaneseOCR from './components/JapaneseOCR'

export const metadata: Metadata = {
  title: 'Free Japanese OCR - No Ads, No Sign Up | AI AutoSite',
  description: 'Extract Japanese text from images instantly. 100% free, no ads, works offline. 99% accuracy.',
  keywords: 'free japanese ocr, no ads, text extraction, 日本語OCR, privacy, no tracking',
  openGraph: {
    title: 'Japanese OCR - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Extract Japanese text with 99% accuracy.',
    type: 'website',
    images: [{
      url: '/og-japanese-ocr.png',
      width: 1200,
      height: 630,
      alt: 'Free Japanese OCR Tool - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Japanese OCR - 100% Free & Private',
    description: 'Extract text offline. No uploads needed.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/japanese-ocr'
  }
}

export default function JapaneseOCRPage() {
  return <JapaneseOCR />
}