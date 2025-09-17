import { Metadata } from 'next'
import ImageGridMerger from './components/ImageGridMerger'

export const metadata: Metadata = {
  title: 'Image Grid Merger - Create Numbered Image Grids | AI AutoSite',
  description: 'Merge multiple images into a numbered grid instantly. No uploads, 100% local processing. Perfect for creating comparison charts, tutorials, and presentations.',
  keywords: 'image grid, image merger, grid maker, photo collage, image combiner, numbered grid, local processing, privacy-first',
  openGraph: {
    title: 'Image Grid Merger - Free Online Tool',
    description: 'Create numbered image grids instantly in your browser. No sign-up required.',
    type: 'website',
  }
}

export default function ImageGridMergerPage() {
  return <ImageGridMerger />
}