// app/tools/test-text-generator/page.tsx

import { Metadata } from 'next'
import TestTextGeneratorClient from './components/TestTextGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Test Text Generator - No Ads, No Sign Up | AI AutoSite',
  description:
    'Generate dummy text instantly for testing. Custom length, multiple languages, various complexity levels. 100% free, no ads, no tracking. Works offline.',
  keywords:
    'test text generator, lorem ipsum, dummy text, placeholder text, text generator, development tools, free, no ads',

  openGraph: {
    title: 'Test Text Generator - Truly Free, No Ads Ever',
    description:
      'Zero ads, zero tracking, zero BS. Create custom test text for development and testing.',
    type: 'website',
    images: [
      {
        url: '/og-test-text-generator.png',
        width: 1200,
        height: 630,
        alt: 'Free Test Text Generator - No Ads',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Test Text Generator - Free Forever, No Ads',
    description: 'Generate test text with custom specifications. Perfect for developers.',
  },

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/test-text-generator',
  },
}

export default function TestTextGeneratorPage() {
  return <TestTextGeneratorClient />
}
