// app/tools/image-grid-maker/page.tsx
// Server Component - NO 'use client'

import { Metadata } from 'next'
import ImageGridMakerClient from './components/ImageGridMakerClient'

export const metadata: Metadata = {
  title: 'Free Image Grid Maker - No Ads, No Sign Up | AI AutoSite',
  description: 'Create numbered photo grids instantly. 100% free, no ads, works offline. Images stay private.',
  keywords: 'free image grid, no ads, photo collage, privacy, no sign up, no tracking',
  openGraph: {
    title: 'Image Grid Maker - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Create photo grids without uploading anywhere.',
    type: 'website',
    images: [{
      url: '/og-image-grid.png',
      width: 1200,
      height: 630,
      alt: 'Free Image Grid Maker - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Grid Maker - 100% Private',
    description: 'Photo grids without ads or uploads.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/image-grid-maker'
  }
}

export default function ImageGridMakerPage() {
  return <ImageGridMakerClient />
}