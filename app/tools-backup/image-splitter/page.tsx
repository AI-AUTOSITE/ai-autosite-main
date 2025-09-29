// app/tools/image-splitter/page.tsx
// Server Component - NO 'use client'

import { Metadata } from 'next'
import ImageSplitterClient from './components/ImageSplitterClient'

export const metadata: Metadata = {
  title: 'Image Splitter - Split by Paper Size | AI AutoSite',
  description: 'Split long images into pages for printing. Support for A4, A5, B5 paper sizes. Perfect for screenshots, documents, and long images.',
  keywords: 'image splitter, paper size split, A4 split, print preparation, long image split, screenshot splitter',
  openGraph: {
    title: 'Image Splitter - Split Images for Printing',
    description: 'Split long images by paper size or custom height',
    type: 'website',
  }
}

export default function ImageSplitterPage() {
  return <ImageSplitterClient />
}