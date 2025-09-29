import { Metadata } from 'next'
import ImageCompressClient from './components/ImageCompressClient'

export const metadata: Metadata = {
  title: 'Free Image Compressor - No Ads, No Sign Up | AI AutoSite',
  description: 'Compress images by 60-80% instantly. 100% free, no ads, works offline. Images never leave your browser.',
  keywords: 'free image compress, no ads, tiny png alternative, privacy, no tracking, no sign up',
  openGraph: {
    title: 'Image Compressor - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. Compress images without uploading anywhere.',
    type: 'website',
    images: [{
      url: '/og-image-compress.png',
      width: 1200,
      height: 630,
      alt: 'Free Image Compressor - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Compress - Free Forever, Private',
    description: 'Compress images offline. Zero uploads.'
  }
}

export default function ImageCompressPage() {
  return <ImageCompressClient />
}