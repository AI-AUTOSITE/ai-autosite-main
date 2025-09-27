// app/tools/image-grid-maker/page.tsx
// Server Component - NO 'use client'

import { Metadata } from 'next'
import ImageGridMakerClient from './components/ImageGridMakerClient'

export const metadata: Metadata = {
  title: 'Image Grid Maker - Create Photo Grids | AI AutoSite',
  description: 'Create numbered photo grids from multiple images. Perfect for before/after, tutorials, and collages. 100% private browser tool.',
  keywords: 'image grid, photo collage, grid maker, merge images, before after, photo grid, browser tool',
  openGraph: {
    title: 'Image Grid Maker - Free Grid Creator',
    description: 'Create instant photo grids with numbers',
    type: 'website',
  }
}

export default function ImageGridMakerPage() {
  return <ImageGridMakerClient />
}