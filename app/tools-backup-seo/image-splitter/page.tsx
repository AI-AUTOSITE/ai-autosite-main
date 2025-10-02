// app/tools/image-splitter/page.tsx
// Server Component - NO 'use client'

import { Metadata } from 'next'
import ImageSplitterClient from './components/ImageSplitterClient'

export const metadata: Metadata = {
  title: 'Free Image Splitter - No Ads, No Sign Up | AI AutoSite',
  description: 'Split images for printing instantly. 100% free, no ads, works offline. Support for A4, A5, B5 sizes.',
  keywords: 'free image splitter, no ads, paper size split, A4 print, privacy, no sign up',
  openGraph: {
    title: 'Image Splitter - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Split long images for perfect printing.',
    type: 'website',
    images: [{
      url: '/og-image-splitter.png',
      width: 1200,
      height: 630,
      alt: 'Free Image Splitter - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Splitter - 100% Free, No BS',
    description: 'Split images offline. Zero uploads.'
  }
}

export default function ImageSplitterPage() {
  return <ImageSplitterClient />
}