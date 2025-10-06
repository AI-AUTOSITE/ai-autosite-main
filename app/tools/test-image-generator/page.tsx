// app/tools/test-image-generator/page.tsx

import { Metadata } from 'next'
import TestImageGeneratorClient from './components/TestImageGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Test Image Generator - No Ads, No Sign Up | AI AutoSite',
  description:
    'Generate test images with custom size, format, and complexity. Perfect for testing image compression, upload systems, and performance. 100% free, no ads, works offline.',
  keywords:
    'test image generator, dummy image, image testing, compression testing, upload testing, development tools, free, no ads',

  openGraph: {
    title: 'Test Image Generator - Truly Free, No Ads Ever',
    description:
      'Zero ads, zero tracking, zero BS. Create custom test images for development and testing.',
    type: 'website',
    images: [
      {
        url: '/og-test-image-generator.png',
        width: 1200,
        height: 630,
        alt: 'Free Test Image Generator - No Ads',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Test Image Generator - Free Forever, No Ads',
    description: 'Generate test images with custom specifications. Perfect for developers.',
  },

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/test-image-generator',
  },
}

export default function TestImageGeneratorPage() {
  return <TestImageGeneratorClient />
}
