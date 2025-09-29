import { Metadata } from 'next'
import ImageCompressClient from './components/ImageCompressClient'

export const metadata: Metadata = {
  title: 'Image Compress - Free Online Image Compressor | AI AutoSite',
  description: 'Compress images online free. Reduce JPG, PNG size by 60-80%. Keep quality, batch compress, instant download.',
  keywords: 'image compress, image compressor, reduce image size, compress jpg, compress png, tiny png',
  openGraph: {
    title: 'Image Compress - Free Online Tool',
    description: 'Make images smaller without losing quality',
    type: 'website',
  },
}

export default function ImageCompressPage() {
  return <ImageCompressClient />
}